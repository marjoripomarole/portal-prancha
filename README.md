# Portal Prancha

Plataforma estudantil de Medicina 2026.2, publicada em https://portal-prancha.vercel.app. Next.js 16 no Vercel, autenticação Google via Auth.js e banco Postgres dedicado no Neon (plano gratuito, região São Paulo).

## Código e acompanhamento

- Repositório privado: https://github.com/marjoripomarole/portal-prancha
- Quadro de desenvolvimento: https://github.com/users/marjoripomarole/projects/2
- Produção: https://portal-prancha.vercel.app

A branch `main` representa a versão de produção; mudanças em desenvolvimento usam branches `codex/`. O repositório inclui o conteúdo educacional necessário à aplicação. Credenciais, arquivos `.env`, configuração local da Vercel e listas de alunos ficam fora do Git. Os materiais de estudo continuam em `protected-assets/`, servidos apenas pelas rotas autorizadas da aplicação.

## Mudança de acesso solicitada em 21/09/2026 — pendente de implementação

A responsável decidiu substituir os códigos de convite por **e-mail institucional verificado**, correlacionado às listas de alunos de cada sala para determinar turma, grupo A/B e semestre. A consulta autenticada ao Outlook em 21/09/2026 confirmou o domínio `faculdadesiriolibanes.org.br` e o uso de Microsoft/Outlook; uma relação de 100 registros identificados como alunos foi salva no vault privado, sem vínculo de sala confirmado. A política de acesso antes da associação às listas ainda precisa ser definida. O mecanismo descrito abaixo continua sendo o estado atual em produção, e não o requisito futuro.

Acompanhar a migração no [GitHub Project](https://github.com/users/marjoripomarole/projects/2/views/1?pane=issue&itemId=251546808). A decisão detalhada e o modelo de lista ficam em `_/Portal Prancha/21 set - Acesso por e-mail institucional.md` e `_/Portal Prancha/Modelo - lista de alunos.csv`, no vault fora desta aplicação. Não criar novos convites como solução futura nem incluir listas de alunos no repositório ou no cliente. A atualização diária de conteúdo não deve tentar implementar a migração de acesso antes dessas definições.

## Conteúdo e aprendizagem

O relatório `content/import-report.json` registra 2.513 atividades e leituras de sete disciplinas. Importa as pranchas de Forma a Função, Molécula, Genética, Histo/Embrio, Simulado da Semana, cartões Anki e 71 notas/resumos; 140 cartões repetidos foram descartados. As oito pranchas do Ari permanecem como consulta.

As ferramentas completas estão incorporadas. O armazenamento delas é redirecionado para snapshots da conta, com controle de revisão e alerta de falha/conflito. Tentativas da biblioteca e histórico das ferramentas são apresentados separadamente. Históricos dos sites antigos não migram automaticamente.

Leitura, respostas assistidas, acertos objetivos e autoavaliação são medidas distintas. A cobertura é desigual entre disciplinas e não equivale a domínio do currículo. Os gabaritos não receberam nova revisão docente.

## Estado da ativação em 21/09/2026

Credenciais Google configuradas no Vercel e política Google aceita pela proprietária. O botão de login está ativo; início OAuth verificado, com escopos `openid email profile` e callback correto. A página pública de privacidade está em `/privacidade`.

O aplicativo Google está **In production**, confirmado no console em 21/09/2026 após autorização explícita da proprietária. Qualquer conta Google pode iniciar o login; somente quem informar o convite da turma acessa o acervo. Login real da proprietária, ingresso pelo convite, biblioteca e prancha de Genética foram confirmados no navegador de produção.

O conteúdo privado continua protegido no servidor. Os testes de isolamento e persistência usam sessões locais temporárias; isso é distinto da verificação do login real Google em uma conta.

## Autenticação e acesso

A entrada usa exclusivamente Google, com escopos `openid email profile`, e exige e-mail verificado. A sessão é assinada e criptografada pelo Auth.js, com duração de sete dias. A identidade é `google:<sub>`; cabeçalhos de identidade do antigo Sites não são aceitos.

Após o login, o aluno informa o convite e confere turma, grupo A/B, semestre letivo e período do curso antes de confirmar. Há quatro convites distintos em 2026.2: T1A, T1B, T2A e T2B. A configuração em `content/cohorts.json` contém somente hashes SHA-256; os códigos completos ficam no vault, fora do projeto. Cada consulta ou confirmação de convite conta no limite de oito requisições por conta a cada dez minutos, aplicado atomicamente.

A tabela `members` mantém a identidade e o progresso. `enrollments` registra uma única turma por conta e semestre letivo. Outro convite do mesmo semestre não sobrescreve essa matrícula, inclusive em requisições concorrentes. A exportação inclui as matrículas da própria conta. Convites não permitem consultar respostas de colegas.

A autorização exige matrícula em um grupo habilitado do `activeTerm`. Uma matrícula antiga ou grupo inexistente não libera o acervo atual. O convite global anterior foi retirado do aplicativo; contas existentes usam um dos novos convites para se vincular, sem alterar a data de criação, respostas ou snapshots. A proprietária confirmou que pertence à T2A.

T3 está prevista para 2027 em `futureCohorts`, sem convite ativo. Os grupos são cadastrados explicitamente: não são deduzidos da passagem do calendário. Para um novo semestre, acrescente grupos/convites com hashes novos e altere `activeTerm` após conferir o calendário; mantenha os registros históricos e os identificadores de conteúdo. Uma correção administrativa de turma altera apenas a matrícula específica, preservando a conta e seu histórico.

As quatro turmas compartilham o acervo disponível, principalmente do segundo semestre do curso. A identificação da T1 não cria conteúdo do terceiro semestre. Apenas a T2A tem calendário de avaliações cadastrado; os demais grupos recebem uma indicação de calendário ainda indisponível.

Todas as consultas e escritas usam a identidade verificada no servidor. IDs enviados pelo cliente não permitem consultar colegas. O banco é acessível apenas pelo servidor. Os arquivos educacionais ficam em `protected-assets`, fora de `public`, e são servidos por rotas que verificam sessão e matrícula. A página inicial e a descrição do acervo são públicas.

As tentativas são idempotentes por conta/evento, inclusive em requisições concorrentes. A correção objetiva ocorre no servidor. Snapshots usam revisão otimista para evitar sobrescrita entre dispositivos. As escritas exigem origem igual e JSON. Não há sincronização offline: falhas são exibidas para nova tentativa.

## Configuração

Variáveis de produção no Vercel:

- `DATABASE_URL`: fornecida pela integração Neon.
- `AUTH_SECRET`: segredo exclusivo de produção, nunca no cliente.
- `AUTH_GOOGLE_ID` e `AUTH_GOOGLE_SECRET`: cliente OAuth Web do Google.
- `AUTH_URL=https://portal-prancha.vercel.app`.

Redirect autorizado no Google: `https://portal-prancha.vercel.app/api/auth/callback/google`.
Projeto Google dedicado: Portal Prancha (`hopeful-expanse-509221-i6`). A chave Google está marcada como sensível no Vercel; uma cópia local protegida fica em `.env.google.local`, ignorada pelo Git e pelo deploy. Não imprimir seu conteúdo.
O botão de entrada permanece desativado se a configuração Google ou o banco estiverem ausentes.

A publicação anterior no Sites foi substituída como destino principal. Nenhum runtime ou login do Sites é necessário ao aplicativo atual.

## Desenvolvimento e verificação

- `npm ci` e `npm run dev` iniciam Next.js.
- `npm run build` compila para Vercel; `npm start` executa a compilação.
- `npx tsc --noEmit` verifica os tipos.
- `npm run validate:content` verifica IDs, gabaritos e referências a imagens.
- `npm run db:migrate` aplica em ordem as migrações ainda não registradas em `schema_migrations`, a partir de `db/migrations`, usando `.env.production.local` local e ignorado pelo Git.
- `node --env-file=.env.test.local node_modules/next/dist/bin/next start --hostname localhost --port 4318` inicia o teste local com segredo de sessão exclusivo.
- `npm run test:integration` testa o servidor local contra o banco dedicado. Cria oito identidades temporárias, assina sessões com o segredo local e remove os registros de teste ao terminar. Não simula o consentimento Google: o fluxo OAuth real exige verificação separada no navegador.

Verificados na migração inicial: 2.513 IDs, 1.473 referências a imagens e nove marcadores visuais. Na divisão de turmas, a compilação local com Webpack e TypeScript passou, assim como 31 verificações de acesso/persistência. O Turbopack local encontrou uma restrição de porta do ambiente; a publicação mantém o compilador padrão da Vercel. As verificações cobrem isolamento, sessão adulterada, cabeçalhos falsos, convite, CSRF, correção, repetição concorrente, conflitos de snapshot, imagens privadas e pranchas completas. A ampliação para turmas acrescenta prévia de convite, os quatro grupos, rejeição do convite antigo e de T3, disputa de matrícula, limite concorrente de tentativas, bloqueio por semestre/grupo inválido e preservação do histórico entre semestres.

## Atualização do acervo

No vault original, execute `node scripts/import-content.mjs` e `node scripts/prepare-books.mjs`. As fontes originais são preservadas. Depois valide o conteúdo, compile e teste os fluxos afetados. Apenas materiais selecionados são importados; atividades pessoais, áudios e documentos completos da turma não são publicados automaticamente.

## Publicação

`vercel deploy --prod --yes`. O projeto está vinculado em `.vercel/project.json` (ignorado pelo Git). Segredos nunca devem aparecer no README, histórico Git, cliente ou logs. As variáveis locais `.env*` também estão excluídas do upload.

Referências: [Auth.js Google](https://authjs.dev/getting-started/providers/google), [Next.js no Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs), [Neon serverless](https://neon.com/docs/serverless/serverless-driver).
