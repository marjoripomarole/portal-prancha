# Portal Prancha

Plataforma estudantil de Medicina 2026.2, publicada em https://portal-prancha.vercel.app. Next.js 16 no Vercel, autenticação Google via Auth.js e banco Postgres dedicado no Neon (plano gratuito, região São Paulo).

## Conteúdo e aprendizagem

O relatório `content/import-report.json` registra 2.513 atividades e leituras de sete disciplinas. Importa as pranchas de Forma a Função, Molécula, Genética, Histo/Embrio, Simulado da Semana, cartões Anki e 71 notas/resumos; 140 cartões repetidos foram descartados. As oito pranchas do Ari permanecem como consulta.

As ferramentas completas estão incorporadas. O armazenamento delas é redirecionado para snapshots da conta, com controle de revisão e alerta de falha/conflito. Tentativas da biblioteca e histórico das ferramentas são apresentados separadamente. Históricos dos sites antigos não migram automaticamente.

Leitura, respostas assistidas, acertos objetivos e autoavaliação são medidas distintas. A cobertura é desigual entre disciplinas e não equivale a domínio do currículo. Os gabaritos não receberam nova revisão docente.

## Autenticação e acesso

A entrada usa exclusivamente Google, com escopos `openid email profile`, e exige e-mail verificado. A sessão é assinada e criptografada pelo Auth.js, com duração de sete dias. A identidade é `google:<sub>`; cabeçalhos de identidade do antigo Sites não são aceitos.

Após o login, o aluno informa o convite da turma. Apenas o SHA-256 do convite é versionado. O documento com o código está fora do projeto, no vault. Há limite de oito tentativas por conta a cada dez minutos.

Todas as consultas e escritas usam a identidade verificada no servidor. IDs enviados pelo cliente não permitem consultar colegas. O banco é acessível apenas pelo servidor. Os arquivos educacionais ficam em `protected-assets`, fora de `public`, e são servidos por rotas que verificam sessão e matrícula. A página inicial e a descrição do acervo são públicas.

As tentativas são idempotentes por conta/evento, inclusive em requisições concorrentes. A correção objetiva ocorre no servidor. Snapshots usam revisão otimista para evitar sobrescrita entre dispositivos. As escritas exigem origem igual e JSON. Não há sincronização offline: falhas são exibidas para nova tentativa.

## Configuração

Variáveis de produção no Vercel:

- `DATABASE_URL`: fornecida pela integração Neon.
- `AUTH_SECRET`: segredo exclusivo de produção, nunca no cliente.
- `AUTH_GOOGLE_ID` e `AUTH_GOOGLE_SECRET`: cliente OAuth Web do Google.
- `AUTH_URL=https://portal-prancha.vercel.app`.

Redirect autorizado no Google: `https://portal-prancha.vercel.app/api/auth/callback/google`.
Projeto Google dedicado: Portal Prancha (`hopeful-expanse-509221-i6`).
O botão de entrada permanece desativado se a configuração Google ou o banco estiverem ausentes.

A publicação anterior no Sites foi substituída como destino principal. Nenhum runtime ou login do Sites é necessário ao aplicativo atual.

## Desenvolvimento e verificação

- `npm ci` e `npm run dev` iniciam Next.js.
- `npm run build` compila para Vercel; `npm start` executa a compilação.
- `npx tsc --noEmit` verifica os tipos.
- `npm run validate:content` verifica IDs, gabaritos e referências a imagens.
- `npm run db:migrate` aplica o SQL idempotente em `db/migrations`, usando `.env.production.local` local e ignorado pelo Git.
- `node --env-file=.env.test.local node_modules/next/dist/bin/next start --hostname localhost --port 4318` inicia o teste local com segredo de sessão exclusivo.
- `npm run test:integration` testa o servidor local contra o banco dedicado. Cria duas identidades temporárias, assina sessões com o segredo local e remove os registros de teste ao terminar. Não simula o consentimento Google: o fluxo OAuth real exige verificação separada no navegador.

Verificados nesta migração: compilação, tipos, 2.513 IDs, 1.473 referências a imagens, nove marcadores visuais e 18 verificações de acesso/persistência. As verificações cobrem isolamento, sessão adulterada, cabeçalhos falsos, convite, CSRF, correção, repetição concorrente, conflitos de snapshot, imagens privadas e pranchas completas.

## Atualização do acervo

No vault original, execute `node scripts/import-content.mjs` e `node scripts/prepare-books.mjs`. As fontes originais são preservadas. Depois valide o conteúdo, compile e teste os fluxos afetados. Apenas materiais selecionados são importados; atividades pessoais, áudios e documentos completos da turma não são publicados automaticamente.

## Publicação

`vercel deploy --prod --yes`. O projeto está vinculado em `.vercel/project.json` (ignorado pelo Git). Segredos nunca devem aparecer no README, histórico Git, cliente ou logs. As variáveis locais `.env*` também estão excluídas do upload.

Referências: [Auth.js Google](https://authjs.dev/getting-started/providers/google), [Next.js no Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs), [Neon serverless](https://neon.com/docs/serverless/serverless-driver).
