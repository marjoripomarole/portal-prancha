# Portal Prancha

Plataforma estudantil de Medicina 2026.2 em https://portal-prancha.vercel.app. Next.js 16, Vercel e Postgres dedicado no Neon.

- Código privado: https://github.com/marjoripomarole/portal-prancha
- Quadro: https://github.com/users/marjoripomarole/projects/2
- Push para `main` publica automaticamente em produção. Credenciais e listas de alunos ficam fora do Git.

## Acesso por código — 23/09/2026

Por decisão explícita da responsável, Google foi retirado. O aluno informa o código da turma e recebe uma identidade aleatória `device:<uuid>` criada pelo servidor. O código não é identidade de aluno e nunca é usado como chave de histórico. A interface informa que cada perfil de navegador/dispositivo tem seu próprio progresso, compartilhado por pessoas que usem esse mesmo perfil.

Dois cookies HttpOnly, SameSite=Lax, com duração de 180 dias guardam separadamente identidade e sessão. Em produção usam Secure e prefixo __Host-. Os tokens são cifrados/autenticados com AUTH_SECRET e salts distintos. Sair apaga somente a sessão; entrar novamente com o código no mesmo navegador retoma a identidade persistente. Cookies apagados/expirados, janela anônima e outros aparelhos não recuperam automaticamente o histórico. Não existe recuperação por e-mail.

POST `/api/access` aceita login/logout somente com Origin igual e JSON. A entrada tem limite atômico de 300 requisições por rede a cada dez minutos, para permitir uma sala na mesma rede. O endereço recebido do cabeçalho da Vercel é transformado com HMAC antes do armazenamento; cabeçalhos forwarded genéricos não são aceitos. A admissão mantém ainda o limite de oito tentativas por identidade a cada dez minutos.

O código fornecido pela responsável já corresponde ao hash da T2A em `content/cohorts.json`; nenhum código completo é incluído no código-fonte, cliente, logs ou documentação pública. Os demais grupos existentes continuam conforme o cadastro: T1A/B e T2A/B em 2026.2; T3 somente futura, sem acesso ativo. Não alteramos matrículas existentes ou semestre ativo.

Históricos Google permanecem no banco, sem exclusão ou associação automática a novas identidades. Cookies Google antigos não são aceitos. Rotas OAuth antigas retornam 410. Recuperar um histórico antigo exige fluxo administrativo separado com comprovação de titularidade; o código da turma nunca concede esse acesso. A proposta anterior de autenticação por e-mail institucional foi substituída por esta decisão.

## Conteúdo e privacidade

2.732 itens de sete disciplinas. Materiais ficam em `protected-assets`, servidos após verificar sessão e matrícula. IDs de usuário enviados pelo cliente não determinam de quem é o histórico. Tentativas são idempotentes; snapshots usam revisão otimista. Leituras, ajuda, acertos e autoavaliações continuam distintos. Históricos dos sites antigos não migram automaticamente. Pranchas incorporadas mantêm seus próprios estilos e chaves de armazenamento.

O visual do Portal usa azul FSL #0061af e branco, tipografia forte, contornos e navegação arredondada, inspirado na direção visual do Decisivas. A verificação de celular inclui ausência de rolagem lateral e filtros legíveis.

## Configuração

Variáveis necessárias: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL=https://portal-prancha.vercel.app`. AUTH_SECRET precisa permanecer estável para recuperar cookies existentes. Credenciais Google antigas não são usadas, mas não foram revogadas ou removidas do provedor neste trabalho. Variáveis sensíveis na Vercel não devem ser sobrescritas com `vercel env pull`.

Neon está conectado apenas à produção. Previews não devem ganhar acesso ao banco de produção. `.env.production.local` e `.env.test.local` são privados, ignorados por Git e deploy; o ambiente de teste usa segredo de sessão diferente.

## Verificação

- `npm run build`: build padrão na Vercel; localmente pode-se usar `next build --webpack` se Turbopack falhar por restrição de porta.
- `npx tsc --noEmit` e `npm run validate:content`.
- Servidor de teste: `VERCEL=0 node --env-file=.env.test.local node_modules/next/dist/bin/next start --hostname localhost --port 4318`.
- `npm run test:integration`: acesso, matrícula, isolamento, snapshots, proteção de arquivos e preservação de histórico. Cria e remove apenas identidades temporárias.
- `npm run test:code-access`: entrada real por código no servidor local, identidades distintas, retomada, logout, cookies adulterados/expirados, propósito dos cookies, rejeição do Google antigo, CSRF e limite de tentativas. Remove seus registros de teste.

As sessões artificiais usadas para testes locais não substituem verificar a entrada real pelo navegador em produção. Não registrar respostas no histórico da responsável durante QA.

## Atualização do acervo

A atualização diária usa `node scripts/import-content.mjs`, que aplica somente os pacotes revisados em `content/reviewed/*.json`. Cada pacote contém data de revisão, caminhos e hashes SHA-256 das fontes, escopo da seleção e itens com IDs estáveis no namespace `reviewed-`. A aplicação é aditiva e idempotente; ausência de uma fonte não remove atividades. O catálogo e as semanas disponíveis na interface são atualizados a partir dos itens efetivamente incorporados. `created` mantém a data histórica do catálogo; `updated` registra a última alteração editorial.

A reconstrução antiga das pranchas e notas das semanas 1–7 só roda com `node scripts/import-content.mjs --rebuild-legacy`; não faz parte da rotina diária e exige revisar o diff completo. Os pacotes editoriais são reaplicados ao final. Rode `scripts/prepare-books.mjs` somente quando as pranchas incorporadas forem intencionalmente atualizadas, preservando suas chaves de snapshot. Para acrescentar novas semanas, use pacotes revisados, sem ampliar a importação automática de arquivos brutos.

### Revisão das alternativas — 27/09/2026

Todas as questões objetivas foram revisadas para que a alternativa correta não se destaque pelo tamanho. Nas questões importadas, os pacotes revisados podem trazer `revisions`: cada revisão mantém enunciado, número de alternativas e gabarito, e registra em `from` a impressão digital das alternativas originais. Ela só é aplicada enquanto o original importado corresponder a essa impressão; caso contrário, é pulada com aviso. O item revisado guarda `revisedFrom`, o que permite refinar a revisão depois. Itens do namespace `reviewed-` são corrigidos no próprio pacote, com nova `version`.

As pranchas incorporadas em `protected-assets/cadernos` recebem as mesmas alternativas com `node scripts/apply-revisions-to-cadernos.mjs`. O script só altera uma questão quando o original da prancha tem a mesma impressão digital da revisão, e confere que nenhuma outra questão mudou. Rode-o de novo depois de `--rebuild-legacy`, que restaura as pranchas a partir do vault.

`node tests/answer-cues.mjs` falha se alguma objetiva tiver uma alternativa visivelmente mais longa ou mais curta que as demais, isto é, mais de 10% e mais de 8 caracteres de diferença. Também falha se, numa disciplina, a correta for a mais longa em mais de 30% das questões. Novos pacotes precisam passar nesse teste.

### Slides das aulas nos cartões — 28/09/2026

Os cartões de recordação mostram, depois da resposta, o slide da aula que ensinou aquele ponto. Os pacotes revisados trazem `figures`: cada entrada troca apenas o `solutionVisual` de um cartão importado e registra em `from` a impressão digital da imagem anterior. Ela só é aplicada enquanto o cartão ainda mostrar essa imagem; caso contrário, é pulada com aviso. O cartão guarda `figureFrom`. Cartões do namespace `reviewed-` recebem o slide no próprio pacote, com nova `version`. Os slides ficam em `protected-assets/media/slide-*.webp`, com no máximo 1280 px de largura, e só são servidos à turma. A legenda indica a semana da aula e a página do PDF. Cartões cujo tema só aparece em slides de texto corrido mantêm a figura anterior.

Antes de publicar: `npm run validate:content`, `node tests/reviewed-content.mjs`, `node tests/answer-cues.mjs`, `node --experimental-strip-types tests/study.mjs`, verificação de tipos e build. O teste compara o catálogo com o HEAD, impede alteração dos itens anteriores nesta atualização e verifica repetição da importação, colisões de IDs e ausência de fontes. O inventário e o relatório privado ficam fora do projeto, em `_/Portal Prancha/Atualização diária/`. Inventariado ou citado não significa publicado.

Em 21/09, foram acrescentados 22 itens da semana 8: cinco leituras, 12 questões e cinco cartões em Pesquisa, Genética, Molécula, Microbiota e Prática Médica. A seleção não representa cobertura integral das aulas. Histologia/Neuroembriologia aguardam revisão das imagens; documentos pessoais e de visitas não foram incorporados. A inversão de rótulos na página 17 da aula de Genética foi registrada e esclarecida na leitura correspondente.

## Publicação

GitHub `main` publica no projeto Vercel `portal-prancha`. Confirme READY, alias principal e acesso real após publicar. Alterações devem preservar dados e identificadores dos alunos. AGENTS.md/CLAUDE.md locais gerados por Next não fazem parte destas alterações.

## Métricas de acesso — 23/09/2026

Painel privado: https://vercel.com/marjoripomarole/portal-prancha/analytics

Vercel Web Analytics está habilitado no plano Hobby, sem upgrade: 50.000 eventos/mês e histórico consultável de 30 dias no momento da configuração. A coleta começa após o deploy em novos carregamentos; não existe histórico retroativo. Bloqueadores e limites do plano podem reduzir a contagem. Visitantes estimados não correspondem necessariamente a alunos únicos.

`app/access-analytics.tsx` monta o SDK oficial separadamente do fluxo de estudos, apenas em produção. `lib/analytics-policy.mjs` permite somente pageviews da origem principal e das páginas `/`, `/entrar`, `/privacidade`; remove query e fragmento e rejeita eventos personalizados. Não envia códigos, identificadores de dispositivo ou respostas. Não acessa Neon, não escreve no histórico e não altera cookies de autenticação. Nenhum recarregamento é imposto a abas existentes.

Este painel mede acessos e visualizações de páginas, dispositivo, navegador, país aproximado e origem. As abas internas Hoje/Matérias/Praticar não mudam de URL e não são contadas como páginas distintas. Não mede tempo de estudo, acertos, conclusões ou usuários simultâneos precisos. Não foram habilitados eventos personalizados (exigem outro plano).

Validação do filtro de privacidade: `node --test tests/analytics-policy.mjs`. A instrumentação é não bloqueante: falha na coleta não deve impedir a utilização do Portal.
