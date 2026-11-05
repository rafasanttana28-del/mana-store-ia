const FEEDS = [
  { country:"México", gl:"MX", hl:"es-419", ceid:"MX:es-419", niche:"Finanzas personales y organización del dinero", query:'("cómo ahorrar" OR "no me alcanza el dinero" OR "organizar gastos" OR "salir de deudas")' },
  { country:"Colombia", gl:"CO", hl:"es-419", ceid:"CO:es-419", niche:"Empleo y desarrollo profesional", query:'("buscar trabajo" OR "conseguir empleo" OR "hacer una hoja de vida" OR "entrevista laboral")' },
  { country:"España", gl:"ES", hl:"es-ES", ceid:"ES:es", niche:"Pequeños negocios y ventas", query:'("conseguir clientes" OR "aumentar ventas" OR "pequeño negocio" OR "emprendedores problemas")' },
  { country:"Chile", gl:"CL", hl:"es-419", ceid:"CL:es-419", niche:"Estudio, aprendizaje y productividad", query:'("organizar el estudio" OR "falta de tiempo" OR "hábitos de estudio" OR "productividad personal")' },
  { country:"Perú", gl:"PE", hl:"es-419", ceid:"PE:es-419", niche:"Organización del hogar y tiempo", query:'("organizar la casa" OR "falta de tiempo en casa" OR "rutinas familiares" OR "organización del hogar")' },
  { country:"Argentina", gl:"AR", hl:"es-419", ceid:"AR:es-419", niche:"Emprendimiento y trabajo independiente", query:'("cómo conseguir clientes" OR "vender por internet" OR "trabajo independiente" OR "emprender desde casa")' },
  { country:"Estados Unidos hispanohablante", gl:"US", hl:"es-419", ceid:"US:es-419", niche:"Familia, crianza y vida cotidiana", query:'("retos de la crianza" OR "organizar la vida familiar" OR "padres falta de tiempo" OR "familias hispanas")' }
];

function clean(value) {
  return String(value || "").replace(/<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>/g, "$1")
    .replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/\\s+/g, " ").trim();
}
function readTag(block, name) {
  const match = block.match(new RegExp("<" + name + "(?:\\s[^>]*)?>([\\s\\S]*?)</" + name + ">", "i"));
  return match ? clean(match[1]) : "";
}
async function collect(feed) {
  const url = "https://news.google.com/rss/search?q=" + encodeURIComponent(feed.query) +
    "&hl=" + feed.hl + "&gl=" + feed.gl + "&ceid=" + feed.ceid;
  const response = await fetch(url);
  if (!response.ok) throw new Error(feed.country + " RSS HTTP " + response.status);
  const xml = await response.text();
  return [...xml.matchAll(/<item(?:\\s[^>]*)?>([\\s\\S]*?)<\\/item>/gi)].slice(0,10).map(m => ({
    country:feed.country, niche:feed.niche, title:readTag(m[1],"title"),
    url:readTag(m[1],"link"), date:readTag(m[1],"pubDate"), source:readTag(m[1],"source")
  })).filter(x => x.title && /^https:\\/\\//i.test(x.url));
}
async function save(items) {
  const unique = [...new Map(items.map(x => [x.url,x])).values()];
  const rows = unique.map(x => ({
    niche:x.country + " · " + x.niche, market:"International", product_idea:x.title.slice(0,500),
    commercial_potential:"unproven", evidence_confidence:"low",
    rationale:"Señal exploratoria de conversación/noticia en español para investigar un posible dolor del público. País: " + x.country +
      (x.source ? ". Fuente: "+x.source : "") + (x.date ? ". Fecha: "+x.date : "") +
      ". Un titular periodístico no demuestra frecuencia del problema, intención de compra ni ventas; validar con fuentes directas del público.",
    risks:["RSS de noticias: señal indirecta, no investigación directa de comentarios o comunidades","No prueba intención de compra ni disposición a pagar","Validar recurrencia del problema, solución existente y competencia antes de crear el producto"],
    source_urls:[x.url], checked_at:new Date().toISOString(), status:"pain_signal_research_only"
  }));
  if (!rows.length) return 0;
  const response = await fetch(process.env.SUPABASE_URL.replace(/\\/$/,"")+"/rest/v1/opportunities",{
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
  const supplied=req.headers.authorization?.replace(/^Bearer\\s+/i,"") || req.headers["x-cron-secret"];
  if (!expected || supplied!==expected) return res.status(401).json({ok:false,error:"Unauthorized"});
  const missing=["SUPABASE_URL","SUPABASE_SERVICE_ROLE_KEY"].filter(k=>!process.env[k]);
  if (missing.length) return res.status(503).json({ok:false,error:"Configuration required",missing});
  try {
    const results=await Promise.allSettled(FEEDS.map(collect));
    const items=results.filter(x=>x.status==="fulfilled").flatMap(x=>x.value);
    if (!items.length) throw new Error("No se encontraron señales RSS en español");
    const saved=await save(items);
    return res.status(200).json({ok:true,mode:"spanish_market_pain_signals",countries_checked:FEEDS.length,
      feeds_failed:results.filter(x=>x.status==="rejected").length,signals_found:items.length,saved,
      checked_at:new Date().toISOString(),
      note:"Radar exploratorio en español. Las noticias son señales indirectas; no prueban dolor frecuente, intención de compra ni ventas. No crea productos, publica contenido ni activa anuncios."});
  } catch(error) { return res.status(502).json({ok:false,error:"Research run failed",detail:error.message}); }
}
