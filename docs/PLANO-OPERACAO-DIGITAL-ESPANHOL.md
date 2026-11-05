# MANÁ STORE IA — operação de produtos digitais em espanhol

## Objetivo
Transformar a MANÁ STORE IA em uma fábrica de produtos digitais próprios para públicos hispanohablantes fora do Brasil. A Kiwify será usada pelo responsável para cadastrar o produto, configurar checkout e entregar o arquivo. A aplicação deve produzir os materiais e preparar a divulgação.

## Escopo funcional desejado
1. Radar de dores: pesquisar sinais por país e nicho, registrar URL, data, país, problema observado, público afetado, frequência percebida, urgência, soluções existentes e confiança.
2. Validação: distinguir sinal indireto (notícia/tendência) de evidência direta (perguntas, avaliações, comentários públicos e relatos recorrentes). Nunca marcar intenção de compra como comprovada sem evidência.
3. Seleção: pontuar oportunidades por recorrência, urgência, clareza da solução, concorrência e adequação a um produto low-ticket.
4. Fábrica editorial: gerar e-book original em espanhol, sumário, capítulos, exercícios/checklists, revisão, referências, capa e PDF final; manter fontes e alertar sobre conteúdo médico, jurídico ou financeiro que exija revisão especializada.
5. Pacote de venda: nome, promessa verificável, descrição, público, preço sugerido como hipótese, página/descrição de venda, FAQ, instruções de entrega e checklist para cadastro manual na Kiwify.
6. Marketing: calendário, posts, roteiros curtos, criativos e variações de copy em espanhol adaptado ao país.
7. Publicação orgânica: somente após conectar e autorizar contas oficiais; registrar resultado real de cada publicação.
8. Anúncios pagos: criar rascunho e aguardar aprovação explícita com plataforma, conta, público, criativo, orçamento, moeda e período. Nunca gastar automaticamente sem aprovação.
9. Métricas: importar eventos reais de checkout/venda por integração oficial ou webhook validado; separar vendas, visitas, cliques e estimativas.

## Limites e estado atual
- A aplicação atual tem painel HTML legado com dados locais no navegador; não é ainda um painel multiusuário conectado ao Supabase.
- O endpoint `/api/cron/research` grava sinais RSS no Supabase. A rotina é diária, não um agente contínuo 24/7.
- Nesta alteração, o radar foi direcionado para buscas em espanhol e mercados como México, Colômbia, Espanha, Chile, Perú, Argentina e público hispanohablante dos Estados Unidos.
- RSS de notícias é somente um sinal indireto. Não equivale a pesquisa de comentários/comunidades, não prova procura comercial e não autoriza criar alegações de venda.
- A criação de e-books completos exige um provedor/modelo de IA configurado no servidor e geração/armazenamento de arquivos. Não há chave de modelo configurada no projeto no momento.
- Publicação exige integrações oficiais e permissões das redes. Anúncios pagos exigem aprovação humana específica.
- O responsável fará manualmente o cadastro do produto e upload do PDF na Kiwify.

## Próximas entregas técnicas
1. Substituir o painel local por painel autenticado conectado ao Supabase, com catálogo de produtos próprios, dores, fontes e estado de produção.
2. Criar API segura de pesquisa e validação de dores, com deduplicação e evidências por país.
3. Integrar provedor de IA via segredo de ambiente (nunca no navegador) para produzir e-books, capa, PDF e pacote de venda.
4. Implementar armazenamento privado de arquivos e botão de download no painel.
5. Criar fila editorial e integrações de publicação oficial, inicialmente em modo rascunho.
6. Integrar métricas de checkout/vendas com validação de assinatura/webhook.
7. Criar módulo de anúncios em modo rascunho, com bloqueio de publicação/gasto até aprovação explícita.

## Segurança e qualidade
- Nunca incluir segredos no GitHub, HTML ou respostas do endpoint de saúde.
- Usar autenticação e políticas RLS adequadas; service role somente no servidor.
- Não copiar e-books, imagens, marcas ou textos protegidos.
- Não inventar depoimentos, resultados, escassez, credenciais ou promessas.
- Registrar URL e data de cada evidência e sinalizar dados insuficientes.
- Respeitar termos e limites das plataformas e leis de publicidade/privacidade aplicáveis a cada país.
