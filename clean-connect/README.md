# MANÁ CLEAN CONNECT — piloto MVP

## O que existe nesta versão

A aplicação está em `index.html` e é um protótipo funcional de interface, em português, inglês e espanhol, para testar os fluxos de:
- publicar uma solicitação de limpeza como cliente ou empresa;
- criar um perfil profissional ou de empresa;
- explorar solicitações e perfis cadastrados no mesmo navegador;
- filtrar por país e cidade/região;
- exportar e importar backup JSON;
- apagar os dados locais.

## Limitação crítica

Esta versão usa `localStorage`. Os registros ficam somente no navegador/dispositivo que os criou. Ainda NÃO é um marketplace compartilhado entre pessoas. Não há autenticação, banco de dados remoto, mensagens, notificações, pagamentos, verificação de identidade/documentos, moderação, avaliações verificadas ou contratação dentro da plataforma.

Não usar dados reais sensíveis nem anunciar como plataforma pública pronta. O objetivo é validar a navegação e os campos antes de conectar um backend seguro.

## Arquitetura proposta para a versão pública

1. Frontend responsivo e internacionalizado (pt-BR, en-US, es).
2. Backend com autenticação e perfis separados para cliente, empresa, profissional e administrador.
3. Banco de dados com políticas de acesso por proprietário e região; nunca expor contatos ou documentos sem consentimento.
4. Solicitações com estado: rascunho, aberta, em contato, preenchida, cancelada.
5. Correspondência por país/região, serviço, data, disponibilidade, experiência declarada e requisitos.
6. Mensageria/notificações somente após autenticação e consentimento.
7. Moderação, denúncia, bloqueio, exclusão/exportação de dados e trilha de auditoria.
8. Pagamentos e comissões apenas em fase posterior, após análise tributária, regulatória e contratual em cada país.

## Plano de lançamento recomendado

### Fase 0 — protótipo (agora)
- Testar cadastro, solicitação, filtros e backup em Android e desktop.
- Corrigir textos e campos com 5–10 pessoas convidadas, sem coletar documentos ou dados sensíveis.
- Deixar explícito que os dados são locais.

### Fase 1 — piloto fechado Brasil
- Escolher uma cidade/região e validar oferta e procura com profissionais e clientes reais.
- Publicar termos de uso, política de privacidade, canal de suporte e regras de segurança.
- Implementar backend, autenticação, moderação, consentimento e exclusão de conta.
- Testar fluxo de ponta a ponta antes de aceitar público geral.

### Fase 2 — exterior
- Lançar país por país, não todos simultaneamente.
- Validar idioma, moeda, meios de contato, leis locais, regras de trabalho, proteção de dados, tributação e suporte.
- Começar com país/idioma e região definidos após pesquisa e entrevistas.

### Fase 3 — monetização
- Testar primeiro cadastro gratuito.
- Só depois avaliar assinatura empresarial, destaque patrocinado ou taxa por oportunidade concluída.
- Não cobrar por contato ou prometer trabalho antes de provar liquidez e qualidade.

## Indicadores para decidir expansão
- profissionais ativos por região e especialidade;
- solicitações válidas por região;
- tempo até o primeiro contato;
- taxa de solicitações que recebem resposta;
- taxa de contratação confirmada voluntariamente;
- reclamações, denúncias e cancelamentos;
- retenção de profissionais e clientes.

## Segurança e conformidade
- Minimização de dados: cidade/região em vez de endereço completo na busca pública.
- Contato oculto até consentimento e ação explícita.
- Não exibir documentos de identidade.
- Não alegar verificação, certificação ou antecedentes sem processo real e base legal.
- Revisão jurídica local antes de operar como intermediador de trabalho, especialmente em cada país.
- Adequar LGPD no Brasil e leis de privacidade e trabalho dos países de expansão.

## Endereço do protótipo
Se o GitHub Pages estiver habilitado para o repositório, a rota esperada é:
`https://rafasanttana28-del.github.io/mana-store-ia/clean-connect/`

A disponibilidade dessa rota e qualquer implantação Vercel precisam ser verificadas após o deploy.
