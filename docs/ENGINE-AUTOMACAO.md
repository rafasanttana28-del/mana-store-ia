# Motor de inteligência — base gratuita

## Implementado nesta etapa
- Coleta agendada de sinais públicos em feeds RSS do Google News, para nichos do Brasil e do mercado internacional.
- Registro de títulos, links e datas no Supabase.
- Proteção da rotina por CRON_SECRET e endpoint de saúde.
- Nenhuma API paga de IA ou pesquisa é necessária nesta etapa.

## Custos e limites
- A coleta RSS não exige chave paga.
- O Supabase possui faixa gratuita sujeita aos limites e termos atuais.
- Notícias são pistas para investigação: não provam vendas, intenção de compra, comissão ou lucro.
- O agendamento depende do plano Vercel e não representa um robô trabalhando continuamente 24 horas.

## Configuração
1. Criar projeto Supabase e executar supabase/schema.sql no SQL Editor.
2. Em Vercel > Settings > Environment Variables, configurar SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY e CRON_SECRET.
3. Fazer deploy e verificar /api/health.
4. Nunca colocar chaves no HTML, GitHub, mensagens ou navegador.

## Ainda não implementado
- Painel conectado ao banco e autenticação.
- Validação de links/programas e disponibilidade por país.
- Criação de produtos, checkouts ou links pessoais de afiliado.
- Publicação orgânica automática.
- Métricas reais de vendas e comissões.
- Anúncios pagos, que continuam exigindo aprovação individual.
