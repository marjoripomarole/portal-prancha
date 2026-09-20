# Portal Prancha

Plataforma estudantil de Medicina 2026.2. Sete disciplinas, login individual com ChatGPT, código de convite da turma, biblioteca unificada e históricos salvos por conta em D1.

## Conteúdo

O relatório `content/import-report.json` registra 2.513 atividades e leituras: questões objetivas, discursivas, cartões e textos. A migração descartou 140 cartões com enunciado já presente. Importa as pranchas de Forma a Função, Molécula, Genética, Histo/Embrio, os dois lotes de Simulado da Semana, os cartões Anki e 71 notas/resumos. As oito pranchas do Ari permanecem como consulta.

As ferramentas completas das pranchas ficam incorporadas no portal e mantêm seus formatos originais. Seu armazenamento é redirecionado para snapshots por conta, com controle de revisão e alerta de falha/conflito. O painel distingue as tentativas nativas do histórico das ferramentas, evitando dupla contagem. Históricos dos sites antigos permanecem intactos e não migram automaticamente.

Cobertura desigual entre disciplinas; semanas sem atividades não são consideradas concluídas. As porcentagens medem o acervo disponível, não domínio do currículo. Gabaritos foram preservados; não houve nova revisão docente de todas as atividades. Datas antigas das pranchas estão identificadas como históricas.

## Acesso e dados

A página inicial é acessível; o acervo e o progresso exigem identidade fornecida pelo dispatcher do Sites e associação à turma. O convite é comparado com hash SHA-256; só o hash entra no código. Há limite por conta para tentativas de convite. Não há senha local. O código de convite está fora deste projeto, no documento de acesso do vault.

Cada consulta e escrita usa o ID autenticado no servidor, ignorando IDs fornecidos pelo cliente. Tentativas têm chave idempotente por usuário; correção objetiva é calculada no servidor. Snapshots exigem a revisão atual para evitar sobrescrita concorrente. POST exige origem igual e JSON. Assets educacionais são protegidos no Worker com `run_worker_first` e consultas de associação; não confiar apenas na interface.

Não é uma plataforma oficial da faculdade. Sem ranking, chat ou envio automático de mensagens. O titular do serviço pode administrar a base; os alunos não acessam dados de colegas pela aplicação. Sem sincronização offline: falhas ficam explícitas e a resposta permanece na tela para nova tentativa.

## Desenvolvimento

- `npm run dev -- --port 4317`: prévia com identidade fictícia local fornecida pelo starter; nunca enviada na compilação.
- `npm run build`: compilação Worker + assets.
- `npm start -- --port 4318`: Worker compilado local.
- `npx tsc --noEmit`: tipos.
- `node scripts/validate-content.mjs`: IDs, gabaritos, 1.473 referências a imagens e nove questões com marcadores.
- `node tests/integration.mjs`: testes no Worker local 4318 com contas fictícias, acesso, CSRF, idempotência, isolamento e concorrência. Requer migração local e documento de convite fora do repo. Nunca direcionar a produção.

## Atualizar o acervo

No vault original: `node scripts/import-content.mjs`, depois `node scripts/prepare-books.mjs`. O primeiro copia apenas materiais selecionados, sem PDF/áudio integral, nem arquivos de progresso antigo. O segundo transforma HTMLs em conteúdo servido após autorização. Em seguida, validar conteúdo, tipos, compilação e fluxos afetados. Não rodar a importação fora do vault sem localizar as fontes.

## Verificação inicial

- Compilação e TypeScript passaram.
- 14 verificações da API em duas contas fictícias passaram.
- Navegador: login local, convite, cartão, autoavaliação e painel; Genética incorporada, navegação e leitura salva.
- A configuração local simula apenas a identidade; autenticação ChatGPT hospedada depende do Sites.
- A leitura de progresso por WebMCP é opcional; não é necessária ao uso e depende de suporte do navegador.

Referência da proteção de assets: https://developers.cloudflare.com/workers/static-assets/routing/worker-script/
