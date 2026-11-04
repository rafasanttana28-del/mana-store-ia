const FEEDS = [
  { market: "Brazil", niche: "Acessórios para pets", query: "acessórios para pets produtos tendência compras" },
  { market: "Brazil", niche: "Casa e organização", query: "organização doméstica produtos utilidades tendência" },
  { market: "Brazil", niche: "Beleza e cuidados pessoais", query: "beleza cuidados pessoais produtos consumo tendência" },
  { market: "Brazil", niche: "Pequenos negócios e produtos digitais", query: "pequenos negócios ferramentas templates produtos digitais" },
  { market: "International", niche: "Pet accessories", query: "pet accessories ecommerce product trends" },
  { market: "International", niche: "Home organization", query: "home organization useful products ecommerce trends" },
  { market: "International", niche: "Small business digital tools", query: "small business templates digital tools online" }
];

function clean(value) {
  return String(value || "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/\s+/g, " ").trim();
}
function readTag(block, name) {
  const match = block.match(new RegExp("<" + name + "(?:\\s[^>]*)?>([\\s\\S]*?)</" + name + ">", "i"));
  return match ? clean(match[1]) : "";
}
async function collect(feed) {
  const region = feed.market === "Brazil" ? {hl:"pt-BR",gl:"BR",ceid:"BR:pt-BR"} : {hl:"en-US",gl:"US",ceid:"US:en"};
  const url = "https://news.google.com/rss/search?q=" + encodeURIComponent(feed.query) +
    "&hl=" + region.hl + "&gl=" + region.gl + "&ceid=" + region.ceid;
  const response = await fetch(url);
  if (!response.ok) throw new Error("RSS HTTP " + response.status);
  const xml = await response.text();
  return [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)].slice(0,8).map(m => ({
    niche:feed.niche, market:feed.market, title:readTag(m[1],"title"),
    url:readTag(m[1],"link"), date:readTag(m[1],"pubDate"), source:readTag(m[1],"source")
  })).filter(x => x.title && /^https:\/\//i.test(x.url));
}
async function save(items) {
  const unique = [...new Map(items.map(x => [x.url,x])).values()];
  const rows = unique.map(x => ({
    niche:x.niche, market:x.market, product_idea:x.title.slice(0,500),
    commercial_potential:"unproven", evidence_confidence:"low",
    rationale:"Sinal de cobertura em feed público" + (x.source ? " (fonte: "+x.source+")" : "") +
      (x.date ? ". Data: "+x.date : "") + ". Notícia não comprova demanda nem vendas.",
    risks:["Notícia não é prova de demanda","Validar preço, comissão, concorrência e disponibilidade"],
    source_urls:[x.url], checked_at:new Date().toISOString(), status:"research_only"
  }));
  if (!rows.length) return 0;
  const response = await fetch(process.env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/opportunities",{
    method:"POST", headers:{apikey:process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization:"Bearer "+process.env.SUPABASE_SERVICE_ROLE_KEY,
      "Content-Type":"application/json",Prefer:"return=minimal"}, body:JSON.stringify(rows)
  });
  if (!response.ok) throw new Error("Supabase HTTP "+response.status+": "+(await response.text()).slice(0,250));
  return rows.length;
}
export default async function handler(req,res) {
  if (req.method!=="POST" && req.method!=="GET") { res.setHeader("Allow","GET, POST"); return res.status(405).json({ok:false}); }
  const expected=process.env.CRON_SECRET;
  const supplied=req.headers.authorization?.replace(/^Bearer\s+/i,"") || req.headers["x-cron-secret"];
  if (!expected || supplied!==expected) return res.status(401).json({ok:false,error:"Unauthorized"});
  const missing=["SUPABASE_URL","SUPABASE_SERVICE_ROLE_KEY"].filter(k=>!process.env[k]);
  if (missing.length) return res.status(503).json({ok:false,error:"Configuration required",missing});
  try {
    const results=await Promise.allSettled(FEEDS.map(collect));
    const items=results.filter(x=>x.status==="fulfilled").flatMap(x=>x.value);
    if (!items.length) throw new Error("Nenhum resultado RSS coletado");
    const saved=await save(items);
    return res.status(200).json({ok:true,mode:"free_public_rss_signals",feeds_checked:FEEDS.length,
      feeds_failed:results.filter(x=>x.status==="rejected").length,signals_found:items.length,saved,
      checked_at:new Date().toISOString(),
      note:"Pesquisa exploratória. Não comprova vendas e não cria produtos, links, posts ou anúncios."});
  } catch(error) { return res.status(502).json({ok:false,error:"Research run failed",detail:error.message}); }
}
