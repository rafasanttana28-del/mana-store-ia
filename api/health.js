export default function handler(req, res) {
  if (req.method !== "GET") { res.setHeader("Allow", "GET"); return res.status(405).json({ok:false}); }
  const checks = {
    database: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    scheduler_secret: Boolean(process.env.CRON_SECRET),
    research_source: "Google News RSS público; sem chave paga"
  };
  const configured = Number(checks.database) + Number(checks.scheduler_secret);
  return res.status(200).json({ok:true,service:"mana-store-ia",
    mode:configured===2?"ready_for_connection_test":"setup_required",
    configured,required:2,checks,
    note:"Verifica configuração, não confirma contas conectadas nem vendas."});
}
