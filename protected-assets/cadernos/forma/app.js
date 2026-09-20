
/* ============================================================
   Índices
   ============================================================ */
const EXAM_DATE = new Date(2026, 8, 9); // 9 set 2026, quarta
const PROFS = ['Ari','Hojaij','Ricardo'];
const PROF_LABEL = {Ari:'Ari · radiologia', Hojaij:'Hojaij · anatomia', Ricardo:'Ricardo · histologia e embriologia', misto:'integrador'};
const AREA_PROF = {radiologia:'Ari', anatomia:'Hojaij', histologia:'Ricardo', embriologia:'Ricardo'};
const UNITS = DATA.units;
const TOPICS = [], TOPIC = {}, MCQ = [], DISC = [], CARDS = [], IMG = [], UNIT = {};
for (const u of UNITS) {
  UNIT[u.id] = u;
  const uprof = PROFS.includes(u.professor) ? u.professor : (AREA_PROF[u.area] || 'misto');
  u.prof = uprof;
  for (const t of (u.topics||[])) { t.unitId=u.id; t.week=u.week; t.area=u.area; t.prof=uprof; t.unitTitle=u.title; TOPICS.push(t); TOPIC[t.id]=t; }
  for (const q of (u.mcq||[])) { q.unitId=u.id; q.week=u.week; q.area=u.area; q.prof = PROFS.includes(q.style)? q.style : uprof; if(!PROFS.includes(q.prof)) q.prof = AREA_PROF[u.area]||'Hojaij'; MCQ.push(q); }
  for (const d of (u.discursive||[])) { d.unitId=u.id; d.week=u.week; d.area=u.area; d.prof = PROFS.includes(d.style)? d.style : (PROFS.includes(uprof)?uprof:(AREA_PROF[u.area]||'Hojaij')); DISC.push(d); }
  for (const c of (u.flashcards||[])) { c.unitId=u.id; c.week=u.week; c.area=u.area; c.prof = PROFS.includes(uprof)?uprof:(AREA_PROF[u.area]||'Hojaij'); const t=TOPIC[c.topicId]; c.topicName = t?t.name:u.title; CARDS.push(c); }
  for (const im of (u.imageId||[])) { im.unitId=u.id; im.week=u.week; im.area=u.area; im.prof=uprof; IMG.push(im); }
}
const uniqPush = (arr, it, key) => { if(!arr.some(x => key(x)===key(it))) arr.push(it); };
const IMAGES = (DATA.images||[]).map((im,i)=>Object.assign({idx:i, pins:[], tags:[], structures:[]}, im));
const IMG_BY = {}; IMAGES.forEach(im=>IMG_BY[im.id]=im);
const STATION_NAMES = {1:'Cavidade oral e faringe',2:'Esôfago e diafragma',3:'Arranjo geral e peritônio',4:'Estômago, duodeno e pâncreas',5:'Fígado, vias biliares e apêndice',6:'Bacia e parede abdominal'};
const AREA_NAMES = {anatomia:'Anatomia', histologia:'Histologia', embriologia:'Embriologia', radiologia:'Imagem', clinica:'Clínica'};

/* ============================================================
   Estado persistido
   ============================================================ */
const KEY = 'prancha-0909-v1';
function emptyState(){ return {srs:{},quiz:{},disc:{},plan:{},prat:{},sessions:[],flags:{},drafts:{},reveal:{},ident:{},active:{},settings:{},learning:{}}; }
function normalizeState(o){
 const out=emptyState(); if(!o || typeof o!=='object' || Array.isArray(o)) throw Error('Backup inválido');
 for(const k of Object.keys(out)){ if(k==='sessions'){out[k]=Array.isArray(o[k])?o[k]:[];} else out[k]=o[k]&&typeof o[k]==='object'&&!Array.isArray(o[k])?o[k]:{}; }
 for(const k of Object.keys(out.prat)) if(!Array.isArray(out.prat[k])) delete out.prat[k];
 return out;
}
let S=emptyState();
try { const raw=localStorage.getItem(KEY); if(raw) S=normalizeState(JSON.parse(raw)); } catch(e) {}
let STORAGE_ERROR=false;
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));STORAGE_ERROR=false;}catch(e){if(!STORAGE_ERROR){STORAGE_ERROR=true;toast('Não foi possível salvar. Exporte seu progresso antes de fechar.');}}}

function toast(msg){ const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.remove('show'),1800); }
const h = s => String(s==null?'':s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pct = (a,b) => b? Math.round(100*a/b) : 0;
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
const now = () => Date.now();
const DAY = 86400000;

/* ============================================================
   Plano de 6 dias
   ============================================================ */
const PLAN = [
  { date:'2026-09-03', d:6, w:'quinta', title:'Diagnóstico: descobrir o que você ainda não sabe', min:60,
    tasks:[
      {id:'d6a', t:'Simulado-diagnóstico de 13 testes, misturando as áreas, sem estudar antes. O objetivo é mapear, não acertar.', act:{v:'simulado', preset:'prova'}},
      {id:'d6b', t:'Ler a lista de erros do simulado e marcar os tópicos fracos no Progresso.', act:{v:'progresso'}},
      {id:'d6c', t:'Primeira passada de flashcards das ênfases dos professores (20 cartões novos).', act:{v:'cartoes', novos:20}},
      {id:'d6d', t:'Ler o método de estudo abaixo e decidir o horário fixo dos próximos 5 blocos.'},
    ]},
  { date:'2026-09-04', d:5, w:'sexta', title:'Tubo digestório alto + fígado, vias biliares e pâncreas (anatomia)', min:100,
    tasks:[
      {id:'d5a', t:'Guias das semanas 3 e 5 (anatomia): boca → faringe → esôfago → estômago → duodeno → pâncreas → fígado → vias biliares. Leitura ativa: cobrir e recitar.', act:{v:'guias', area:'anatomia', weeks:[3,5]}},
      {id:'d5b', t:'Desenhar de memória, no papel: (1) a árvore biliar com as duas papilas; (2) a tríade portal no ligamento hepatoduodenal; (3) os 3 hiatos do diafragma com os níveis T8/T10/T12.'},
      {id:'d5c', t:'15 questões estilo Hojaij das semanas 3 e 5, modo treino.', act:{v:'simulado', prof:'Hojaij', weeks:[3,5], n:15}},
      {id:'d5d', t:'Flashcards vencidos + 25 novos de anatomia.', act:{v:'cartoes', area:'anatomia', novos:25}},
      {id:'d5e', t:'2 discursivas do Hojaij escritas à mão, cronometradas (5 min cada).', act:{v:'discursivas', prof:'Hojaij'}},
    ]},
  { date:'2026-09-05', d:4, w:'sábado', title:'Histologia e embriologia: reconhecimento e raciocínio', min:110,
    tasks:[
      {id:'d4a', t:'Guias de histologia e embriologia: sistema genital, tubo digestório (boca ao reto), fígado, pâncreas e suprarrenal, mielomeningocele.', act:{v:'guias', area:'histologia'}},
      {id:'d4b', t:'Tabela de 1 página feita à mão: para cada órgão, epitélio + característica que só ele tem (ex.: células de Paneth, células parietais, placas de Peyer, tênias, glândulas de Brunner).'},
      {id:'d4c', t:'15 questões estilo Ricardo, modo treino.', act:{v:'simulado', prof:'Ricardo', n:15}},
      {id:'d4d', t:'3 discursivas do Ricardo por escrito (derivação embriológica é tema clássico).', act:{v:'discursivas', prof:'Ricardo'}},
      {id:'d4e', t:'Flashcards vencidos + 25 novos de histologia e embriologia.', act:{v:'cartoes', area:'histologia', novos:25}},
    ]},
  { date:'2026-09-06', d:3, w:'domingo', title:'Radiologia (Ari): orientação axial, Couinaud, intra/retroperitoneal, vias biliares por imagem', min:90,
    tasks:[
      {id:'d3a', t:'Guias de radiologia: pelve feminina, intestinos e peritônio, fígado/vias biliares/pâncreas/adrenais. Preste atenção em "qual método para qual pergunta".', act:{v:'guias', area:'radiologia'}},
      {id:'d3b', t:'Lista de reconhecimento em imagem: para cada estrutura, dizer o plano, a pista visual e a função.', act:{v:'pratica', tab:'imagens'}},
      {id:'d3c', t:'15 questões estilo Ari (enunciados menos diretos: leia TODAS as alternativas).', act:{v:'simulado', prof:'Ari', n:15}},
      {id:'d3d', t:'2 discursivas do Ari.', act:{v:'discursivas', prof:'Ari'}},
      {id:'d3e', t:'Flashcards vencidos + 20 novos de radiologia.', act:{v:'cartoes', area:'radiologia', novos:20}},
    ]},
  { date:'2026-09-07', d:2, w:'segunda', title:'Pelve, períneo, sistemas genitais, parede abdominal e peritônio + prova prática', min:100,
    tasks:[
      {id:'d2a', t:'Guias de anatomia das semanas 1, 2 e 4.', act:{v:'guias', area:'anatomia', weeks:[1,2,4]}},
      {id:'d2b', t:'Prova prática: rodada 1 (reconhecer) e rodada 2 (diferenciar) nas 6 estações, pontuando 0–3.', act:{v:'pratica'}},
      {id:'d2c', t:'15 questões misturando os três professores só das semanas 1, 2 e 4 (intercalar ajuda a discriminar).', act:{v:'simulado', weeks:[1,2,4], n:15}},
      {id:'d2d', t:'Flashcards vencidos (só o que estiver vencido).', act:{v:'cartoes', so:'vencidos'}},
      {id:'d2e', t:'Revisar a lista de Pegadinhas inteira, em voz alta.', act:{v:'pegadinhas'}},
    ]},
  { date:'2026-09-08', d:1, w:'terça', title:'Simulado completo + correção cirúrgica. Nada novo. Dormir cedo.', min:90,
    tasks:[
      {id:'d1a', t:'Simulado final de 13 testes (30 min sugeridos para treino), modo prova.', act:{v:'simulado', preset:'prova'}},
      {id:'d1b', t:'7 discursivas misturando as áreas, escritas à mão em 40 min de treino, depois comparar com a resposta-modelo.', act:{v:'discursivas', preset:'prova'}},
      {id:'d1c', t:'Refazer APENAS as questões erradas do simulado e reler o guia dos 3 tópicos mais fracos.', act:{v:'simulado', preset:'erros'}},
      {id:'d1d', t:'Prova prática: rodada cronometrada (60–90 s por estação).', act:{v:'pratica'}},
      {id:'d1e', t:'Flashcards vencidos. Separar jaleco. Dormir 7–8 h: a consolidação acontece no sono.', act:{v:'cartoes', so:'vencidos'}},
    ]},
  { date:'2026-09-09', d:0, w:'quarta', title:'Dia da prova: 20 minutos de aquecimento e só', min:20,
    tasks:[
      {id:'d0a', t:'Passar pelas Pegadinhas e pelos mnemônicos (10 min).', act:{v:'pegadinhas'}},
      {id:'d0b', t:'10 flashcards fáceis para aquecer a memória, sem estudar nada novo.', act:{v:'cartoes', so:'vencidos'}},
      {id:'d0c', t:'Na prova: ler as 4 alternativas antes de escolher; nas discursivas, responder com nome → localização → relação → função/clínica.'},
    ]},
];

/* ============================================================
   Método de estudo
   ============================================================ */
const METHOD = [
  { t:'Testar antes de reler', p:'Cada bloco começa com questões ou flashcards, e só depois você abre o guia para corrigir. Recuperar da memória fortalece a memória; reler só dá sensação de familiaridade.', why:'Prática de recuperação é a técnica com maior evidência (Roediger & Karpicke, 2006; Dunlosky et al., 2013).' },
  { t:'Espaçar em 3 encontros', p:'Busque reencontrar os conceitos em dias diferentes. Revise os cartões vencidos e priorize o conjunto essencial. Os intervalos são reduzidos até a véspera da prova; três encontros não são garantidos para cartões novos introduzidos tarde.', why:'Intervalos crescentes retêm mais por hora estudada do que repetição em massa (Cepeda et al., 2006).' },
  { t:'Intercalar os três professores', p:'Depois de dominar um bloco, misture anatomia, histologia e imagem do mesmo órgão na mesma sessão. A prova mistura; treinar misturado ensina a discriminar.', why:'Intercalar melhora a discriminação entre conceitos parecidos, que é exatamente onde nascem as pegadinhas.' },
  { t:'Responder em 4 passos', p:'Para qualquer estrutura: nome → onde está → uma relação que a diferencia da vizinha → função ou aplicação clínica. É o formato que o Hojaij pediu na prática e o que uma discursiva de 3 linhas precisa.', why:'Um esquema fixo reduz o custo de decidir o que escrever e evita respostas incompletas.' },
  { t:'Desenhar de memória', p:'Árvore biliar, tríade portal, hiatos do diafragma, 4 partes do duodeno, estações da bacia. Desenhe sem olhar, compare, corrija em outra cor.', why:'Codificação dupla (verbal + visual) cria duas rotas de acesso à mesma informação.' },
  { t:'Perguntar "por quê" nas relações', p:'Por que a próstata é palpável pelo reto? Por que o colédoco passa atrás do duodeno? Por que a veia suprarrenal esquerda drena na renal? Explicar a razão amarra o fato ao mapa.', why:'Interrogação elaborativa transforma dado solto em rede, que resiste mais ao esquecimento.' },
  { t:'Blocos curtos, poucos e fixos', p:'Escolha blocos de 15, 30 ou 60 minutos de acordo com o tempo disponível. Faça pausas e distribua a revisão pelos dias restantes; preserve o sono.', why:'Sono consolida memória declarativa; a noite anterior à prova vale mais dormida do que estudada.' },
  { t:'Cortar o que não rende', p:'Sem grifar, sem reler slides, sem reassistir aula inteira. Áudio só para tirar uma dúvida específica com o minuto marcado.', why:'Grifar e reler têm utilidade baixa na revisão de Dunlosky et al. (2013).' },
];

/* ============================================================
   Roteamento
   ============================================================ */
const VIEWS = [
  {id:'hoje', l:'Hoje'},
  {id:'aprender',l:'Aprender'},
  {id:'plano', l:'Plano e método'},
  {id:'simulado', l:'Simulado'},
  {id:'cartoes', l:'Flashcards'},
  {id:'discursivas', l:'Discursivas'},
  {id:'guias', l:'Guias'},
  {id:'pratica', l:'Prova prática'},
  {id:'atlas', l:'Atlas'},
  {id:'identificar', l:'Identificar'},
  {id:'pegadinhas', l:'Pegadinhas'},
  {id:'progresso', l:'Progresso'},
  {id:'sobre', l:'Sobre'},
];
let VIEW = 'hoje', PARAMS = {};
function go(v, params){ if(!VIEWS.some(x=>x.id===v)) v='hoje'; VIEW=v; PARAMS=params||{}; render(); window.scrollTo({top:0}); }
function renderRail(){
 const primary=['hoje','aprender','identificar','simulado','progresso'];const list=[...primary.map(id=>VIEWS.find(v=>v.id===id)),...VIEWS.filter(v=>!primary.includes(v.id))];
 document.getElementById('rail').innerHTML='<a class="quick-review-link" href="histo-embrio.html">Histo + Embrio ↗</a>'+list.map(v=>`<button data-view="${v.id}" aria-current="${v.id===VIEW?'page':'false'}" class="${v.id===VIEW?'on':''} ${primary.includes(v.id)?'':'nav-extra'}">${h(v.l)}${v.id==='cartoes'&&dueCards().length?`<span class="badge">${dueCards().length}</span>`:''}</button>`).join('')+'<button class="nav-more" id="navmore" aria-expanded="false">Mais +</button>';
 document.getElementById('navmore').onclick=()=>{const rail=document.getElementById('rail');const expanded=rail.classList.toggle('expanded');document.getElementById('navmore').setAttribute('aria-expanded',String(expanded));};
}
document.getElementById('rail').addEventListener('click', e => { const b=e.target.closest('button[data-view]'); if(b) go(b.dataset.view); });
function renderCountdown(){
  const el=document.getElementById('countdown');
  const days = Math.ceil((EXAM_DATE - new Date().setHours(0,0,0,0)) / DAY);
  if (days > 1) el.innerHTML = `<span class="n">${days}</span><span class="lbl">dias até a prova<br>quarta, 9 de setembro · 14h20</span>`;
  else if (days === 1) el.innerHTML = `<span class="n">1</span><span class="lbl">dia · início às 14h20</span>`;
  else if (days === 0) el.innerHTML = `<span class="n">Hoje</span><span class="lbl">Prova de FF II · início às 14h20</span>`;
  else el.innerHTML = `<span class="lbl">Prova realizada em 09/09</span>`;
}
function render(){ clearInterval(TIMER); renderRail(); renderCountdown(); const m=document.getElementById('main'); m.innerHTML=''; ({hoje, aprender, plano, simulado, cartoes, discursivas, guias, pratica, atlas, identificar, pegadinhas, progresso, sobre})[VIEW](m); persistActive(); }

/* ============================================================
   Domínio: cálculo de domínio por tópico
   ============================================================ */
function topicMastery(t){
  const qs = MCQ.filter(q=>q.topicId===t.id && S.quiz[q.id]);
  const cs = CARDS.filter(c=>c.topicId===t.id && S.srs[c.id]);
  const ds = DISC.filter(d=>d.topicId===t.id && S.disc[d.id]!=null);
  const parts=[];
  if (qs.length) parts.push(qs.filter(q=>S.quiz[q.id].last).length/qs.length);
  if (cs.length) parts.push(cs.filter(c=>S.srs[c.id].last>=2).length/cs.length);
  if (ds.length) parts.push(ds.reduce((a,d)=>a+S.disc[d.id],0)/(3*ds.length));
  if (!parts.length) return null;
  return parts.reduce((a,b)=>a+b,0)/parts.length;
}
function profReadiness(p){
  const ts = TOPICS.filter(t=>t.prof===p).map(topicMastery).filter(x=>x!=null);
  const qs = MCQ.filter(q=>q.prof===p && S.quiz[q.id]);
  const acc = qs.length? qs.filter(q=>S.quiz[q.id].last).length/qs.length : null;
  const m = ts.length? ts.reduce((a,b)=>a+b,0)/ts.length : null;
  return {mastery:m, acc, seen:qs.length, total:MCQ.filter(q=>q.prof===p).length};
}
function dueCards(){ const n=now(); return CARDS.filter(c => S.srs[c.id] && S.srs[c.id].due <= n); }
function newCards(){ return CARDS.filter(c => !S.srs[c.id]); }
function todayPlan(){
  const today = new Date(); today.setHours(0,0,0,0);
  const key = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  let day = PLAN.find(p=>p.date===key);
  if (!day) day = key < PLAN[0].date ? PLAN[0] : PLAN[PLAN.length-1];
  return day;
}
function meterClass(v){ return v==null?'':(v>=0.8?'ok':v>=0.55?'warn':'bad'); }

/* ============================================================
   HOJE
   ============================================================ */
function hojeLegacy(m){
  const day = todayPlan();
  const due = dueCards().length, fresh = newCards().length;
  const done = day.tasks.filter(t=>S.plan[t.id]).length;
  const sessions = S.sessions.slice(-1)[0];
  const weak = TOPICS.map(t=>({t, v:topicMastery(t)})).filter(x=>x.v!=null).sort((a,b)=>a.v-b.v).slice(0,3);
  const totalQ = MCQ.length, seenQ = Object.keys(S.quiz).length;
  m.innerHTML = `
  <div class="head">
    <span class="eyebrow">Sessão de hoje · D-${day.d} · ${h(day.w)}</span>
    <h1>${h(day.title)}</h1>
    <p class="lead">Bloco previsto de <b>${day.min} min</b>. Comece pelo que exige memória (questões, cartões) e termine lendo o guia só do que errou.</p>
  </div>
  <div class="hero">
    <div class="card today">
      <div class="row" style="justify-content:space-between;margin-bottom:8px"><span class="eyebrow">Tarefas do dia</span><span class="mono small">${done}/${day.tasks.length}</span></div>
      ${day.tasks.map(t=>taskRow(t)).join('')}
      <div class="row" style="margin-top:14px"><button class="btn ghost sm" data-go="plano">Ver o plano completo dos 6 dias</button></div>
    </div>
    <div class="stack">
      <div class="panel">
        <span class="eyebrow">Onde você está</span>
        <div class="grid3" style="margin-top:10px">
          <div class="stat"><span class="v mono">${due}</span><span class="l">cartões vencidos</span></div>
          <div class="stat"><span class="v mono">${fresh}</span><span class="l">cartões nunca vistos</span></div>
          <div class="stat"><span class="v mono">${seenQ}<span class="muted" style="font-size:1rem">/${totalQ}</span></span><span class="l">questões já feitas</span></div>
        </div>
        ${sessions?`<p class="small muted" style="margin-top:12px">Último simulado: <b class="mono">${sessions.score}/${sessions.n}</b> (${h(sessions.label)}) em ${new Date(sessions.at).toLocaleDateString('pt-BR')}.</p>`:''}
      </div>
      <div class="panel">
        <span class="eyebrow">Desempenho nos itens praticados</span>
        <div class="stack" style="gap:8px;margin-top:10px">
          ${PROFS.map(p=>{const r=profReadiness(p); const v=r.mastery; return `<div><div class="row" style="justify-content:space-between;font-size:.85rem"><span><i class="dot ${p}"></i> ${h(PROF_LABEL[p])}</span><span class="mono">${v==null?'—':Math.round(v*100)+'%'}</span></div><div class="meter ${meterClass(v)}"><i style="width:${v==null?0:Math.round(v*100)}%"></i></div></div>`;}).join('')}
        </div>
      </div>
      ${weak.length?`<div class="panel"><span class="eyebrow">Mais fracos agora</span><ul class="tight" style="margin-top:8px">${weak.map(w=>`<li><button class="btn ghost sm" data-go="guias" data-topic="${w.t.id}">${h(w.t.name)}</button> <span class="mono small muted">${Math.round(w.v*100)}%</span></li>`).join('')}</ul></div>`:''}
    </div>
  </div>
  <h2 style="margin:30px 0 12px">Começar agora</h2>
  <div class="quick">
    <button data-go="simulado" data-preset="prova"><b>Simulado da prova</b><span>13 testes · distribuição didática entre áreas</span></button>
    <button data-go="cartoes" data-so="vencidos"><b>Revisar vencidos</b><span>${due} cartões esperando</span></button>
    <button data-go="simulado" data-preset="erros"><b>Refazer erros</b><span>só as questões que você errou</span></button>
    <button data-go="pratica"><b>Prova prática</b><span>6 estações, pontuação 0–3</span></button>
    <button data-go="identificar" data-mode="misto"><b>Identificar</b><span>onde está? · o que é isto? · com imagens</span></button>
    <button data-go="discursivas" data-preset="prova"><b>Discursivas da prova</b><span>7 discursivas · distribuição didática</span></button>
    <button data-go="pegadinhas"><b>Pegadinhas</b><span>as confusões que derrubam nota</span></button>
  </div>`;
}
function taskRow(t){
  const done = !!S.plan[t.id];
  return `<label class="checkrow ${done?'done':''}"><input type="checkbox" data-task="${t.id}" ${done?'checked':''}><div class="t"><span>${h(t.t)}</span>${t.act?`<div class="act"><button class="btn sm" data-act='${h(JSON.stringify(t.act))}'>Abrir</button></div>`:''}</div></label>`;
}

/* ============================================================
   PLANO E MÉTODO
   ============================================================ */
function plano(m){
  const today = todayPlan();
  const date=localDay(now()).split('-').map((n,i)=>i?String(n).padStart(2,'0'):n).join('-'),upcoming=PLAN.filter(p=>p.date>=date),past=PLAN.filter(p=>p.date<date);
  m.innerHTML = `
  <div class="head"><span class="eyebrow">Até quarta · 09/09</span><h1>Sua revisão até a prova</h1>
  <p class="lead">Comece pelo dia atual e ajuste a carga com os blocos de 15, 30 ou 60 minutos em Hoje. Alterne anatomia, histologia/embriologia e imagem. As durações abaixo são sugestões, não metas obrigatórias.</p></div>
  <div class="panel" style="margin-bottom:20px"><b>Começando agora?</b><p>Use o simulado para localizar lacunas. Nos dias anteriores, retome os temas que ainda não praticou, especialmente tubo digestório, fígado/pâncreas e histologia/embriologia. Não tente compensar tudo com uma única leitura longa.</p><button class="btn sm" data-go="hoje">Escolher meu próximo bloco</button></div>
  ${upcoming.map(p=>`<div class="day ${p.date===today.date?'today-day':''}">
    <div class="when"><span class="w">${h(p.w)} · D-${p.d}</span><span class="d">${p.date.slice(8,10)}/${p.date.slice(5,7)}</span><span class="m">${p.min} min</span></div>
    <div><h3>${h(p.title)}</h3>${p.tasks.map(taskRow).join('')}</div>
  </div>`).join('')}
  ${past.length?`<details class="panel" style="margin-top:18px"><summary>Consultar os dias anteriores · ${past.reduce((n,p)=>n+p.tasks.filter(t=>!S.plan[t.id]).length,0)} tarefas sem marcação</summary>${past.map(p=>`<div class="day"><div class="when"><span class="w">${h(p.w)}</span><span class="d">${p.date.slice(8,10)}/${p.date.slice(5,7)}</span></div><div><h3>${h(p.title)}</h3>${p.tasks.map(taskRow).join('')}</div></div>`).join('')}</details>`:''}
  <h2 style="margin:40px 0 6px">Como estudar menos horas e reter mais</h2>
  <p class="lead muted" style="max-width:62ch;margin-bottom:16px">Oito regras que o plano acima já aplica. Se o tempo apertar, mantenha as três primeiras.</p>
  <div class="method">${METHOD.map(x=>`<div class="card"><h3>${h(x.t)}</h3><p>${h(x.p)}</p><p class="why">${h(x.why)}</p></div>`).join('')}</div>
  <div class="panel" style="margin-top:20px"><span class="eyebrow">Formato atualizado em 08/09</span><h3>09/09 às 14h20 · 20 questões no total</h3><p><b>13 testes + 7 discursivas.</b> Esta atualização substitui a previsão anterior de 30 questões.</p><p class="small muted" style="margin-top:8px">Informação atualizada pela estudante. Distribuição por professor, pesos e duração total não informados. O site mistura as áreas como estratégia de treino, sem prever a divisão real.</p></div>`;
}

/* ============================================================
   SIMULADO
   ============================================================ */
let Q = null; // sessão de questões
function balancedExamSelection(pool,n){
 const order=shuffle(PROFS),groups=order.map(p=>pool.filter(q=>q.prof===p)),out=[];
 while(out.length<n&&groups.some(g=>g.length)){for(const g of groups){if(g.length&&out.length<n)out.push(g.shift());}}
 return out;
}
function pickDiscursiveExam(){return balancedExamSelection(shuffle(DISC).sort((a,b)=>(S.disc[a.id]==null?0:1)-(S.disc[b.id]==null?0:1)),7);}
const DIFF_RANK = {'difícil':0, 'visual':1, 'média':2, 'fácil':3};
function pickQuestions(cfg){
  let pool = MCQ.slice();
  if (cfg.prof) pool = pool.filter(q=>q.prof===cfg.prof);
  if (cfg.weeks && cfg.weeks.length) pool = pool.filter(q=>cfg.weeks.includes(q.week));
  if (cfg.area) pool = pool.filter(q=>q.area===cfg.area);
  if (cfg.topic) pool = pool.filter(q=>q.topicId===cfg.topic);
  if (cfg.preset==='erros') pool = pool.filter(q=>needsReview(S.quiz[q.id]));
  if (cfg.preset==='marcadas') pool = pool.filter(q=>S.flags[q.id]);
  if (cfg.hard) pool = pool.filter(q=>q.difficulty!=='fácil');
  // prioridade: nunca vistas > erradas > acertadas há mais tempo; no modo difícil, as difíceis entram primeiro
  const rank = q => { const s=S.quiz[q.id]; const base = !s ? 0 : (!s.last ? 1 : 2 - Math.min(1,(now()-s.at)/DAY/100)); return cfg.hard ? (DIFF_RANK[q.difficulty] ?? 2) + base/10 : base; };
  const sorted = shuffle(pool).sort((a,b)=>rank(a)-rank(b));
  if (cfg.preset==='prova'){
    const visual=balancedExamSelection(sorted.filter(q=>q.image),6);
    return shuffle([...visual,...balancedExamSelection(sorted.filter(q=>!visual.includes(q)),13-visual.length)]);
  }
  return sorted.slice(0, cfg.n||15);
}
function simulado(m){
  if (Q) return renderQuiz(m);
  const p = PARAMS;
  if (p.preset || p.prof || p.weeks || p.topic || p.area){ PARAMS={}; if(startQuiz(Object.assign({n:15,mode:p.preset==='prova'?'prova':'treino'},p))) return; m.innerHTML='<div class="head"><h1>Nenhuma questão para revisar</h1><p class="lead">Não há questões pendentes com esse filtro. Você pode começar um novo treino.</p></div><button class="btn primary" data-go="simulado">Escolher treino</button>'; return; }
  const seen = Object.keys(S.quiz).length, wrong = MCQ.filter(q=>needsReview(S.quiz[q.id])).length, flagged = MCQ.filter(q=>S.flags[q.id]).length;
  m.innerHTML = `
  <div class="head"><span class="eyebrow">Banco de ${MCQ.length} questões no estilo dos professores</span><h1>Simulado</h1>
  <p class="lead">Modo <b>treino</b> mostra a explicação a cada resposta. Modo <b>prova</b> só corrige no fim. Questões nunca vistas e erradas entram primeiro.</p></div>
  <div class="grid2">
    <div class="card"><h3>Simulado da prova</h3><p class="small muted" style="margin:6px 0 12px">13 testes, com correção ao final. A prova tem ainda 7 discursivas na seção própria. Os 30 min e a distribuição por área são escolhas de treino; a duração real e a divisão por professor não foram informadas.</p><div class="row"><button class="btn primary" data-start='{"preset":"prova","mode":"prova"}'>Começar</button><button class="btn" data-start='{"preset":"prova","mode":"prova","hard":true}'>Versão difícil</button></div><p class="small muted" style="margin-top:8px">Em todos os simulados as alternativas são embaralhadas a cada sessão e o tópico só aparece depois da resposta. A versão difícil prioriza as questões marcadas como difíceis e exclui as fáceis.</p></div>
    <div class="card"><h3>Refazer erros</h3><p class="small muted" style="margin:6px 0 12px">${wrong} questões erradas${flagged?` · ${flagged} marcadas`:''}. Refazer até acertar em dois dias diferentes.</p><div class="row"><button class="btn" data-start='{"preset":"erros","mode":"treino","n":30}' ${wrong?'':'disabled'}>Erros</button><button class="btn" data-start='{"preset":"marcadas","mode":"treino","n":30}' ${flagged?'':'disabled'}>Marcadas</button></div></div>
  </div>
  <div class="panel" style="margin-top:16px"><span class="eyebrow">Treino dirigido</span>
    <div class="qcfg" style="margin-top:10px">
      <label class="f">Professor<select id="qprof"><option value="">Todos</option>${PROFS.map(p=>`<option value="${p}">${h(PROF_LABEL[p])}</option>`).join('')}</select></label>
      <label class="f">Semana<select id="qweek"><option value="">Todas</option>${[1,2,3,4,5].map(w=>`<option value="${w}">Semana ${w}</option>`).join('')}</select></label>
      <label class="f">Quantidade<select id="qn"><option>10</option><option selected>15</option><option>20</option><option>30</option></select></label>
      <label class="f">Modo<select id="qmode"><option value="treino">Treino (explica na hora)</option><option value="prova">Prova (corrige no fim)</option></select></label>
      <label class="f">Dificuldade<select id="qhard"><option value="">Normal</option><option value="1">Difícil (sem fáceis)</option></select></label>
      <button class="btn primary" id="qgo">Iniciar</button>
    </div></div>
  <p class="small muted" style="margin-top:14px">Já feitas: <b class="mono">${seen}</b> de ${MCQ.length}. Acertos totais: <b class="mono">${MCQ.filter(q=>S.quiz[q.id]&&S.quiz[q.id].last).length}</b>.</p>
  ${S.sessions.length?`<h3 style="margin:26px 0 8px">Histórico</h3><div class="tbl"><table><tr><th>Quando</th><th>Sessão</th><th>Resultado</th><th>Ari</th><th>Hojaij</th><th>Ricardo</th></tr>${S.sessions.slice().reverse().slice(0,12).map(s=>`<tr><td>${new Date(s.at).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}</td><td>${h(s.label)}</td><td class="mono">${s.score}/${s.n} (${pct(s.score,s.n)}%)</td>${PROFS.map(p=>`<td class="mono">${s.by&&s.by[p]?s.by[p].c+'/'+s.by[p].n:'—'}</td>`).join('')}</tr>`).join('')}</table></div>`:''}`;
  m.querySelector('#qgo').onclick = () => startQuiz({prof:m.querySelector('#qprof').value||null, weeks:m.querySelector('#qweek').value?[+m.querySelector('#qweek').value]:null, n:+m.querySelector('#qn').value, mode:m.querySelector('#qmode').value, hard:!!m.querySelector('#qhard').value}) || render();
}
// Alternativas embaralhadas por sessão: a questão exibida é um clone com "perm" (ordem original das alternativas) e "answer" remapeado.
function withPerm(q, perm){ if(!perm||perm.length!==q.options.length) return q; return Object.assign({}, q, { options: perm.map(i=>q.options[i]), answer: perm.indexOf(q.answer), perm }); }
function newPerm(q){ return shuffle(q.options.map((_,i)=>i)); }
function startQuiz(cfg){
  const list = pickQuestions(cfg).map(q=>withPerm(q, newPerm(q)));
  if (!list.length){ toast('Nenhuma questão com esse filtro'); Q=null; return false; }
  const base = cfg.preset==='prova'?'Simulado da prova': cfg.preset==='erros'?'Refazer erros': cfg.preset==='marcadas'?'Marcadas': cfg.topic? (TOPIC[cfg.topic]?TOPIC[cfg.topic].name:'Tópico') : [cfg.prof, cfg.weeks?('sem. '+cfg.weeks.join(',')):null, cfg.area].filter(Boolean).join(' · ') || 'Treino misto';
  const label = cfg.hard && cfg.preset!=='prova' ? base+' · difícil' : base;
  Q = { id:sessionId(), list, i:0, ans:{}, mode:cfg.mode||'treino', label, hard:!!cfg.hard, startedAt:now(), finished:false, limit: cfg.preset==='prova'?30*60:null };
  VIEW='simulado'; PARAMS={};
  render(); return true;
}
let TIMER=null;
function renderQuiz(m){
  clearInterval(TIMER);
  if(!Q) return simulado(m); if (Q.finished) return renderResult(m); if(Q.limit && now()-Q.startedAt>=Q.limit*1000){ finishQuiz(); return; }
  const q = Q.list[Q.i], a = Q.ans[q.id], answered = a!=null;
  const t = TOPIC[q.topicId];
  m.innerHTML = `
  <div class="qhead">
    <span class="chip ${q.prof}">${h(q.prof)}</span>
    <span class="chip neutral">Semana ${q.week}</span>
    <span class="chip neutral">${h(q.difficulty||'')}</span>
    <div class="prog"><div class="meter"><i style="width:${pct(Q.i, Q.list.length)}%"></i></div></div>
    <span class="mono small">${Q.i+1} / ${Q.list.length}</span>
    <span class="timer" id="timer"></span>
    <button class="btn ghost sm" id="qquit">Encerrar</button>
  </div>
  ${Q.label==='Simulado da prova'&&Q.list.length!==13?`<p class="panel small">Sessão anterior preservada com ${Q.list.length} testes. Novos simulados usam 13 testes; complete com as 7 discursivas na seção própria.</p>`:''}
  <span class="eyebrow">${h(Q.label)}${t && answered && Q.mode==='treino' ? ' · '+h(t.name) : ''}${Q.hard?' · modo difícil':''}</span>
  <span class="chip neutral">${q.image?'Questão com imagem':'Questão textual'}</span><p class="qstem">${h(q.stem)}</p>${questionImage(q,answered&&Q.mode==='treino')}
  <div class="opts">${q.options.map((o,i)=>{
    let cls='opt'; if(answered){ if(Q.mode==='treino'){ if(i===q.answer) cls+=' right'; else if(i===a) cls+=' wrong'; } else if(i===a) cls+=' sel'; }
    return `<button class="${cls}" data-opt="${i}" ${answered&&Q.mode==='treino'?'disabled':''}><span class="L">${'ABCD'[i]}</span><span>${h(o)}</span></button>`; }).join('')}</div>
  ${answered && Q.mode==='treino' ? `<div class="expl"><b class="t">${a===q.answer?'Correto':'Errado — a correta é '+'ABCD'[q.answer]}</b>${h(q.explanation)}</div>`:''}
  <div class="row" style="margin-top:18px;justify-content:space-between">
    <div class="row"><button class="btn sm ${S.flags[q.id]?'primary':''}" id="qflag">${S.flags[q.id]?'Marcada':'Marcar para revisar'}</button>${t?`<button class="btn ghost sm" data-go="guias" data-topic="${t.id}">Abrir guia</button>`:''}</div>
    <div class="row"><button class="btn" id="qprev" ${Q.i===0?'disabled':''}>Anterior</button><button class="btn primary" id="qnext" ${(!answered && Q.mode==='treino')?'disabled':''}>${Q.i===Q.list.length-1?'Finalizar':'Próxima'}</button></div>
  </div>
  <p class="small muted" style="margin-top:14px">Atalhos: <span class="kbd">1</span>–<span class="kbd">4</span> responder · <span class="kbd">Enter</span> próxima</p>`;
  m.querySelectorAll('[data-opt]').forEach(b=>b.onclick=()=>answer(+b.dataset.opt));
  m.querySelector('#qnext').onclick = next;
  m.querySelector('#qprev').onclick = ()=>{ Q.i--; render(); };
  m.querySelector('#qquit').onclick = ()=>{ if (Object.keys(Q.ans).length) finishQuiz(); else { Q=null; render(); } };
  m.querySelector('#qflag').onclick = ()=>{ S.flags[q.id]=!S.flags[q.id]; save(); render(); };
  const tm = m.querySelector('#timer');
  const tick=()=>{ if(VIEW!=='simulado'||!Q||Q.finished){clearInterval(TIMER);return;} if(Q.limit&&now()-Q.startedAt>=Q.limit*1000){finishQuiz();return;} const s=Math.floor((now()-Q.startedAt)/1000); if(Q.limit){ const r=Q.limit-s; tm.textContent=(r<0?'-':'')+String(Math.floor(Math.abs(r)/60)).padStart(2,'0')+':'+String(Math.abs(r)%60).padStart(2,'0'); tm.style.color = r<300?'var(--bad)':''; } else tm.textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0'); };
  tick(); TIMER=setInterval(tick,1000);
}
function answer(i){
  const q=Q.list[Q.i]; if (Q.mode==='treino' && Q.ans[q.id]!=null) return;
  Q.ans[q.id]=i;
  if (Q.mode==='treino') recordAnswer(q,i); persistActive();
  render();
}
function needsReview(r){return !!r && (!r.last || (r.hadError && (r.correctDays||[]).length<2));}
function recordAnswer(q,i){
 const r=S.quiz[q.id]||{n:0,c:0},correct=i===q.answer; r.n++; if(correct)r.c++;
 r.hadError=!!r.hadError||r.last===false||!correct;
 const date=localDay(now()); r.correctDays=correct?[...new Set([...(r.correctDays||[]),date])].slice(-2):[];
 r.last=correct;r.at=now();S.quiz[q.id]=r;save();
}

function next(){ if (Q.i < Q.list.length-1){ Q.i++; render(); } else finishQuiz(); }
function finishQuiz(){
  if(!Q||Q.finished)return;
  if (Q.mode==='prova') Q.list.forEach(q=>{ if(Q.ans[q.id]!=null) recordAnswer(q,Q.ans[q.id]); });
  const by={}; let score=0;
  Q.list.forEach(q=>{ by[q.prof]=by[q.prof]||{n:0,c:0}; by[q.prof].n++; if(Q.ans[q.id]===q.answer){ score++; by[q.prof].c++; } });
  S.sessions.push({at:now(), label:Q.label, n:Q.list.length, score, by}); save();
  Q.finished=true; Q.finishedAt=now(); Q.score=score; Q.by=by; render();
}
function renderResult(m){
  const wrong = Q.list.filter(q=>Q.ans[q.id]!==q.answer);
  const grade = (10*Q.score/Q.list.length).toFixed(1).replace('.',',');
  m.innerHTML = `
  <div class="head"><span class="eyebrow">${h(Q.label)} · concluído</span><h1>Resultado</h1></div>
  <div class="grid2">
    <div class="card result"><span class="eyebrow">Nota equivalente</span><div class="big">${grade}</div><p class="muted">${Q.score} de ${Q.list.length} corretas · ${Math.round(((Q.finishedAt||now())-Q.startedAt)/60000)} min</p></div>
    <div class="card"><span class="eyebrow">Por professor</span><div class="stack" style="gap:8px;margin-top:8px">${PROFS.filter(p=>Q.by[p]).map(p=>`<div><div class="row" style="justify-content:space-between;font-size:.88rem"><span><i class="dot ${p}"></i> ${h(p)}</span><span class="mono">${Q.by[p].c}/${Q.by[p].n}</span></div><div class="meter ${meterClass(Q.by[p].c/Q.by[p].n)}"><i style="width:${pct(Q.by[p].c,Q.by[p].n)}%"></i></div></div>`).join('')}</div></div>
  </div>
  <div class="row" style="margin:18px 0"><button class="btn primary" id="again">Novo simulado</button>${wrong.length?`<button class="btn" id="redo">Refazer só as ${wrong.length} erradas</button>`:''}<button class="btn ghost" data-go="progresso">Ver progresso</button></div>
  ${wrong.length?`<h2 style="margin:10px 0 12px">O que revisar</h2><div class="miss">${wrong.map(q=>{const t=TOPIC[q.topicId];return `<div class="it"><div class="row" style="justify-content:space-between"><span class="chip ${q.prof}">${h(q.prof)}</span>${t?`<button class="btn ghost sm" data-go="guias" data-topic="${t.id}">${h(t.name)}</button>`:''}</div><p style="margin:6px 0 4px">${h(q.stem)}</p>${questionImage(q,true)}<p class="small"><b style="color:var(--ok)">Correta: ${'ABCD'[q.answer]}.</b> ${h(q.options[q.answer])}${Q.ans[q.id]!=null?` <span class="muted">Você marcou ${'ABCD'[Q.ans[q.id]]}.</span>`:' <span class="muted">Em branco.</span>'}</p><p class="small muted" style="margin-top:4px">${h(q.explanation)}</p></div>`;}).join('')}</div>`:`<div class="empty">Gabarito limpo. Agora suba a dificuldade: refaça em modo prova com cronômetro.</div>`}`;
  m.querySelector('#again').onclick=()=>{ Q=null; render(); };
  const rd=m.querySelector('#redo'); if(rd) rd.onclick=()=>{ Q={list:shuffle(wrong), i:0, ans:{}, mode:'treino', label:'Erros do simulado', startedAt:now(), finished:false}; render(); };
}

/* ============================================================
   FLASHCARDS (SM-2 comprimido: intervalo máx. 4 dias)
   ============================================================ */
let F = null;
function cardFilter(cfg){
  let pool = CARDS.slice();
  if (cfg.area==='histologia') pool = pool.filter(c=>c.area==='histologia'||c.area==='embriologia');
  else if (cfg.area) pool = pool.filter(c=>c.area===cfg.area);
  if (cfg.prof) pool = pool.filter(c=>c.prof===cfg.prof);
  if (cfg.topic) pool = pool.filter(c=>c.topicId===cfg.topic);
  if (cfg.weeks && cfg.weeks.length) pool = pool.filter(c=>cfg.weeks.includes(c.week));
  return pool;
}
function buildDeck(cfg){
  const pool = cardFilter(cfg).filter(c=>!cfg.essential||c.essential), n=now();
  const due = pool.filter(c=>S.srs[c.id] && S.srs[c.id].due<=n).sort((a,b)=>S.srs[a.id].due-S.srs[b.id].due);
  const fresh = cfg.so==='vencidos' ? [] : shuffle(pool.filter(c=>!S.srs[c.id])).sort((a,b)=>(b.priority||0)-(a.priority||0)).slice(0,cfg.novos==null?20:cfg.novos);
  return [...due, ...fresh];
}
function scheduleCard(id,g,n=now()){
 const c=Object.assign({ease:2.5,ivl:0,reps:0,lapses:0,due:n,seen:0},S.srs[id]||{});c.seen++;
 if(g===0){c.lapses++;c.reps=0;c.ivl=0;c.ease=Math.max(1.3,c.ease-.2);c.due=n+600000;}
 else{c.reps++;c.ivl=c.reps===1?([0,.5,1,2][g]):c.reps===2?([0,1,2,3][g]):Math.min(4,c.ivl*(g===1?1.2:g===2?c.ease:c.ease*1.3));if(g===1)c.ease=Math.max(1.3,c.ease-.15);if(g===3)c.ease+=.15;c.due=n+c.ivl*DAY;
 const eve=new Date(2026,8,8,18).getTime(); if(n<eve)c.due=Math.min(c.due,eve);c.ivl=(c.due-n)/DAY;}
 c.last=g;c.at=n;return c;
}
function gradeCard(id,g){S.srs[id]=scheduleCard(id,g);save();}
function dueLabel(id,g){return 'Rever '+new Date(scheduleCard(id,g).due).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});}

function cartoes(m){
  if (F) return renderCard(m);
  const p=PARAMS;
  if (p.so || p.area || p.novos!=null || p.topic || p.prof || p.essential){ const deck=buildDeck(p); PARAMS={}; if(!deck.length){ toast('Nada para revisar com esse filtro'); } else { F={deck, i:0, show:false, done:0, again:[], label: p.topic&&TOPIC[p.topic]?TOPIC[p.topic].name:(p.area||p.prof||'Revisão')}; return renderCard(m);} }
  const due=dueCards().length, fresh=newCards().length, learned=CARDS.filter(c=>S.srs[c.id]&&S.srs[c.id].reps>=2).length;
  m.innerHTML = `
  <div class="head"><span class="eyebrow">${CARDS.length} cartões · repetição espaçada</span><h1>Flashcards</h1>
  <p class="lead">Responda em voz alta antes de virar. Depois avalie com honestidade: o cartão recebe uma data de revisão. Os novos priorizam o roteiro prático e a seleção essencial das aulas. Até a prova, revisões longas são antecipadas para a véspera.</p></div>
  <div class="grid3" style="margin-bottom:16px">
    <div class="stat card"><span class="v mono">${due}</span><span class="l">vencidos hoje</span></div>
    <div class="stat card"><span class="v mono">${fresh}</span><span class="l">nunca vistos</span></div>
    <div class="stat card"><span class="v mono">${learned}</span><span class="l">vistos 2+ vezes</span></div>
  </div>
  <div class="row" style="margin-bottom:18px"><button class="btn primary" data-deck='{"essential":true,"novos":20}'>Essenciais do roteiro e das aulas</button><button class="btn primary" data-deck='{"so":"vencidos"}' ${due?'':'disabled'}>Revisar vencidos (${due})</button><button class="btn" data-deck='{"novos":20}'>Vencidos + 20 novos</button><button class="btn" data-deck='{"novos":40}'>Vencidos + 40 novos</button></div>
  <div class="panel"><span class="eyebrow">Por área</span><div class="qcfg" style="margin-top:10px">
    <label class="f">Área<select id="farea"><option value="">Todas</option><option value="anatomia">Anatomia</option><option value="histologia">Histologia e embriologia</option><option value="radiologia">Radiologia</option></select></label>
    <label class="f">Semana<select id="fweek"><option value="">Todas</option>${[1,2,3,4,5].map(w=>`<option value="${w}">Semana ${w}</option>`).join('')}</select></label>
    <label class="f">Novos por sessão<select id="fnew"><option>10</option><option selected>20</option><option>30</option><option>50</option></select></label>
    <button class="btn primary" id="fgo">Iniciar</button></div></div>
  <p class="small muted" style="margin-top:14px">Atalhos: <span class="kbd">Espaço</span> virar · <span class="kbd">1</span> errei · <span class="kbd">2</span> difícil · <span class="kbd">3</span> bom · <span class="kbd">4</span> fácil</p>`;
  m.querySelector('#fgo').onclick=()=>{ const cfg={area:m.querySelector('#farea').value||null, weeks:m.querySelector('#fweek').value?[+m.querySelector('#fweek').value]:null, novos:+m.querySelector('#fnew').value}; const deck=buildDeck(cfg); if(!deck.length) return toast('Nada para revisar com esse filtro'); F={deck,i:0,show:false,done:0,again:[],label:cfg.area||'Revisão'}; render(); };
  m.querySelectorAll('[data-deck]').forEach(b=>b.onclick=()=>{ const cfg=JSON.parse(b.dataset.deck); const deck=buildDeck(cfg); if(!deck.length) return toast('Nada para revisar'); F={deck,i:0,show:false,done:0,again:[],label:cfg.so==='vencidos'?'Vencidos':'Revisão'}; render(); });
}
function renderCard(m){
  if (F.i >= F.deck.length){
    if (F.again.some(c=>S.srs[c.id]?.due<=now())){ const ready=F.again.filter(c=>S.srs[c.id]?.due<=now());F.again=F.again.filter(c=>S.srs[c.id]?.due>now());F.deck=ready;F.i=0;toast('Revisões vencidas disponíveis'); }
    else { m.innerHTML = `<div class="head"><h1>Sessão concluída</h1><p class="lead">${F.done} avaliações registradas. Vencidos agora: ${dueCards().length}. ${F.again.length?'Os cartões errados voltarão no horário agendado.':''}</p></div><div class="row"><button class="btn primary" id="fmore">Mais 20 novos</button><button class="btn" id="fback">Voltar</button></div>`; m.querySelector('#fmore').onclick=()=>{ const deck=buildDeck({novos:20}); if(!deck.length) return toast('Não há mais cartões novos'); F={deck,i:0,show:false,done:0,again:[],label:'Novos'}; render(); }; m.querySelector('#fback').onclick=()=>{F=null;render();}; return; }
  }
  const c=F.deck[F.i], st=S.srs[c.id];
  m.innerHTML = `
  <div class="qhead"><span class="chip ${c.area}">${h(c.area)}</span><span class="chip neutral">${h(c.topicName)}</span><div class="prog"><div class="meter"><i style="width:${pct(F.i,F.deck.length)}%"></i></div></div><span class="mono small">${F.i+1} / ${F.deck.length}</span><button class="btn ghost sm" id="fquit">Encerrar</button></div>
  <div class="fc" id="fc"><div class="face"><div class="q">${h(c.front)}</div>${F.show?`<div class="a">${h(c.back)}</div>`:''}<div class="hint">${F.show?(st?`Visto ${st.seen}× · intervalo atual ${st.ivl} d`:'Cartão novo'):'Responda em voz alta e depois vire o cartão (Espaço)'}</div></div></div>
  <div style="margin-top:14px">${F.show?`<div class="grades">
    <button class="g0" data-g="0">Errei<small>${dueLabel(c.id,0)}</small></button>
    <button class="g1" data-g="1">Difícil<small>${dueLabel(c.id,1)}</small></button>
    <button class="g2" data-g="2">Bom<small>${dueLabel(c.id,2)}</small></button>
    <button class="g3" data-g="3">Fácil<small>${dueLabel(c.id,3)}</small></button></div>`
    :`<button class="btn primary" id="flip" style="width:100%;justify-content:center;padding:12px">Virar</button>`}</div>
  ${TOPIC[c.topicId]?`<div class="row" style="margin-top:12px"><button class="btn ghost sm" data-go="guias" data-topic="${c.topicId}">Abrir guia do tópico</button></div>`:''}`;
  const flip=m.querySelector('#flip'); if(flip) flip.onclick=()=>{F.show=true;render();};
  m.querySelector('#fc').onclick=()=>{ if(!F.show){F.show=true;render();} };
  m.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>gradeAndNext(+b.dataset.g));
  m.querySelector('#fquit').onclick=()=>{F=null;render();};
}
function gradeAndNext(g){ const c=F.deck[F.i]; gradeCard(c.id,g); if(g===0) F.again.push(c); F.done++; F.i++; F.show=false; render(); }

/* ============================================================
   DISCURSIVAS
   ============================================================ */
let DISC_SET=null;
function discursivas(m){
  const p=PARAMS;
  let list = DISC.slice();
  let label='Todas';
  if (p.preset==='prova'){ if(!DISC_SET || p.fresh) DISC_SET=pickDiscursiveExam(); list=DISC_SET; label='7 discursivas · mistura didática; divisão real por professor não informada'; }
  else if (p.prof){ list=list.filter(d=>d.prof===p.prof); label=PROF_LABEL[p.prof]; }
  else if (p.topic){ list=list.filter(d=>d.topicId===p.topic); label=TOPIC[p.topic]?TOPIC[p.topic].name:'Tópico'; }
  m.innerHTML = `
  <div class="head"><span class="eyebrow">${DISC.length} perguntas no formato das APS</span><h1>Discursivas</h1>
  <p class="lead">Escreva a resposta antes de abrir o modelo (à mão é melhor: é como será na prova). Depois marque os pontos que você cobriu e dê a nota de 0 a 3.</p></div>
  <div class="row" style="margin-bottom:14px"><button class="btn ${p.preset==='prova'?'primary':''}" data-go="discursivas" data-preset="prova">Conjunto da prova (7)</button>${p.preset==='prova'?`<button class="btn ghost sm" id="dfresh">Sortear outro conjunto</button>`:''}${PROFS.map(pr=>`<button class="btn ${p.prof===pr?'primary':''}" data-go="discursivas" data-prof="${pr}"><i class="dot ${pr}"></i>${h(pr)}</button>`).join('')}<button class="btn ${!p.preset&&!p.prof&&!p.topic?'primary':''}" data-go="discursivas">Todas</button></div>
  <span class="eyebrow">${h(label)} · ${list.length}</span>
  <div class="stack" style="margin-top:10px">${list.map(d=>discRow(d)).join('')||'<div class="empty">Nada aqui.</div>'}</div>`;
  const df=m.querySelector('#dfresh'); if(df) df.onclick=()=>{ DISC_SET=null; go('discursivas',{preset:'prova'}); };
  m.querySelectorAll('textarea[data-draft]').forEach(t=>t.oninput=()=>{ S.drafts[t.dataset.draft]=t.value; save(); });
  m.querySelectorAll('[data-reveal]').forEach(b=>b.onclick=()=>{ S.reveal[b.dataset.reveal]=true; render(); });
  m.querySelectorAll('[data-grade]').forEach(b=>b.onclick=()=>{ const [id,g]=b.dataset.grade.split('|'); S.disc[id]=+g; save(); render(); toast('Nota registrada'); });
}
function discRow(d){
  const t=TOPIC[d.topicId], rev=!!S.reveal[d.id], g=S.disc[d.id];
  return `<details ${rev?'open':''}><summary><span class="chip ${d.prof}">${h(d.prof)}</span><span style="flex:1">${h(d.prompt)}</span>${g!=null?`<span class="chip ${g>=3?'ok':g>=2?'warn':'bad'}">${g}/3</span>`:''}</summary><div class="body">
    ${t?`<p class="small muted" style="margin-bottom:8px">Tópico: ${h(t.name)} · resposta esperada em ${d.lines||3} linhas</p>`:''}
    <textarea data-draft="${d.id}" placeholder="Escreva aqui (ou no papel) antes de ver o modelo">${h(S.drafts[d.id]||'')}</textarea>
    ${rev?`<div class="expl" style="margin-top:12px"><b class="t">Resposta-modelo</b>${h(d.modelAnswer)}</div>
    <div style="margin-top:12px"><span class="eyebrow">O corretor procura</span><ul class="tight" style="margin-top:6px">${(d.keyPoints||[]).map(k=>`<li>${h(k)}</li>`).join('')}</ul></div>
    <div class="row" style="margin-top:14px;align-items:center"><span class="small muted">Sua nota:</span><div class="score">${[0,1,2,3].map(i=>`<button class="${g===i?'on s'+i:''}" data-grade="${d.id}|${i}">${i}</button>`).join('')}</div><span class="small muted">0 não sabia · 1 parcial · 2 completa · 3 completa e com relação/clínica</span></div>`
    :`<div class="row" style="margin-top:10px"><button class="btn primary sm" data-reveal="${d.id}">Ver resposta-modelo</button></div>`}
  </div></details>`;
}

/* ============================================================
   GUIAS
   ============================================================ */
function guias(m){
  const p=PARAMS;
  let units = UNITS.slice();
  if (p.area==='histologia') units = units.filter(u=>u.area==='histologia'||u.area==='embriologia');
  else if (p.area) units = units.filter(u=>u.area===p.area);
  if (p.weeks) units = units.filter(u=>p.weeks.includes(u.week));
  if (p.topic){ const t=TOPIC[p.topic]; if(t) units=[UNIT[t.unitId]]; }
  const q=(p.q||'').toLowerCase();
  m.innerHTML = `
  <div class="head"><span class="eyebrow">${TOPICS.length} tópicos em ${UNITS.length} aulas</span><h1>Guias de revisão</h1>
  <p class="lead">Uma página por tópico: o essencial, o que cai, as confusões clássicas e a aplicação clínica. Leia cobrindo o texto e tentando recitar antes.</p></div>
  <div class="row" style="margin-bottom:8px"><input class="search" type="search" id="gq" placeholder="Buscar estrutura, termo, nível vertebral…" value="${h(p.q||'')}">
    <select id="garea"><option value="">Todas as áreas</option><option value="anatomia" ${p.area==='anatomia'?'selected':''}>Anatomia</option><option value="histologia" ${p.area==='histologia'?'selected':''}>Histologia e embriologia</option><option value="radiologia" ${p.area==='radiologia'?'selected':''}>Radiologia</option></select>
    <select id="gweek"><option value="">Todas as semanas</option>${[1,2,3,4,5].map(w=>`<option value="${w}" ${p.weeks&&p.weeks.length===1&&p.weeks[0]===w?'selected':''}>Semana ${w}</option>`).join('')}</select>
    ${p.topic||p.weeks||p.area||p.q?'<button class="btn ghost sm" data-go="guias">Limpar</button>':''}</div>
  <div id="glist"></div>`;
  const list=m.querySelector('#glist'); if(Q&&!Q.finished||F||ID){const bar=document.createElement('div');bar.className='panel row resume';bar.innerHTML=[Q&&!Q.finished?'<button class="btn primary" data-go="simulado">Retomar simulado</button>':'',F?'<button class="btn" data-go="cartoes">Retomar cartões</button>':'',ID?'<button class="btn" data-go="identificar">Retomar identificação</button>':''].join('');list.before(bar);}
  let html='';
  for (const u of units.sort((a,b)=>a.week-b.week||a.id.localeCompare(b.id))){
    let ts = u.topics||[];
    if (p.topic) ts = ts.filter(t=>t.id===p.topic);
    if (q) ts = ts.filter(t=>JSON.stringify(t).toLowerCase().includes(q));
    if (!ts.length) continue;
    html += `<div class="unit-head"><span class="chip ${u.prof}">${h(u.prof)}</span><span class="eyebrow">Semana ${u.week} · ${h(u.area)}</span><h2>${h(u.title)}</h2></div>`;
    html += ts.map(t=>topicBlock(t)).join('');
  }
  list.innerHTML = html || '<div class="empty">Nenhum tópico encontrado.</div>';
  const gq=m.querySelector('#gq'); gq.oninput=()=>{ PARAMS=Object.assign({},PARAMS,{q:gq.value, topic:null}); clearTimeout(guias._t); guias._t=setTimeout(()=>{ const pos=gq.selectionStart; render(); const n=document.getElementById('gq'); n.focus(); n.setSelectionRange(pos,pos); },250); };
  m.querySelector('#garea').onchange=e=>go('guias',Object.assign({},PARAMS,{area:e.target.value||null, topic:null}));
  m.querySelector('#gweek').onchange=e=>go('guias',Object.assign({},PARAMS,{weeks:e.target.value?[+e.target.value]:null, topic:null}));
  if (p.topic){ const el=m.querySelector(`[data-topic-block="${p.topic}"]`); if(el) setTimeout(()=>el.scrollIntoView({block:'start'}),30); }
}
function topicBlock(t){
  const mv=topicMastery(t), nq=MCQ.filter(q=>q.topicId===t.id).length, nc=CARDS.filter(c=>c.topicId===t.id).length, nd=DISC.filter(d=>d.topicId===t.id).length;
  return `<div class="topic" data-topic-block="${t.id}">
    <div class="row" style="justify-content:space-between;align-items:flex-start"><h3>${h(t.name)}</h3>${mv!=null?`<span class="chip ${meterClass(mv)}">${Math.round(mv*100)}% nos itens praticados</span>`:''}</div>
    <p class="sum">${h(t.summary)}</p>${t.sourceNote?`<p class="panel small">${h(t.sourceNote)}</p>`:''}<p class="small muted">Fonte de estudo: ${h(UNIT[t.unitId].sourceLabel||UNIT[t.unitId].title)} · ${h(UNIT[t.unitId].source||'anotações locais')}${t.referenceUrl?` · <a href="${h(t.referenceUrl)}" target="_blank" rel="noopener">Referência complementar</a>`:''}</p>
    <div class="cols">
      ${(t.highYield||[]).length?`<div><h4>Cai na prova</h4><ul>${t.highYield.map(x=>`<li>${h(x)}</li>`).join('')}</ul></div>`:''}
      ${(t.pegadinhas||[]).length?`<div><h4>Pegadinhas</h4><ul class="peg">${t.pegadinhas.map(x=>`<li>${h(x)}</li>`).join('')}</ul></div>`:''}
      ${(t.clinical||[]).length?`<div><h4>Aplicação clínica</h4><ul>${t.clinical.map(x=>`<li>${h(x)}</li>`).join('')}</ul></div>`:''}
      ${(t.mnemonics||[]).length?`<div><h4>Mnemônicos</h4><ul class="mn">${t.mnemonics.map(x=>`<li>${h(x)}</li>`).join('')}</ul></div>`:''}
    </div>
    <div class="row" style="margin-top:14px">${nq?`<button class="btn sm" data-go="simulado" data-topic="${t.id}">${nq} questões</button>`:''}${nc?`<button class="btn sm" data-go="cartoes" data-topic="${t.id}">${nc} cartões</button>`:''}${nd?`<button class="btn sm" data-go="discursivas" data-topic="${t.id}">${nd} discursivas</button>`:''}</div>
  </div>`;
}

/* ============================================================
   PROVA PRÁTICA
   ============================================================ */
const STATIONS = [
  {n:1, t:'Cavidade oral e faringe', keys:['papila','parótida','submandibular','sublingual','palato mole','nasofaringe','orofaringe','laringofaringe','início do esôfago','cricoide']},
  {n:2, t:'Esôfago e diafragma', keys:['esôfago cervical','esôfago torácico','esôfago abdominal','aorta torácica','diafragma','centro tendíneo','hiato','forame da veia cava']},
  {n:3, t:'Arranjo geral do sistema digestório', keys:['esôfago no mediastino','válvula ileocecal','supramesocólico','inframesocólico','mesocólon transverso']},
  {n:4, t:'Estômago, duodeno, pâncreas e tríade portal', keys:['fundo','corpo do estômago','antro','piloro','tríade portal','duodeno','cabeça do pâncreas','corpo do pâncreas','cauda do pâncreas','colo do pâncreas','processo uncinado','vascularização do estômago','gástrica','gastro-omental','pancreaticoduodenal']},
  {n:5, t:'Fígado, vesícula, vias biliares e apêndice', keys:['lobo direito','lobo esquerdo','lobo quadrado','lobo caudado','falciforme','coronário','triangular','pedículo','vesícula','ducto hepático','ducto cístico','colédoco','ducto pancreático','apêndice','porta hepatis']},
  {n:6, t:'Bacia e parede abdominal', keys:['ílio','ísquio','púbis','sacro','cóccix','espinha ilíaca','tuberosidade isquiática','promontório','forame obturado','acetábulo','reto do abdome','piramidal','oblíquo externo','ligamento inguinal','linha alba']},
];
function pratica(m){
  const tab = PARAMS.tab || 'estacoes';
  const anat = IMG.filter(i=>i.area==='anatomia'); const others = IMG.filter(i=>i.area!=='anatomia');
  const dedup = arr => { const out=[]; for(const it of arr) uniqPush(out, it, x=>x.structure.toLowerCase().trim()); return out; };
  const A = dedup(anat);
  const assign = s => { const nm=s.structure.toLowerCase(); const st=STATIONS.find(x=>x.keys.some(k=>nm.includes(k))); return st?st.n:0; };
  A.forEach(s=>s.station=assign(s));
  m.innerHTML = `
  <div class="head"><span class="eyebrow">Reconhecer · localizar · relacionar · função</span><h1>Prova prática</h1>
  <p class="lead">Diante do alfinete, em 20–30 s: <b>nome → onde está → uma relação que a diferencia → função ou clínica</b>. Pontue cada estrutura de 0 a 3; ela está segura após duas notas 3 em sessões separadas por pelo menos 24 horas, sem erro posterior.</p></div>
  <div class="row" style="margin-bottom:10px"><button class="btn ${tab==='estacoes'?'primary':''}" data-go="pratica" data-tab="estacoes">Estações da peça (${A.length})</button><button class="btn ${tab==='imagens'?'primary':''}" data-go="pratica" data-tab="imagens">Lâminas e imagens (${dedup(others).length})</button><button class="btn" id="newpractice">Iniciar outra rodada</button><button class="btn ghost sm" id="hideall">Ocultar todas as pistas</button><button class="btn ghost sm" id="showall">Mostrar todas</button></div>
  <p class="small muted">0 não localizei · 1 reconheci com pista · 2 nomeei sem ajuda · 3 nomeei e expliquei a relação</p>
  ${tab==='estacoes' ? STATIONS.map(st=>stationBlock(st, A.filter(s=>s.station===st.n))).join('') + (A.some(s=>!s.station)?stationBlock({n:0,t:'Outras estruturas citadas nas aulas'}, A.filter(s=>!s.station)):'')
    : ['radiologia','histologia','embriologia'].map(ar=>{ const L=dedup(others.filter(i=>i.area===ar)); return L.length?stationBlock({n:0,t:ar[0].toUpperCase()+ar.slice(1)}, L):''; }).join('')}`;
  m.querySelectorAll('[data-reveal-hint]').forEach(b=>b.onclick=()=>{const el=b.nextElementSibling;el.hidden=!el.hidden;b.setAttribute('aria-expanded',String(!el.hidden));b.textContent=el.hidden?'Mostrar pista':'Ocultar pista';}); m.querySelector('#newpractice').onclick=()=>{S.settings.practiceSession=sessionId();save();render();toast('Nova rodada iniciada');};
  m.querySelectorAll('[data-sc]').forEach(b=>b.onclick=()=>{ const [k,v]=b.dataset.sc.split('|');recordPractice(k,+v);render(); });
  m.querySelector('#hideall').onclick=()=>m.querySelectorAll('.rec').forEach(e=>{e.hidden=true;e.previousElementSibling.textContent='Mostrar pista';e.previousElementSibling.setAttribute('aria-expanded','false');});
  m.querySelector('#showall').onclick=()=>m.querySelectorAll('.rec').forEach(e=>{e.hidden=false;e.previousElementSibling.textContent='Ocultar pista';e.previousElementSibling.setAttribute('aria-expanded','true');});
}
function stationBlock(st, list){
  if (!list.length) return '';
  const secure = list.filter(s=>{return practiceSecure(S.prat[keyOf(s)]||[]);}).length;
  const ims = st.n ? IMAGES.filter(im=>im.station===st.n && im.area==='anatomia').slice(0,8) : [];
  return `<div class="station"><div class="row" style="justify-content:space-between"><h2>${st.n?`Estação ${st.n} — `:''}${h(st.t)}</h2><span class="small muted mono">${secure}/${list.length} seguras</span></div>
  ${ims.length?`<div class="thumbs">${ims.map(im=>`<button data-open="${im.id}" title="${h(im.title)}"><img src="${im.src}" alt="" loading="lazy"></button>`).join('')}<button class="btn ghost sm" data-go="atlas" data-station="${st.n}">Ver no atlas</button><button class="btn ghost sm" data-go="identificar" data-station="${st.n}">Testar</button></div>`:''}
  ${list.map(s=>{const k=keyOf(s); const r=S.prat[k]||[]; const last=practiceGrade(r[r.length-1]); const sec=practiceSecure(r); return `<div class="st-row"><div><div class="nm">${h(s.structure)}</div><div class="small muted">${h(s.function||'')}</div>${sec?'<div class="secure">segura</div>':''}</div><div><button class="btn sm" data-reveal-hint aria-expanded="false">Mostrar pista</button><div class="rec" hidden><b>Como reconhecer:</b> ${h(s.howToRecognize)}<br><b>Relação-chave:</b> ${h(s.keyRelation)}</div></div><div><div class="score">${[0,1,2,3].map(i=>`<button class="${last===i?'on s'+i:''}" data-sc="${h(k)}|${i}">${i}</button>`).join('')}</div><div class="small muted mono" style="margin-top:4px">${r.length?'histórico '+r.map(practiceGrade).join(' '):'sem teste'}</div></div></div>`;}).join('')}</div>`;
}
const keyOf = s => (s.area+':'+s.structure).toLowerCase().replace(/[^a-z0-9áéíóúâêôãõç]+/g,'-');

/* ============================================================
   PEGADINHAS E MNEMÔNICOS
   ============================================================ */
function pegadinhas(m){
  const q=(PARAMS.q||'').toLowerCase();
  const pegs=[], mns=[];
  for (const t of TOPICS){ for(const x of (t.pegadinhas||[])) uniqPush(pegs,{x,t},o=>o.x.toLowerCase().slice(0,60)); for(const x of (t.mnemonics||[])) uniqPush(mns,{x,t},o=>o.x.toLowerCase().slice(0,60)); }
  const fp = pegs.filter(o=>!q||o.x.toLowerCase().includes(q)||o.t.name.toLowerCase().includes(q));
  const fm = mns.filter(o=>!q||o.x.toLowerCase().includes(q)||o.t.name.toLowerCase().includes(q));
  const byProf = p => fp.filter(o=>o.t.prof===p);
  m.innerHTML = `
  <div class="head"><span class="eyebrow">${pegs.length} confusões · ${mns.length} mnemônicos</span><h1>Pegadinhas</h1>
  <p class="lead">Cada item aqui é um par de coisas parecidas que a prova gosta de trocar. Leia em voz alta, dizendo a diferença antes de ler o texto.</p></div>
  <input class="search" type="search" id="pq" placeholder="Filtrar…" value="${h(PARAMS.q||'')}" style="margin-bottom:16px">
  ${PROFS.map(p=>{const L=byProf(p); return L.length?`<h2 style="margin:18px 0 8px"><i class="dot ${p}"></i> ${h(PROF_LABEL[p])}</h2><ul class="tight peg" style="padding-left:18px">${L.map(o=>`<li>${h(o.x)} <button class="btn ghost sm" data-go="guias" data-topic="${o.t.id}" style="padding:0 6px">${h(o.t.name)}</button></li>`).join('')}</ul>`:'';}).join('')}
  ${fm.length?`<h2 style="margin:28px 0 8px">Mnemônicos</h2><ul class="tight mn" style="padding-left:18px">${fm.map(o=>`<li>${h(o.x)} <span class="muted">· ${h(o.t.name)}</span></li>`).join('')}</ul>`:''}`;
  const pq=m.querySelector('#pq'); pq.oninput=()=>{ PARAMS={q:pq.value}; clearTimeout(pegadinhas._t); pegadinhas._t=setTimeout(()=>{const pos=pq.selectionStart; render(); const n=document.getElementById('pq'); n.focus(); n.setSelectionRange(pos,pos);},250); };
}

/* ============================================================
   PROGRESSO
   ============================================================ */
function progresso(m){
  const rows = TOPICS.map(t=>({t, v:topicMastery(t), nq:MCQ.filter(q=>q.topicId===t.id).length, done:MCQ.filter(q=>q.topicId===t.id&&S.quiz[q.id]).length, cards:CARDS.filter(c=>c.topicId===t.id).length, seen:CARDS.filter(c=>c.topicId===t.id&&S.srs[c.id]).length}));
  const started = rows.filter(r=>r.v!=null), notStarted = rows.filter(r=>r.v==null);
  const overall = started.length? started.reduce((a,r)=>a+r.v,0)/started.length : null;
  m.innerHTML = `
  <div class="head"><span class="eyebrow">Desempenho e cobertura</span><h1>Progresso</h1>
  <p class="lead">O percentual descreve apenas os itens praticados: questões, cartões e autonotas. Não é previsão de nota nem prova de domínio. Confira também a cobertura e o número de tentativas.</p></div>
  <div class="gauges">
    ${PROFS.map(p=>{const r=profReadiness(p); return `<div class="gauge"><span class="eyebrow"><i class="dot ${p}"></i> ${h(PROF_LABEL[p])}</span><div class="v mono">${r.mastery==null?'—':Math.round(r.mastery*100)+'%'}</div><div class="meter ${meterClass(r.mastery)}"><i style="width:${r.mastery==null?0:Math.round(r.mastery*100)}%"></i></div><p class="small muted" style="margin-top:6px">${r.seen}/${r.total} questões feitas${r.acc!=null?` · ${Math.round(r.acc*100)}% de acerto`:''}</p></div>`;}).join('')}
    <div class="gauge"><span class="eyebrow">Cobertura</span><div class="v mono">${started.length}<span class="muted" style="font-size:1rem">/${rows.length}</span></div><div class="meter"><i style="width:${pct(started.length,rows.length)}%"></i></div><p class="small muted" style="margin-top:6px">tópicos com algum treino</p></div>
    ${(()=>{const ks=eligibleIdentKeys(); const n=ks.reduce((a,k)=>a+S.ident[k].n,0), c=ks.reduce((a,k)=>a+S.ident[k].c,0); const v=n?c/n:null; return `<div class="gauge"><span class="eyebrow">Identificação visual</span><div class="v mono">${v==null?'—':Math.round(v*100)+'%'}</div><div class="meter ${meterClass(v)}"><i style="width:${v==null?0:Math.round(v*100)}%"></i></div><p class="small muted" style="margin-top:6px">${ks.length} estruturas testadas · ${n} tentativas</p></div>`;})()}
  </div>
  <h2 style="margin:28px 0 10px">Tópicos, por desempenho nos itens praticados</h2>
  <div class="tbl"><table><tr><th>Tópico</th><th>Prof.</th><th>Desempenho praticado</th><th>Questões</th><th>Cartões</th><th></th></tr>
  ${started.sort((a,b)=>a.v-b.v).map(r=>`<tr><td>${h(r.t.name)}<div class="small muted">${h(r.t.unitTitle)}</div></td><td><i class="dot ${r.t.prof}"></i> ${h(r.t.prof)}</td><td style="min-width:140px"><div class="meter ${meterClass(r.v)}"><i style="width:${Math.round(r.v*100)}%"></i></div><span class="mono small">${Math.round(r.v*100)}%</span></td><td class="mono">${r.done}/${r.nq}</td><td class="mono">${r.seen}/${r.cards}</td><td><div class="row" style="gap:4px"><button class="btn sm" data-go="simulado" data-topic="${r.t.id}">Treinar</button><button class="btn ghost sm" data-go="guias" data-topic="${r.t.id}">Guia</button></div></td></tr>`).join('')}
  ${notStarted.map(r=>`<tr style="opacity:.7"><td>${h(r.t.name)}<div class="small muted">${h(r.t.unitTitle)}</div></td><td><i class="dot ${r.t.prof}"></i> ${h(r.t.prof)}</td><td><span class="small muted">não iniciado</span></td><td class="mono">0/${r.nq}</td><td class="mono">0/${r.cards}</td><td><button class="btn sm" data-go="simulado" data-topic="${r.t.id}">Começar</button></td></tr>`).join('')}
  </table></div>
  <div class="panel" style="margin-top:28px"><span class="eyebrow">Backup do progresso</span><p class="small muted" style="margin:6px 0 10px">O progresso fica salvo neste navegador. Para levar para outro aparelho, copie o texto abaixo e cole lá em "Restaurar".</p>
  <textarea id="bk" style="min-height:70px;font-family:var(--mono);font-size:.75rem">${h(JSON.stringify(S))}</textarea>
  <div class="row" style="margin-top:8px"><button class="btn sm" id="bkcopy">Copiar</button><button class="btn sm" id="bkrestore">Restaurar do texto acima</button><button class="btn ghost sm" id="bkreset" style="color:var(--bad)">Zerar tudo</button></div></div>`;
  m.querySelector('#bkcopy').onclick=()=>{ const t=m.querySelector('#bk'); t.select(); try{ navigator.clipboard.writeText(t.value); toast('Copiado'); }catch(e){ toast('Selecione e copie manualmente'); } };
  m.querySelector('#bkrestore').onclick=()=>{ try{ const o=JSON.parse(m.querySelector('#bk').value); if(o&&o.srs){ S=normalizeState(o);Q=null;F=null;ID=null;restoreActive(false);save();render(); toast('Progresso restaurado'); } else toast('Texto inválido'); }catch(e){ toast('Texto inválido'); } };
  m.querySelector('#bkreset').onclick=()=>{ if(confirm('Zerar todo o progresso salvo neste navegador?')){ S=emptyState();Q=null;F=null;ID=null;save();render(); } };
}

/* ============================================================
   ATLAS
   ============================================================ */
let LB = null;
function imgFilter(p){
  let L = IMAGES.slice();
  if (p.station!=null && p.station!=='') L = L.filter(im=>im.station===+p.station);
  if (p.area) L = L.filter(im=>im.area===p.area);
  if (p.pins) L = L.filter(im=>im.testPins.length>=2);
  const q=(p.q||'').toLowerCase();
  if (q) L = L.filter(im=>(im.title+' '+(im.caption||'')+' '+im.structures.join(' ')+' '+im.tags.join(' ')+' '+im.pins.map(x=>x.label).join(' ')).toLowerCase().includes(q));
  return L;
}
function atlas(m){
  const p=PARAMS;
  if (!IMAGES.length){ m.innerHTML=`<div class="head"><h1>Atlas</h1></div><div class="empty">Nenhuma imagem nesta versão.</div>`; return; }
  const L=imgFilter(p);
  m.innerHTML = `
  <div class="head"><span class="eyebrow">${IMAGES.length} imagens · slides das aulas e fontes de licença aberta</span><h1>Atlas</h1>
  <p class="lead">Abra uma imagem, nomeie cada estrutura antes de mostrar a legenda e depois teste as figuras habilitadas no modo Identificar. O Atlas mantém todas as imagens; a avaliação usa apenas marcadores revisados em figuras sem legendas.</p></div>
  <div class="row" style="margin-bottom:10px">
    <input class="search" type="search" id="aq" placeholder="Buscar estrutura, órgão…" value="${h(p.q||'')}">
    <select id="ast"><option value="">Todas as estações</option>${[1,2,3,4,5,6].map(s=>`<option value="${s}" ${String(p.station)===String(s)?'selected':''}>Estação ${s} — ${STATION_NAMES[s]}</option>`).join('')}<option value="0" ${String(p.station)==='0'?'selected':''}>Pelve, períneo, genital e outros</option></select>
    <select id="aar"><option value="">Todas as áreas</option>${Object.keys(AREA_NAMES).map(a=>`<option value="${a}" ${p.area===a?'selected':''}>${AREA_NAMES[a]}</option>`).join('')}</select>
    <label class="row small" style="gap:6px;font-weight:600"><input type="checkbox" id="apins" ${p.pins?'checked':''} style="accent-color:var(--accent)"> aptas para teste sem legenda</label>
  </div>
  <p class="small muted" style="margin-bottom:12px">${L.length} imagens${L.length?` · <button class="btn ghost sm" data-go="identificar" data-q="${h(p.q||'')}" ${p.station!=null&&p.station!==''?`data-station="${p.station}"`:''} ${p.area?`data-area="${p.area}"`:''}>Testar estas imagens</button>`:''}</p>
  <div class="agrid">${L.map(im=>`<button class="acard" data-open="${im.id}"><div class="th"><img src="${im.src}" alt="" loading="lazy"></div><div class="bd"><b>${h(im.title)}</b><div class="row"><span class="chip ${im.area}">${h(AREA_NAMES[im.area]||im.area)}</span>${im.station?`<span class="chip neutral">Est. ${im.station}</span>`:''}${im.pins.length?`<span class="chip neutral">${im.pins.length} marcadores</span>`:''}</div></div></button>`).join('')||'<div class="empty">Nada com esse filtro.</div>'}</div>`;
  const aq=m.querySelector('#aq'); aq.oninput=()=>{ PARAMS=Object.assign({},PARAMS,{q:aq.value}); clearTimeout(atlas._t); atlas._t=setTimeout(()=>{const pos=aq.selectionStart; render(); const n=document.getElementById('aq'); n.focus(); n.setSelectionRange(pos,pos);},250); };
  m.querySelector('#ast').onchange=e=>go('atlas',Object.assign({},PARAMS,{station:e.target.value===''?null:e.target.value}));
  m.querySelector('#aar').onchange=e=>go('atlas',Object.assign({},PARAMS,{area:e.target.value||null}));
  m.querySelector('#apins').onchange=e=>go('atlas',Object.assign({},PARAMS,{pins:e.target.checked}));
}
function openLB(id, opts){ const im=IMG_BY[id]; if(!im) return; LB=Object.assign({id, showPins:true, hideLegend:false,focus:document.activeElement}, opts||{}); renderLB(); }
function closeLB(){const focus=LB?.focus;LB=null;const el=document.getElementById('lb');if(el)el.remove();document.querySelector('.shell').inert=false;document.body.style.overflow='';if(focus?.isConnected)focus.focus();}
function renderLB(){
  const old=document.getElementById('lb'); if(old) old.remove();
  const im=IMG_BY[LB.id];
  const el=document.createElement('div'); el.className='lb'; el.id='lb'; el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','Imagem do atlas');
  el.innerHTML=`<div class="box"><div class="imgwrap"><div class="pinbox"><img src="${im.src}" alt="${h(im.title)}">${LB.showPins?im.pins.map(pn=>`<span class="pin" style="left:${pn.x}%;top:${pn.y}%">${pn.n}</span>`).join(''):''}</div></div>
  <div class="side"><div class="row" style="justify-content:space-between"><span class="row" style="gap:5px"><span class="chip ${im.area}">${h(AREA_NAMES[im.area]||im.area)}</span>${im.station?`<span class="chip neutral">Estação ${im.station}</span>`:''}</span><button class="btn ghost sm" id="lbclose">Fechar</button></div>
  <h3>${h(im.title)}</h3><p class="cap">${h(im.caption||'')}</p>
  ${im.pins.length?`<div class="row"><button class="btn sm" id="lbpins">${LB.showPins?'Esconder marcadores':'Mostrar marcadores'}</button><button class="btn sm" id="lbleg">${LB.hideLegend?'Mostrar legenda':'Esconder legenda'}</button>${im.testPins.length>=2?'<button class="btn primary sm" id="lbtest">Testar nesta imagem</button>':'<span class="small muted">Figura de consulta. O teste usa outras imagens sem legenda e com marcadores revisados.</span>'}</div>
  <div class="legend" ${LB.hideLegend?'hidden':''}>${im.pins.map(pn=>`<div><span class="n">${pn.n}</span><span>${h(pn.label)}</span></div>`).join('')}</div>`
  :(im.structures.length?`<div><span class="eyebrow">Estruturas</span><p class="small" style="margin-top:4px">${im.structures.map(h).join(' · ')}</p></div>`:'')}
  <div class="cred">${h(im.source||'')}${im.author?` · ${h(im.author)}`:''}${im.license?` · ${h(im.license)}`:''}${im.sourceUrl?` · <a href="${h(im.sourceUrl)}" target="_blank" rel="noopener">página da fonte</a>`:''}</div></div></div>`;
  document.body.appendChild(el);document.querySelector('.shell').inert=true;document.body.style.overflow='hidden';el.querySelector('#lbclose').focus();el.onkeydown=e=>{if(e.key==='Tab'){const a=[...el.querySelectorAll('button,a[href]')];if(e.shiftKey&&document.activeElement===a[0]){e.preventDefault();a.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===a.at(-1)){e.preventDefault();a[0].focus();}}};
  el.addEventListener('click', e=>{ if(e.target===el) closeLB(); });
  el.querySelector('#lbclose').onclick=closeLB;
  const bp=el.querySelector('#lbpins'); if(bp) bp.onclick=()=>{LB.showPins=!LB.showPins; renderLB();};
  const bl=el.querySelector('#lbleg'); if(bl) bl.onclick=()=>{LB.hideLegend=!LB.hideLegend; renderLB();};
  const bt=el.querySelector('#lbtest'); if(bt) bt.onclick=()=>{ const id=im.id; closeLB(); ID=null; go('identificar',{img:id}); };
}

/* ============================================================
   IDENTIFICAR (onde está? / o que é isto?)
   ============================================================ */
let ID = null;
const identKey = it => it.img.id+'|'+it.pin.n;
function eligibleIdentKeys(){const eligible=new Set(IMAGES.flatMap(im=>im.testPins.map(n=>im.id+'|'+n)));return Object.keys(S.ident).filter(k=>eligible.has(k)&&!S.ident[k].selfAssessed);}
function resetIdentItem(it){return {...it,done:false,hit:false,click:null,chosen:null,chosenPin:null,freeText:'',revealed:false,selfAssessed:false};}
function identItems(p){
  let L = imgFilter(p).filter(im=>!im.hasLabels&&im.testPins.length>=2);
  if (p.img) L = L.filter(im=>im.id===p.img);
  if (p.station!=null && p.station!=='') L = L.filter(im=>im.station===+p.station);
  if (p.area) L = L.filter(im=>im.area===p.area);
  const items=[]; L.forEach(im=>im.pins.filter(pin=>im.testPins.includes(pin.n)).forEach(pin=>items.push({img:im, pin})));
  const rank = it => { const s=S.ident[identKey(it)]; if(!s) return 0; if(!s.last) return 1; return 2-Math.min(1,(now()-s.at)/DAY/100); };
  const sorted = shuffle(items).sort((a,b)=>rank(a)-rank(b));
  const n = p.img ? items.length : (p.n||15);
  return sorted.slice(0,n).map(it=>{
    const mode = (p.mode && p.mode!=='misto') ? p.mode : (Math.random()<0.5?'onde':'oque');
    const same = [...new Set(it.img.pins.filter(x=>x.n!==it.pin.n&&it.img.testPins.includes(x.n)).map(x=>x.label))].filter(l=>l!==it.pin.label);
    let pool = shuffle(same).slice(0,3);
    if (pool.length<3){ const extra = shuffle([...new Set(IMAGES.filter(im=>im.area===it.img.area&&im.id!==it.img.id&&im.testPins.length).flatMap(im=>im.pins.filter(x=>im.testPins.includes(x.n)).map(x=>x.label)).filter(l=>l!==it.pin.label&&!pool.includes(l)))]); pool=pool.concat(extra.slice(0,3-pool.length)); }
    const options = shuffle([it.pin.label, ...pool]);
    return Object.assign({mode, options, answer: options.indexOf(it.pin.label), done:false}, it);
  });
}
function identificar(m){
  const p=PARAMS;
  if (!IMAGES.some(im=>im.testPins.length>=2)){ m.innerHTML=`<div class="head"><h1>Identificar</h1></div><div class="empty">Ainda não há imagens com marcadores nesta versão.</div>`; return; }
  if (!ID && (p.img || p.station!=null && p.station!=='' || p.area || p.mode || p.start || p.q)){ const items=identItems(p); PARAMS={}; if(!items.length){ toast('Nenhuma imagem com marcadores nesse filtro'); } else ID={items, i:0, hits:0, misses:[], startedAt:now()}; }
  if (ID) return renderIdent(m);
  const keys=eligibleIdentKeys(); const att=keys.reduce((a,k)=>a+S.ident[k].n,0), cor=keys.reduce((a,k)=>a+S.ident[k].c,0);
  const total = IMAGES.reduce((a,im)=>a+im.testPins.length,0);
  m.innerHTML = `
  <div class="head"><span class="eyebrow">${total} estruturas marcadas em ${IMAGES.filter(im=>im.testPins.length>=2).length} imagens</span><h1>Identificar</h1>
  <p class="lead">Dois jogos. <b>Onde está?</b> pede que você escolha um dos marcadores visíveis sobre a estrutura. Um marcador é um exemplo, não o limite de todo o tecido. <b>O que é isto?</b> mostra um marcador e quatro nomes. As imagens deste teste não têm legendas e os marcadores foram revisados. Em Resposta livre, diga o nome antes de consultar o gabarito e faça a autoavaliação.</p></div>
  <div class="grid3" style="margin-bottom:16px">
    <div class="stat card"><span class="v mono">${keys.length}<span class="muted" style="font-size:1rem">/${total}</span></span><span class="l">estruturas já testadas</span></div>
    <div class="stat card"><span class="v mono">${att?pct(cor,att)+'%':'—'}</span><span class="l">acerto acumulado</span></div>
    <div class="stat card"><span class="v mono">${keys.filter(k=>!S.ident[k].last).length}</span><span class="l">erradas na última vez</span></div>
  </div>
  <div class="panel"><span class="eyebrow">Nova rodada</span><div class="qcfg" style="margin-top:10px">
    <label class="f">Estação / tema<select id="ist"><option value="">Todas</option>${[1,2,3,4,5,6].map(s=>`<option value="${s}">Estação ${s} — ${STATION_NAMES[s]}</option>`).join('')}<option value="0">Pelve, períneo, genital e outros</option></select></label>
    <label class="f">Área<select id="iar"><option value="">Todas</option>${Object.keys(AREA_NAMES).map(a=>`<option value="${a}">${AREA_NAMES[a]}</option>`).join('')}</select></label>
    <label class="f">Modo<select id="imd"><option value="misto">Misto</option><option value="onde">Onde está? (escolher marcador)</option><option value="oque">O que é isto? (alternativas)</option><option value="livre">Resposta livre (autoavaliação)</option></select></label>
    <label class="f">Quantidade<select id="inn"><option>10</option><option selected>15</option><option>25</option><option>40</option></select></label>
    <button class="btn primary" id="igo">Começar</button></div></div>
  <p class="small muted">Correção de 08/09: o clique livre foi substituído por marcadores para evitar falsos erros em tecidos extensos. O histórico anterior foi preservado e pode conter esses falsos erros.</p><p class="small muted" style="margin-top:12px">Atalhos: <span class="kbd">1</span>–<span class="kbd">4</span> escolher · <span class="kbd">Enter</span> próxima</p>`;
  m.querySelector('#igo').onclick=()=>{ const cfg={station:m.querySelector('#ist').value===''?null:m.querySelector('#ist').value, area:m.querySelector('#iar').value||null, mode:m.querySelector('#imd').value, n:+m.querySelector('#inn').value}; const items=identItems(cfg); if(!items.length) return toast('Nenhuma imagem com marcadores nesse filtro'); ID={items,i:0,hits:0,misses:[],startedAt:now()}; render(); };
}
function renderIdent(m){
  if (ID.i>=ID.items.length){
    const n=ID.items.length;
    m.innerHTML=`<div class="head"><span class="eyebrow">Rodada concluída</span><h1>${ID.hits} de ${n}</h1><p class="lead">${ID.hits===n?'Todas certas. Agora tente nomear as estruturas em Resposta livre, antes de consultar o gabarito.':'Reveja as erradas abaixo: abra a imagem e localize a estrutura com a legenda visível.'}</p></div>
    <div class="row" style="margin-bottom:16px"><button class="btn primary" id="iagain">Nova rodada</button>${ID.misses.length?`<button class="btn" id="iredo">Refazer só as ${ID.misses.length} erradas</button>`:''}</div>
    ${ID.misses.length?`<div class="miss">${ID.misses.map(it=>`<div class="it row" style="justify-content:space-between"><span><b>${h(it.pin.label)}</b> <span class="muted">· ${h(it.img.title)}</span></span><button class="btn sm" data-open="${it.img.id}">Ver imagem</button></div>`).join('')}</div>`:''}`;
    m.querySelector('#iagain').onclick=()=>{ID=null;render();};
    const r=m.querySelector('#iredo'); if(r) r.onclick=()=>{ ID={items:ID.misses.map(resetIdentItem), i:0, hits:0, misses:[], startedAt:now()}; render(); };
    return;
  }
  const it=ID.items[ID.i], im=it.img, pin=it.pin;
  const pinsHtml = it.mode==='onde'
    ? im.pins.filter(p=>im.testPins.includes(p.n)).map(p=>`<button type="button" class="pin select-pin ${it.done&&p.label===pin.label?'ok':it.done&&p.n===it.chosenPin?'incorrect':''}" style="left:${p.x}%;top:${p.y}%" data-pin="${p.n}" aria-label="Marcador ${p.n}" ${it.done?'disabled':''}>${p.n}</button>`).join('')
    : `<span class="pin ${it.done?(it.hit?'ok hit':'hit'):'q'}" style="left:${pin.x}%;top:${pin.y}%">${it.done?pin.n:'?'}</span>`;
  m.innerHTML = `<div class="ident">
  <div class="qhead"><span class="chip ${im.area}">${h(AREA_NAMES[im.area]||im.area)}</span>${im.station?`<span class="chip neutral">Estação ${im.station}</span>`:''}<span class="chip neutral">${it.mode==='onde'?'Onde está?':it.mode==='livre'?'Resposta livre · autoavaliação':'O que é isto?'}</span><div class="prog"><div class="meter"><i style="width:${pct(ID.i,ID.items.length)}%"></i></div></div><span class="mono small">${ID.i+1} / ${ID.items.length}</span><button class="btn ghost sm" id="iquit">Encerrar</button></div>
  <span class="eyebrow">Imagem de estudo · ${h(AREA_NAMES[im.area]||im.area)}${im.area==='radiologia'?' · convenção radiológica':''}</span>
  ${it.mode==='onde'?`<p class="target">Qual marcador está sobre: <b>${h(pin.label)}</b>?</p>`:`<p class="target">Que estrutura está no marcador?</p>`}
  ${it.mode==='onde'?`<p class="small muted">Escolha um número na imagem ou nos botões abaixo. A estrutura pode ocupar outras regiões; só os marcadores são alternativas deste exercício.</p>`:''}
  <div class="pinbox ${it.done?'done':''}" id="pb"><img src="${im.src}" alt="Imagem anatômica do exercício de identificação" draggable="false">${pinsHtml}</div>
  ${it.mode==='onde'?`<div class="row marker-choices" aria-label="Escolher marcador">${im.pins.filter(p=>im.testPins.includes(p.n)).map(p=>`<button type="button" class="btn" data-pin="${p.n}" ${it.done?'disabled':''}>Marcador ${p.n}</button>`).join('')}</div>`:''}
  ${it.mode==='livre'&&!it.done?`<div class="panel"><label class="f">Sua resposta<input id="ifree" type="text" value="${h(it.freeText||'')}"></label>${it.revealed?`<p>Resposta: <b>${h(pin.label)}</b></p><div class="row"><button class="btn" data-self="0">Preciso revisar</button><button class="btn" data-self="1">Acertei sem ajuda</button></div>`:'<button class="btn primary" id="ifreecheck">Conferir resposta</button>'}</div>`:''}
  ${it.mode==='oque'?`<div class="opts" style="margin-top:14px">${it.options.map((o,i)=>{let c='opt'; if(it.done){ if(i===it.answer) c+=' right'; else if(i===it.chosen) c+=' wrong'; } return `<button class="${c}" data-o="${i}" ${it.done?'disabled':''}><span class="L">${'ABCD'[i]}</span><span>${h(o)}</span></button>`;}).join('')}</div>`:''}
  ${it.done&&it.mode==='onde'&&it.click?`<p class="panel small">Resultado do corretor antigo por proximidade: um clique fora do ponto podia estar na mesma estrutura. Este registro não permite concluir que você errou o tecido. Refaça a questão com os marcadores.</p>`:''}
  ${it.done?`<div class="fb ${it.hit?'ok':'bad'}">${it.mode==='livre'?(it.hit?'Você marcou: acertei sem ajuda.':'Você marcou: preciso revisar.'):(it.hit?'Certo.':'Errado.')} ${it.mode==='onde'?`O marcador ${pin.n} mostra um exemplo de <b>${h(pin.label)}</b>. ${h(identLocationNote(it))}`:`É <b>${h(pin.label)}</b>.`}${im.caption?` <span class="muted">${h(im.caption.split('. ')[0])}.</span>`:''}</div>
  <div class="row" style="margin-top:14px;justify-content:space-between"><button class="btn ghost sm" data-open="${im.id}">Abrir no atlas</button><button class="btn primary" id="inext">${ID.i===ID.items.length-1?'Finalizar':'Próxima'}</button></div>`:''}
  </div>`;
  m.querySelector('#iquit').onclick=()=>{ID=null;render();};
  const nx=m.querySelector('#inext'); if(nx) nx.onclick=identNext;
  if(!it.done&&it.mode==='livre'){const input=m.querySelector('#ifree');input.oninput=()=>{it.freeText=input.value;persistActive();};const check=m.querySelector('#ifreecheck');if(check)check.onclick=()=>{it.freeText=input.value;it.revealed=true;render();};m.querySelectorAll('[data-self]').forEach(b=>b.onclick=()=>{it.selfAssessed=true;identAnswer(b.dataset.self==='1');});}
  if (!it.done && it.mode==='onde') m.querySelectorAll('[data-pin]').forEach(b=>b.onclick=()=>identChoosePin(+b.dataset.pin));
  if (!it.done && it.mode==='oque') m.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{ it.chosen=+b.dataset.o; identAnswer(it.chosen===it.answer); });
}
function identLocationNote(it){
  const notes={
    'h14|3':'O septo é uma faixa de tecido conjuntivo entre lóbulos; outros trechos da mesma faixa também pertencem ao septo.',
    'h14|2':'Há muitos ácinos no campo. O marcador indica apenas um exemplo do tecido exócrino.',
    'h20|2':'As pregas da mucosa se ramificam para o lúmen em vários pontos. Os espaços claros entre elas são o lúmen, não a prega.',
    'h20|3':'A túnica muscular envolve a mucosa. Ela também aparece na parede do lado oposto; não existe só no ponto marcado.',
    's2_perineo-p008|1':'O levantador do ânus é bilateral. O músculo do lado oposto também faz parte do assoalho pélvico; o marcador indica um dos lados.'
  };
  return notes[identKey(it)]||'O marcador localiza um exemplo e não delimita toda a extensão da estrutura.';
}
function identChoosePin(n){
  const it=ID?.items[ID.i];
  if(!it||it.done||it.mode!=='onde'||!it.img.testPins.includes(n))return;
  const selected=it.img.pins.find(p=>p.n===n);
  if(!selected)return;
  it.chosenPin=n;
  identAnswer(selected.label===it.pin.label);
}
function identAnswer(hit, click){
  const it=ID.items[ID.i]; if(it.done)return; it.done=true; it.hit=hit; it.click=click||null;
  const k=identKey(it)+(it.mode==='livre'?'|self':''); const s=S.ident[k]||{n:0,c:0};s.selfAssessed=it.mode==='livre'; s.n++; if(hit) s.c++; s.last=hit; s.at=now(); S.ident[k]=s; save();
  if (hit) ID.hits++; else ID.misses.push(it);
  render();
}
function identNext(){ ID.i++; render(); }

/* ============================================================
   SOBRE
   ============================================================ */
function sobre(m){
  const decks={}; IMAGES.filter(im=>im.deckTitle).forEach(im=>{decks[im.deckTitle]=(decks[im.deckTitle]||0)+1;});
  const commons=IMAGES.filter(im=>im.sourceUrl);
  m.innerHTML=`
  <div class="head"><span class="eyebrow">Para a turma</span><h1>Sobre este site</h1>
  <p class="lead">Feito a partir das anotações de aula de Forma a Função II (FSL, 2026.2) para estudar para a prova de 9 de setembro. Pode usar à vontade e compartilhar com quem for da turma.</p></div>
  <div class="grid2">
    <div class="card"><h3>Seu progresso é só seu</h3><p class="small" style="margin-top:6px">Cada pessoa tem o próprio progresso, salvo apenas no navegador em que abriu o site. Ninguém vê o seu e você não vê o dos outros. Para usar em outro aparelho (celular e computador, por exemplo), copie o backup em <b>Progresso</b> e cole no outro. Se limpar os dados do navegador, o progresso some.</p></div>
    <div class="card"><h3>De onde vem o conteúdo</h3><p class="small" style="margin-top:6px">Guias, questões, flashcards e discursivas foram gerados a partir das anotações das aulas (semanas 1 a 5), das APS e do roteiro da prova prática, e receberam revisão pontual. As fontes aparecem nos guias. Isso não equivale a validar integralmente todos os gabaritos. Convenções específicas da aula são identificadas, e divergências com referências devem ser conferidas.</p></div>
    <div class="card"><h3>Imagens</h3><p class="small" style="margin-top:6px">${Object.keys(decks).length?`<b>${IMAGES.length-commons.length}</b> imagens vêm dos slides e fotos das aulas (uso interno da turma; não republique fora dela). `:''}${commons.length?`<b>${commons.length}</b> vêm do Wikimedia Commons com licença aberta (domínio público, CC0, CC BY ou CC BY-SA), com autor e licença indicados em cada imagem.`:''}</p></div>
    <div class="card"><h3>Como estudar com ele</h3><p class="small" style="margin-top:6px">Comece pelo simulado-diagnóstico, revise os flashcards vencidos todo dia e use o modo Identificar para treinar o reconhecimento visual. Em <b>Aprender</b>, observe as seis estações, esconda as pistas e explique. Em <b>Hoje</b>, escolha blocos de 15, 30 ou 60 minutos.</p></div>
  </div>
  ${Object.keys(decks).length?`<h3 style="margin:24px 0 8px">Apresentações usadas</h3><ul class="tight small">${Object.keys(decks).sort().map(d=>`<li>${h(d)} <span class="muted">· ${decks[d]} imagens</span></li>`).join('')}</ul>`:''}
  ${commons.length?`<h3 style="margin:24px 0 8px">Créditos do Wikimedia Commons</h3><div class="tbl"><table><tr><th>Imagem</th><th>Autor</th><th>Licença</th></tr>${commons.map(im=>`<tr><td><a href="${h(im.sourceUrl)}" target="_blank" rel="noopener">${h(im.title)}</a></td><td>${h(im.author||'')}</td><td>${h(im.license||'')}</td></tr>`).join('')}</table></div>`:''}`;
}

/* ============================================================
   Delegação global
   ============================================================ */
document.getElementById('main').addEventListener('click', e => {
  const s = e.target.closest('[data-start]'); if (s){ startQuiz(JSON.parse(s.dataset.start)); return; }
  const a = e.target.closest('[data-act]'); if (a){ e.preventDefault(); const act=JSON.parse(a.dataset.act); const v=act.v; delete act.v; go(v, act); return; }
  const o = e.target.closest('[data-open]'); if (o){ openLB(o.dataset.open); return; }
  const g = e.target.closest('[data-go]'); if (g){ const d=g.dataset; const p={}; if(d.preset) p.preset=d.preset; if(d.topic) p.topic=d.topic; if(d.prof) p.prof=d.prof; if(d.so) p.so=d.so; if(d.tab) p.tab=d.tab; if(d.area) p.area=d.area; if(d.station!=null) p.station=d.station; if(d.img) p.img=d.img; if(d.mode) p.mode=d.mode; if(d.q)p.q=d.q;if(d.essential)p.essential=true;go(d.go,p); return; }
});
document.getElementById('main').addEventListener('change', e => {
  const c = e.target.closest('input[data-task]'); if (c){ S.plan[c.dataset.task]=c.checked; save(); c.closest('.checkrow').classList.toggle('done', c.checked); if(c.checked) toast('Feito'); }
});
document.addEventListener('keydown', e => {
  if (e.key==='Escape' && LB){ closeLB(); return; }
  if(LB)return; if (e.target.matches('input,textarea,select')) return;
  if (VIEW==='identificar' && ID && ID.i < ID.items.length){
    const it=ID.items[ID.i];
    if (!it.done && it.mode==='onde' && /^[1-9]$/.test(e.key)){ identChoosePin(+e.key); e.preventDefault(); return; }
    if (!it.done && it.mode==='oque' && '1234'.includes(e.key)){ it.chosen=+e.key-1; identAnswer(it.chosen===it.answer); e.preventDefault(); return; }
    if (it.done && e.key==='Enter'){ identNext(); return; }
  }
  if (VIEW==='simulado' && Q && !Q.finished){
    if ('1234'.includes(e.key)) { answer(+e.key-1); e.preventDefault(); }
    if (e.key==='Enter'){ const q=Q.list[Q.i]; if (Q.ans[q.id]!=null || Q.mode==='prova') next(); }
  }
  if (VIEW==='cartoes' && F && F.i < F.deck.length){
    if (e.key===' ' || e.code==='Space' || e.key==='Spacebar' || String(e.key).toLowerCase()==='space'){ e.preventDefault(); if(!F.show){F.show=true;render();} }
    if (F.show && '1234'.includes(e.key)) gradeAndNext(+e.key-1);
  }
});
function sessionId(){return Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);}
function localDay(at){const d=new Date(at);return [d.getFullYear(),d.getMonth()+1,d.getDate()].join('-');}
function practiceGrade(r){return typeof r==='number'?r:r?.grade;}
function practiceSecure(history){
 const last=history.at(-1),previous=history.at(-2);
 return !!(last&&previous&&typeof last==='object'&&typeof previous==='object'&&last.grade===3&&previous.grade===3&&last.session!==previous.session&&last.at-previous.at>=DAY);
}
function recordPractice(key,grade){
 S.settings.practiceSession ||= sessionId();const sid=S.settings.practiceSession,r=S.prat[key]||[];
 const entry={grade,at:now(),session:sid};if(r.at(-1)?.session===sid)r[r.length-1]=entry;else r.push(entry);
 S.prat[key]=r.slice(-12);save();
}
function questionImage(q,reveal=false){
 if(!q.image)return '';const im=IMG_BY[q.image.id],pin=im?.pins.find(x=>x.n===q.image.pin);
 if(!im||!pin||im.hasLabels||!im.testPins.includes(pin.n))return '<p class="panel">Imagem indisponível para avaliação.</p>';
 return `<figure class="quiz-figure"><div class="pinbox"><img src="${im.src}" alt="Imagem da questão; o marcador indica a estrutura a identificar" width="${im.w}" height="${im.h}"><span class="pin q" style="left:${pin.x}%;top:${pin.y}%">?</span></div><figcaption class="small muted">${reveal?`<b>${h(pin.label)}</b> · ${h(im.source||'Material de aula')}${im.sourceUrl?` · <a href="${h(im.sourceUrl)}" target="_blank" rel="noopener">Fonte</a>`:''}`:'Imagem de estudo · fonte completa após a correção'}${im.author?' · '+h(im.author):''}${im.license?' · '+h(im.license):''}</figcaption></figure>`;
}
function persistActive(){
 S.active={view:VIEW,params:PARAMS,
 quiz:Q?{...Q,list:Q.list.map(q=>q.id),perms:Object.fromEntries(Q.list.filter(q=>q.perm).map(q=>[q.id,q.perm]))}:null,
 cards:F?{...F,deck:F.deck.map(c=>c.id),again:F.again.map(c=>c.id)}:null,
 ident:ID?{...ID,items:ID.items.map(packIdent),misses:ID.misses.map(packIdent)}:null};save();
}
function packIdent(it){const {img,pin,...rest}=it;return {...rest,imgId:img.id,pinNo:pin.n};}
function unpackIdent(it){const img=IMG_BY[it.imgId],pin=img?.pins.find(p=>p.n===it.pinNo);if(!img||!pin||!img.testPins.includes(pin.n)||img.hasLabels)return null;return {...it,img,pin};}
function restoreActive(restoreView=true){
 const a=S.active||{};
 try{if(a.quiz&&Array.isArray(a.quiz.list)){const perms=a.quiz.perms||{};const list=a.quiz.list.map(id=>{const q=MCQ.find(x=>x.id===id);return q?withPerm(q,perms[id]):null;});if(list.length&&list.every(Boolean)&&Number.isInteger(a.quiz.i)&&a.quiz.i>=0&&a.quiz.i<list.length){const {perms:_p,...rest}=a.quiz;Q={...rest,list};}}
 if(a.cards&&Array.isArray(a.cards.deck)){const deck=a.cards.deck.map(id=>CARDS.find(c=>c.id===id)).filter(Boolean);if(deck.length)F={...a.cards,deck,i:Math.max(0,Math.min(a.cards.i||0,deck.length)),again:(a.cards.again||[]).map(id=>CARDS.find(c=>c.id===id)).filter(Boolean)};}
 if(a.ident&&Array.isArray(a.ident.items)){const items=a.ident.items.map(unpackIdent);if(items.length&&items.every(Boolean))ID={...a.ident,items,i:Math.max(0,Math.min(a.ident.i||0,items.length)),misses:(a.ident.misses||[]).map(unpackIdent).filter(Boolean)};}
 if(restoreView&&VIEWS.some(v=>v.id===a.view)){VIEW=a.view;PARAMS=a.params||{};}
 }catch(e){Q=null;F=null;ID=null;}
}

function lessonProgress(st){const x=S.learning?.[st.n]?.answers||{};return {done:Object.keys(x).length,review:Object.values(x).filter(a=>a.grade<2).length};}
function todayStation(){return LEARNING.stations.slice().sort((a,b)=>{const pa=lessonProgress(a),pb=lessonProgress(b);return (pa.review?-1:pa.done>=3?2:0)-(pb.review?-1:pb.done>=3?2:0)||pa.done-pb.done;})[0];}
function hoje(m){
 const next=todayStation(),due=dueCards().length,minutes=S.settings.minutes||30;
 const covered=LEARNING.stations.filter(s=>lessonProgress(s).done===s.questions.length).length;
 const days=Math.max(0,Math.ceil((EXAM_DATE-new Date().setHours(0,0,0,0))/DAY));
 const currentDate=localDay(now()),todayTasks=S.settings.daily?.date===currentDate?S.settings.daily.tasks:[];
 m.innerHTML=`<div class="learning-home"><a class="quick-review-banner" href="histo-embrio.html"><span><b>Histo + Embrio · revisão rápida</b><br>Imagens, raciocínio e perguntas curtas para a véspera</span><span aria-hidden="true">↗</span></a>
 <div class="learning-hero"><div class="learning-intro"><span class="learning-kicker">SEU ATLAS DE REVISÃO · 09/09 ÀS 14H20 · 13 TESTES + 7 DISCURSIVAS</span><h1>Veja a estrutura.<br><em>Construa a memória.</em></h1><p>Uma estação de cada vez: observe a anatomia, feche as pistas e explique o que acabou de aprender.</p><div class="learning-actions"><button class="btn primary" data-go="aprender" data-station="${next.n}">Continuar pela estação ${next.n} <span aria-hidden="true">↗</span></button><button class="btn" data-go="identificar">Treinar com imagens</button></div><div class="hero-facts"><span><b>${days}</b> ${days===1?'dia':'dias'} até a prova</span><span><b>${covered}/6</b> estações praticadas</span><span><b>${due}</b> cartões vencidos</span></div></div><button class="hero-image" data-go="aprender" data-station="5" aria-label="Aprender fígado e vias biliares"><img src="${IMG_BY['pptx_pf-image11'].src}" alt="Fígado e suas relações peritoneais" width="650" height="650"><span>Fígado e vias biliares <b aria-hidden="true">↗</b></span></button></div>
 <section class="focus-panel"><div><span class="learning-kicker">SEU PRÓXIMO BLOCO</span><h2>${minutes} minutos para avançar</h2><p>Selecione o tempo disponível. Os itens marcados aqui são tarefas feitas, não domínio comprovado.</p></div><div class="row" role="group" aria-label="Tempo de estudo">${[15,30,60].map(n=>`<button class="btn ${n===minutes?'primary':''}" data-minutes="${n}" aria-pressed="${n===minutes}">${n} min</button>`).join('')}</div><div class="daily-tasks">${dailyBlocks(minutes,next).map((t,i)=>`<div class="daily-task"><label><input type="checkbox" data-daily="${minutes}-${i}" ${todayTasks.includes(minutes+'-'+i)?'checked':''}> <span><b>${t.min} min</b> ${h(t.text)}</span></label><button class="btn sm" data-go="${t.view}" ${t.station?`data-station="${t.station}"`:''} ${t.extra||''}>Abrir</button></div>`).join('')}</div></section>
 <div class="section-heading"><div><span class="learning-kicker">ANATOMIA EM SEIS ESTAÇÕES</span><h2>Um mapa para a sua revisão</h2></div><p>Do roteiro da prática. A ordem real da prova pode ser diferente.</p></div>
 <div class="station-grid">${LEARNING.stations.map(st=>{const p=lessonProgress(st);return `<button class="station-card" style="--station-color:${st.color}" data-go="aprender" data-station="${st.n}"><div class="station-image"><img src="${IMG_BY[st.image].src}" alt="" loading="lazy"><span class="station-number">0${st.n}</span></div><div class="station-card-body"><span class="station-time">${st.time} min de revisão guiada</span><h3 class="station-title">${h(st.title)}</h3><p class="station-desc">${h(st.subtitle)}</p><div class="station-foot"><span>${p.done}/3 respostas praticadas${p.review?' · '+p.review+' para rever':''}</span><b aria-hidden="true">↗</b></div><div class="meter"><i style="width:${pct(p.done,3)}%"></i></div></div></button>`;}).join('')}</div>
 <section class="learning-path"><div><span>01 · OBSERVAR</span><h3>Encontre os marcos</h3><p>Use a imagem grande e as relações que diferenciam estruturas vizinhas.</p></div><div><span>02 · RECUPERAR</span><h3>Responda sem pistas</h3><p>Esconda a imagem e explique com suas palavras. Consulte só depois.</p></div><div><span>03 · REVISITAR</span><h3>Volte ao que faltou</h3><p>Revise os erros e reteste em outro dia. Um acerto isolado não encerra a revisão.</p></div></section>
 <section class="review-tools"><h2>Complete a preparação</h2><div class="quick"><button data-go="simulado" data-preset="prova"><b>13 testes · treino de 30 min</b><span>13 testes · inclui imagens para treino</span></button><button data-go="cartoes" data-essential="true"><b>Cartões essenciais</b><span>Roteiro prático + conceitos de cada tópico</span></button><button data-go="discursivas" data-preset="prova"><b>Escreva e compare</b><span>7 discursivas · resposta-modelo após tentar</span></button><button data-go="guias"><b>Histologia, embriologia e imagem</b><span>Todo o acervo das semanas 1–5</span></button></div></section></div>`;
 m.querySelectorAll('[data-minutes]').forEach(b=>b.onclick=()=>{S.settings.minutes=+b.dataset.minutes;save();render();});
 m.querySelectorAll('[data-daily]').forEach(c=>c.onchange=()=>{if(S.settings.daily?.date!==currentDate)S.settings.daily={date:currentDate,tasks:[]};const t=S.settings.daily.tasks;if(c.checked&&!t.includes(c.dataset.daily))t.push(c.dataset.daily);if(!c.checked)S.settings.daily.tasks=t.filter(x=>x!==c.dataset.daily);save();});
}
function dailyBlocks(minutes,st){
 if(minutes===15)return [{min:8,text:'Observar e responder na estação '+st.n,view:'aprender',station:st.n},{min:4,text:'Localizar estruturas em imagens sem legenda',view:'identificar'},{min:3,text:'Rever cartões vencidos',view:'cartoes',extra:'data-so="vencidos"'}];
 if(minutes===30)return [{min:15,text:'Completar a estação '+st.n+' sem pistas',view:'aprender',station:st.n},{min:10,text:'Responder questões e corrigir os erros',view:'simulado'},{min:5,text:'Retomar os cartões essenciais',view:'cartoes',extra:'data-essential="true"'}];
 return [{min:20,text:'Estudar a estação '+st.n+' e uma estação vizinha',view:'aprender',station:st.n},{min:30,text:'Fazer um simulado cronometrado',view:'simulado',extra:'data-preset="prova"'},{min:10,text:'Revisar o que errou e explicar uma discursiva',view:'discursivas',extra:'data-prof="Hojaij"'}];
}
function learnState(st){S.learning ||= {};return S.learning[st.n] ||= {phase:'observe',i:0,draft:'',answers:{},attempt:sessionId()};}
function aprender(m){
 const st=LEARNING.stations.find(s=>s.n===+PARAMS.station)||todayStation(),l=learnState(st),im=IMG_BY[l.image||st.image]||IMG_BY[st.image];
 const observe=l.phase==='observe',i=Math.min(l.i||0,st.questions.length-1),q=st.questions[i],pg=lessonProgress(st);
 m.innerHTML=`<div class="visual-lesson" style="--station-color:${st.color}"><div class="lesson-top"><button class="btn ghost sm" data-go="hoje">← Todas as estações</button><span class="chip neutral">Estação 0${st.n} · ${st.time} min</span></div><div class="head"><span class="learning-kicker">${observe?'01 · OBSERVAR E RELACIONAR':l.phase==='answer'?'03 · COMPARAR E CORRIGIR':'02 · RECUPERAR DA MEMÓRIA'}</span><h1>${h(st.title)}</h1><p class="lead">${observe?h(st.subtitle):'A imagem e o mapa estão escondidos. Responda antes de consultar.'}</p></div>
 <div class="lesson-steps"><span class="${observe?'active':''}">1 Observar</span><span class="${l.phase==='recall'?'active':''}">2 Responder</span><span class="${l.phase==='answer'?'active':''}">3 Comparar</span><span class="mono">${pg.done}/3 praticadas</span></div>
 ${observe?`<div class="lesson-layout"><div><figure class="lesson-image"><button data-open="${im.id}" aria-label="Ampliar ${h(im.title)}"><img src="${im.src}" alt="${h(im.title)}" width="${im.w}" height="${im.h}"></button><figcaption>${h(im.title)} · <button class="btn ghost sm" data-open="${im.id}">Ampliar e ver créditos</button></figcaption></figure>${st.secondary&&IMG_BY[st.secondary]?`<div class="row"><button class="btn sm" data-lesson-image="${st.image}">Vista principal</button><button class="btn sm" data-lesson-image="${st.secondary}">Outra vista / relação</button></div>`:''}</div><aside class="lesson-notes"><span class="learning-kicker">MARCOS PARA LOCALIZAR NO ATLAS</span><ul class="landmark-list">${st.landmarks.map(x=>`<li>${h(x)}</li>`).join('')}</ul><h3>Três relações para guardar</h3><ol class="relation-list">${st.relations.map(x=>`<li>${h(x)}</li>`).join('')}</ol><div class="trap-card"><b>Não confunda</b><p>${h(st.trap)}</p></div><button class="btn primary wide" id="learnrecall">Esconder a imagem e responder →</button></aside></div><div class="learning-map"><div class="section-heading"><div><span class="learning-kicker">MAPA DE RELAÇÕES</span><h2>Reconstrua este caminho</h2></div><span class="small muted">Esquema didático · sem escala anatômica</span></div>${lessonDiagram(st)}</div>`:
 `<div class="recall-layout"><div class="recall-card"><span class="learning-kicker">PERGUNTA ${i+1} DE ${st.questions.length}</span><h2>${h(q[0])}</h2><label class="f">Sua resposta<textarea id="learndraft" placeholder="Nome → localização → relação → função, quando solicitada">${h(l.draft||'')}</textarea></label><p class="small muted">Pode responder em voz alta ou no papel. Revele o modelo depois de formular a resposta.</p>${l.phase==='answer'?`<div class="model-answer"><span class="learning-kicker">RESPOSTA DE REFERÊNCIA</span><p>${h(q[1])}</p></div><p class="small">Compare os pontos que você recuperou sem ajuda.</p><div class="learn-grades"><button data-learn-grade="0">Não lembrei<span>Revisar agora</span></button><button data-learn-grade="1">Parcial / com pista<span>Retestar depois</span></button><button data-learn-grade="2">Expliquei sem ajuda<span>Rever em outro dia</span></button></div>`:'<button class="btn primary" id="learncheck">Conferir minha resposta</button>'}<button class="btn ghost" id="learnpeek">Consultar a imagem novamente</button></div><aside class="recall-aside"><div class="memory-symbol" aria-hidden="true">${String(st.n).padStart(2,'0')}</div><h3>Recupere, depois confira.</h3><p>Mesmo uma tentativa incompleta ajuda a revelar o que precisa de revisão.</p><p class="small muted">Se consultar a imagem, registre “Parcial / com pista”. Este treino é autoavaliado e não entra no acerto automático.</p></aside></div>`}
 <div class="lesson-footer"><button class="btn" data-go="guias" data-topic="${st.topic}">Guia completo desta estação</button><button class="btn" data-go="atlas" data-station="${st.n}">Atlas da estação</button>${IMAGES.some(im=>im.station===st.n&&im.testPins.length>=2)?`<button class="btn" data-go="identificar" data-station="${st.n}">Teste visual sem legenda</button>`:''}<button class="btn ghost" data-go="aprender" data-station="${st.n===6?1:st.n+1}">Próxima estação →</button></div><p class="small muted">Base: roteiro de estruturas prováveis da prática e anotações das aulas. As seis estações organizam o treino; não garantem a cobrança da prova.</p></div>`;
 m.querySelectorAll('[data-lesson-image]').forEach(b=>b.onclick=()=>{l.image=b.dataset.lessonImage;render();});
 const rc=m.querySelector('#learnrecall');if(rc)rc.onclick=()=>{l.phase='recall';render();window.scrollTo({top:0});};
 const dr=m.querySelector('#learndraft');if(dr)dr.oninput=()=>{l.draft=dr.value;save();};
 const ck=m.querySelector('#learncheck');if(ck)ck.onclick=()=>{l.phase='answer';render();};
 const peek=m.querySelector('#learnpeek');if(peek)peek.onclick=()=>{l.assisted=true;l.phase='observe';render();};
 m.querySelectorAll('[data-learn-grade]').forEach(b=>b.onclick=()=>{const grade=l.assisted?Math.min(1,+b.dataset.learnGrade):+b.dataset.learnGrade;l.answers[i]={grade,at:now(),draft:l.draft};l.i=(i+1)%3;l.draft='';l.phase=i===2?'observe':'recall';l.assisted=false;save();render();toast(i===2?'Rodada registrada. Reteste em outro dia.':'Resposta registrada');window.scrollTo({top:0});});
}
function lessonDiagram(st){
 if(st.diagram==='hiatos')return `<div class="hiatos-map">${[['T8','Veia cava inferior','Centro tendíneo','8'],['T10','Esôfago + troncos vagais','Parte muscular · pilar direito','10'],['T12','Aorta + ducto torácico','Posterior ao diafragma','12']].map(([level,name,rel,num])=>`<div class="hiato"><span class="vertebra">${level}</span><div><h3>${name}</h3><p>${rel}</p></div><span class="hiato-num" aria-hidden="true">${num}</span></div>`).join('')}</div><p class="map-note">8 — cava · 10 — esôfago · 12 — aorta</p>`;
 if(st.diagram==='bile')return `<div class="bile-map"><div class="bile-row"><div>Ducto hepático direito</div><span>+</span><div>Ducto hepático esquerdo</div></div><span class="map-arrow">↓</span><div class="bile-row"><div>Ducto hepático comum</div><span>+</span><div>Ducto cístico <small>↔ vesícula biliar</small></div></div><span class="map-arrow">↓</span><div class="bile-row"><div class="bile-main">Ducto colédoco</div><span>+</span><div>Ducto pancreático principal</div></div><span class="map-arrow">↓</span><div class="bile-result">Ampola hepatopancreática → papila duodenal maior <small>2ª parte do duodeno · configuração habitual</small></div></div>`;
 return `<div class="anatomy-flow">${(st.flow||[]).map(row=>`<div class="flow-row">${row.map((x,i)=>`${i?'<span class="flow-arrow" aria-hidden="true">→</span>':''}<div class="flow-node">${h(x)}</div>`).join('')}</div>`).join('')}</div>`;
}

restoreActive();
render();
