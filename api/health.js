export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const checks = {
    database: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    research: Boolean(process.env.TAVILY_API_KEY),
    ai: Boolean(process.env.OPENAI_API_KEY),
    scheduler: Boolean(process.env.CRON_SECRET)
  };

  const configured = Object.values(checks).filter(Boolean).length;
  return res.status(200).json({
    ok: true,
    service: "mana-store-ia",
    mode: configured === 4 ? "ready-for-connection-test" : "setup-required",
    configured,
    required: 4,
    checks,
    note: "This endpoint reports configuration only; it does not claim that external accounts are connected or that sales are occurring."
  });
}
