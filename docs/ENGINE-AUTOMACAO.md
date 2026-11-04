# Motor de inteligência — primeira etapa

## O que esta entrega implementa
- Endpoint de saúde que informa quais variáveis de integração foram configuradas.
- Pesquisa agendada diária com Tavily, análise estruturada com OpenAI e gravação de oportunidades no Supabase.
- Proteção do endpoint de rotina por segredo CRON.
- Modelo de dados sem políticas de leitura pública.
- A pesquisa registra evidências e riscos; não garante vendas nem escolhe automaticamente produtos para anunciar.

## O que ainda depende de configuração
1. Criar projeto Supabase e executar `supabase/schema.sql`.
2. Criar chave Tavily para pesquisa web.
3. Configurar chave OpenAI e, opcionalmente, `OPENAI_MODEL`.
4. Criar um segredo forte para `CRON_SECRET`.
5. Cadastrar todas as variáveis em Vercel > Settings > Environment Variables (Production e Preview, se desejar).
6. Fazer deploy e verificar `/api/health`. A execução agendada só poderá funcionar quando todas as quatro integrações estiverem configuradas.

## Limites desta fase
- O painel HTML atual ainda usa armazenamento local; esta rotina grava no Supabase, mas a interface ainda precisa ser conectada à base.
- A rotina pesquisa oportunidades, não compra produtos, não gera links pessoais de afiliado, não publica posts e não cria anúncios.
- Publicação exige conexão oficial e permissões das redes. Anúncios permanecem bloqueados até aprovação explícita por campanha.
- Nunca coloque chaves no HTML, no GitHub, em mensagens ou no navegador.
- Em Vercel Hobby, o agendamento Cron tem limitações de frequência; o horário configurado é UTC e pode variar conforme o plano. Confirmar limites atuais do plano antes de depender de execução crítica.

## Próximas entregas
1. Conectar o painel ao Supabase com autenticação de usuário (sem expor service-role).
2. Tela de inteligência que mostra as oportunidades pesquisadas e suas fontes.
3. Catálogo sincronizado e validação de links/programas.
4. Fila de conteúdo com aprovação e integração oficial de publicação.
5. Importação de métricas de afiliados e relatórios.
6. Campanhas pagas apenas com autorização individual e limites de orçamento.
