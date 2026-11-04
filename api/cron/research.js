const SEARCH_TERMS = [
  "best selling pet accessories consumer products ecommerce trends",
  "popular home organization products ecommerce trends",
  "viral practical everyday products ecommerce marketplace trends",
  "small business digital products templates tools market demand",
  "Brazil ecommerce consumer product trends marketplace"
];

function jsonResponse(res, status, body) {
  return res.status(status).json(body);
}

async function searchWeb(query) {
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query,
      search_depth: "advanced",
      max_results: 5,
      include_answer: true
    })
  });
  if (!response.ok) throw new Error("Research provider returned " + response.status);
  const data = await response.json();
  return {
    query,
    answer: data.answer || "",
    results: (data.results || []).map((item) => ({
      title: item.title || "",
      url: item.url || "",
      content: (item.content || "").slice(0, 1800),
      published_date: item.published_date || null,
      score: item.score ?? null
    }))
  };
}

async function generateOpportunities(research) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: [
            "You are the MANÁ STORE IA commercial research analyst.",
            "Return only valid JSON with key opportunities, an array of at most 8 objects.",
            "Each object must contain niche, market, product_idea, commercial_potential, evidence_confidence, rationale, risks, source_urls, checked_at.",
            "market must be Brazil or International. commercial_potential must be low, medium, high, or unproven. evidence_confidence must be low, medium, or high.",
            "Never invent sales volume, commissions, prices, rankings, trend statistics, or product availability.",
            "A source URL must come from the supplied search results. Prefer primary/credible sources and current evidence.",
            "If evidence is weak, say so and lower confidence. Do not turn general market size into proof that a specific product sells.",
            "Treat this as research, not a guarantee of profit. Do not recommend regulated, counterfeit, unsafe, or restricted products."
          ].join(" ")
        },
        {
          role: "user",
          content: "Research date: " + new Date().toISOString() + "\nResearch evidence:\n" + JSON.stringify(research)
        }
      ]
    })
  });
  if (!response.ok) throw new Error("AI provider returned " + response.status);
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI provider returned an empty response");
  const parsed = JSON.parse(content);
  return Array.isArray(parsed.opportunities) ? parsed.opportunities.slice(0, 8) : [];
}

async function saveOpportunities(opportunities) {
  const rows = opportunities.map((item) => ({
    niche: String(item.niche || "Unspecified").slice(0, 180),
    market: item.market === "International" ? "International" : "Brazil",
    product_idea: String(item.product_idea || "").slice(0, 500),
    commercial_potential: ["low", "medium", "high", "unproven"].includes(item.commercial_potential) ? item.commercial_potential : "unproven",
    evidence_confidence: ["low", "medium", "high"].includes(item.evidence_confidence) ? item.evidence_confidence : "low",
    rationale: String(item.rationale || "").slice(0, 2000),
    risks: Array.isArray(item.risks) ? item.risks.map(String).slice(0, 12) : [],
    source_urls: Array.isArray(item.source_urls) ? item.source_urls.filter((url) => typeof url === "string" && /^https:\/\//i.test(url)).slice(0, 8) : [],
    checked_at: new Date().toISOString(),
    status: "research_only"
  }));

  if (!rows.length) return 0;
  const response = await fetch(process.env.SUPABASE_URL.replace(/\/$/, "") + "/rest/v1/opportunities", {
    method: "POST",
    headers: {
      "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY,
      "Authorization": "Bearer " + process.env.SUPABASE_SERVICE_ROLE_KEY,
      "Content-Type": "application/json",
      "Prefer": "return=minimal"
    },
    body: JSON.stringify(rows)
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error("Database write failed (" + response.status + "): " + detail.slice(0, 400));
  }
  return rows.length;
}

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") {
    res.setHeader("Allow", "GET, POST");
    return jsonResponse(res, 405, { ok: false, error: "Method not allowed" });
  }

  const expected = process.env.CRON_SECRET;
  const supplied = req.headers.authorization?.replace(/^Bearer\s+/i, "") || req.headers["x-cron-secret"];
  if (!expected || supplied !== expected) {
    return jsonResponse(res, 401, { ok: false, error: "Unauthorized" });
  }

  const required = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "TAVILY_API_KEY", "OPENAI_API_KEY"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) return jsonResponse(res, 503, { ok: false, error: "Configuration required", missing });

  try {
    const research = await Promise.all(SEARCH_TERMS.map(searchWeb));
    const opportunities = await generateOpportunities(research);
    const saved = await saveOpportunities(opportunities);
    return jsonResponse(res, 200, {
      ok: true,
      researched_queries: research.length,
      generated: opportunities.length,
      saved,
      checked_at: new Date().toISOString(),
      note: "Research records only. No product was purchased, no affiliate link was created, and nothing was published."
    });
  } catch (error) {
    return jsonResponse(res, 502, { ok: false, error: "Research run failed", detail: error.message });
  }
}
