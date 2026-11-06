export default async function handler(req,res) {
  if (req.method !== "GET") { res.setHeader("Allow","GET"); return res.status(405).json({ok:false,error:"Method not allowed"}); }
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(503).json({ok:false,error:"Supabase não configurado no servidor."});
  try {
    const endpoint = url.replace(/\/$/,"") + "/rest/v1/opportunities?select=niche,market,product_idea,commercial_potential,evidence_confidence,rationale,risks,source_urls,checked_at,status&order=checked_at.desc&limit=40";
    const response = await fetch(endpoint,{headers:{apikey:key,Authorization:"Bearer "+key}});
    if (!response.ok) throw new Error("Supabase HTTP "+response.status);
    const items = await response.json();
    return res.status(200).json({ok:true,items,updated_at:items[0]?.checked_at || null, note:"Sinais exploratórios; notícias não comprovam intenção de compra."});
  } catch (error) {
    return res.status(502).json({ok:false,error:"Não foi possível ler o radar.",detail:error.message});
  }
}