'use strict';
const QUICK_KEY='prancha-histo-embrio-v1';
const BY_QUICK=Object.fromEntries(QUICK.cards.map(c=>[c.id,c]));
const escapeQuick=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const eq=escapeQuick;
function quickDeck(track,core,history){return QUICK.cards.filter(c=>track==='errors'?(history[c.id]&&(!history[c.id].correct||history[c.id].assisted)):(c.track===track&&(!core||c.core))).map(c=>c.id);}
function quickSession(track='histo',core=true,history={}){return {track,core,ids:quickDeck(track,core,history),index:0,phase:'learn',answers:{},assisted:false,helped:{}};}
function quickNormalize(raw){
 const out={history:{},session:null};
 if(raw&&typeof raw==='object'){
  for(const [id,a] of Object.entries(raw.history||{}))if(BY_QUICK[id]&&a&&typeof a.correct==='boolean')out.history[id]={correct:a.correct,assisted:!!a.assisted,at:Number(a.at)||0};
  const s=raw.session;
  if(s&&['histo','embrio','errors'].includes(s.track)&&Array.isArray(s.ids)&&s.ids.every(id=>BY_QUICK[id])&&new Set(s.ids).size===s.ids.length&&Number.isInteger(s.index)&&s.index>=0&&s.index<=s.ids.length){
   out.session={...s,phase:s.phase==='quiz'?'quiz':'learn',answers:{},assisted:!!s.assisted,helped:Object.fromEntries(Object.entries(s.helped||{}).filter(([id,v])=>s.ids.includes(id)&&v===true))};
   for(const [id,a]of Object.entries(s.answers||{}))if(s.ids.includes(id)&&a&&Number.isInteger(a.choice)&&a.choice>=0&&a.choice<BY_QUICK[id].options.length)out.session.answers[id]={choice:a.choice,correct:a.choice===BY_QUICK[id].answer,assisted:!!a.assisted};
  }
 }
 out.session ||= quickSession('histo',true,out.history);return out;
}
function quickRecord(state,choice){const s=state.session,c=BY_QUICK[s.ids[s.index]];if(!c||s.phase!=='quiz'||s.answers[c.id]||!Number.isInteger(choice)||choice<0||choice>=c.options.length)return false;const a={choice,correct:choice===c.answer,assisted:!!s.assisted||!!s.helped?.[c.id]};s.answers[c.id]=a;state.history[c.id]={correct:a.correct,assisted:a.assisted,at:Date.now()};return true;}
let quickState=quickNormalize(null);
function quickSave(){try{localStorage.setItem(QUICK_KEY,JSON.stringify(quickState));}catch(e){const n=document.getElementById('notice');n.textContent='O navegador não permitiu salvar. Mantenha a página aberta para continuar este treino.';n.classList.add('show');}}
function quickBegin(track,core=quickState.session.core){quickState.session=quickSession(track,core,quickState.history);quickRender();}
function quickFigure(c,quiz=false){const im=QUICK.images[c.image];return `<figure class="photo">${quiz?'':`<button data-zoom="${eq(c.image)}" aria-label="Ampliar imagem de ${eq(c.title)}">`}<img src="${eq(im.src)}" alt="${quiz?'Imagem histológica do exercício':eq(im.title)}" width="${im.w}" height="${im.h}">${quiz?'':'</button>'}<figcaption>${quiz?'Imagem sem legenda · observe antes de responder':`<strong>${eq(im.title)}</strong>Toque para ampliar`}${quiz?`<div class="credits">${eq(im.author)}${im.license?' · '+eq(im.license):''}</div>`:`<div class="credits">${eq(im.source)}${im.author?' · '+eq(im.author):''}${im.license?' · '+eq(im.license):''}</div>`}</figcaption></figure>`;}
function quickDiagram(kind){const diagrams={
 pancreas:[['ÁCINOS','Enzimas → ductos → duodeno'],['ILHOTAS','Hormônios → sangue']],
 liver:[['SANGUE','Espaço porta → sinusoides → veia central'],['BILE','Hepatócitos → canalículos → espaço porta']],
 gut:[['DUODENO','Brunner → neutralizar'],['JEJUNO','Pregas e vilos → absorver'],['ÍLEO','Peyer → vigilância imune']],
 wall:[['MUCOSA','Epitélio + lâmina própria + muscular da mucosa'],['SUBMUCOSA','Vasos maiores · Meissner'],['MUSCULAR EXTERNA','Circular / Auerbach / longitudinal']],
 adrenal:[['GLOMERULOSA','Aldosterona'],['FASCICULADA','Cortisol'],['RETICULAR','Andrógenos']],
 germ:[['EPIBLASTO','Origem dos três folhetos'],['GASTRULAÇÃO','Ectoderma · mesoderma · endoderma']],
 neural:[['PLACA NEURAL','Pregas → tubo neural → SNC'],['CRISTA NEURAL','Migração → gânglios e plexos entéricos']],
 origins:[['ENDODERMA','Revestimento epitelial digestório'],['MESODERMA','Músculo liso + conjuntivo'],['CRISTA NEURAL','Neurônios entéricos']],
 sex:[['SERTOLI → AMH','Müller regride'],['LEYDIG → TESTOSTERONA','Wolff persiste']]};
 return kind?`<div class="diagram"><span class="label">MAPA DE RELAÇÕES · ESQUEMA SEM ESCALA</span>${(diagrams[kind]||[]).map(([a,b])=>`<div class="diagram-row"><div class="node"><b>${a}</b>${b}</div></div>`).join('')}</div>`:'';
}
function quickRender(){
 const s=quickState.session,c=BY_QUICK[s.ids[s.index]],errors=quickDeck('errors',false,quickState.history).length;
 document.getElementById('tracks').innerHTML=`${[['histo','Histologia'],['embrio','Embriologia'],['errors','Rever erros'+(errors?' · '+errors:'')]].map(([t,n])=>`<button class="tab ${s.track===t?'active':''}" aria-pressed="${s.track===t}" data-track="${t}">${n}</button>`).join('')}<label class="scope">Percurso<select id="scope"><option value="core" ${s.core?'selected':''}>Essencial · cerca de 15 min por área</option><option value="all" ${!s.core?'selected':''}>Todos os temas · no seu ritmo</option></select></label>`;
 document.getElementById('scope').onchange=e=>quickBegin(s.track,e.target.value==='core');
 const m=document.getElementById('study');
 document.querySelector('.toolbox').hidden=!!c&&s.phase==='quiz';
 if(!s.ids.length){m.innerHTML=`<div class="end"><span class="eyebrow">REVISÃO DOS ERROS</span><h2>Nenhum erro registrado aqui.</h2><p>Comece por uma área. Respostas erradas ou feitas com consulta aparecerão neste percurso.</p><div class="actions"><button class="button primary" data-track="histo">Começar histologia</button><button class="button" data-track="embrio">Começar embriologia</button></div></div>`;}
 else if(!c){const a=Object.values(s.answers),hits=a.filter(x=>x.correct&&!x.assisted).length;m.innerHTML=`<div class="end"><span class="eyebrow">PASSAGEM CONCLUÍDA</span><h2>Agora, volte às lacunas.</h2><div class="big">${hits}<small> / ${a.length}</small></div><p>Acertos sem reabrir as pistas, entre as perguntas respondidas.</p><p class="fine">${s.ids.length-a.length} perguntas não respondidas. Treino imediato não comprova retenção: reteste após uma pausa.</p><div class="actions"><button class="button primary" data-track="errors">Rever erros · ${errors}</button><button class="button" data-track="${s.track==='embrio'?'histo':'embrio'}">${s.track==='embrio'?'Ir para histologia':'Ir para embriologia'}</button><button class="button" data-track="${s.track}">Refazer percurso</button></div></div>`;}
 else {
  const a=s.answers[c.id];
  const head=`<div class="study-head"><span class="eyebrow">${c.track==='histo'?'HISTOLOGIA':'EMBRIOLOGIA'} · ${s.phase==='learn'?'VER → ENTENDER':'RECUPERAR SEM PISTAS'}</span><span class="count">${s.index+1} de ${s.ids.length} · ${Object.keys(s.answers).length} respondidas</span></div><div class="meter"><i style="width:${100*s.index/s.ids.length}%"></i></div>`;
  if(s.phase==='learn')m.innerHTML=head+`<h2 class="study-title">${eq(c.title)}</h2><div class="lesson"><div>${quickFigure(c)}${quickDiagram(c.diagram)}</div><div class="reason">${[['O QUE OBSERVAR',c.see],['POR QUE FAZ SENTIDO',c.why],['COMO NÃO CONFUNDIR',c.contrast]].map(([label,t])=>`<div class="reason-card"><p class="label">${label}</p><p>${eq(t)}</p></div>`).join('')}<button class="button primary" data-action="test">${a?'Voltar à correção':'Esconder pistas e testar →'}</button><p class="source">Base: ${eq(QUICK.sources[c.source].title)}${QUICK.sources[c.source].ref?` · <a href="${QUICK.sources[c.source].ref}" target="_blank" rel="noopener">Conferir referência</a>`:''}</p></div></div><div class="nav-lesson"><button class="button" data-action="prev" ${s.index===0?'disabled':''}>← Anterior</button><span class="fine">Uma pista isolada não fecha a identificação.</span><button class="button" data-action="next">${s.index===s.ids.length-1?'Concluir percurso':'Próximo conceito →'}</button></div>`;
  else m.innerHTML=head+`<div class="quiz"><span class="eyebrow">${c.testImage?'RECONHECIMENTO NA IMAGEM':'QUESTÃO DE RACIOCÍNIO'}</span><h2>${eq(c.question)}</h2>${c.testImage?quickFigure(c,true):''}<div class="options">${c.options.map((o,i)=>`<button class="option ${a?(i===c.answer?'correct':i===a.choice?'wrong':''):''}" data-choice="${i}" ${a?'disabled':''}><span class="letter">${'ABCD'[i]}</span><span>${eq(o)}${a&&i===c.answer?' ✓':''}${a&&i===a.choice&&i!==c.answer?' ✕':''}</span></button>`).join('')}</div>${a?`<div class="feedback ${a.correct?'':'wrong'}" role="status"><b>${a.correct?'Correto.':'Vamos corrigir: '+eq(c.options[c.answer])+'.'}</b><p>${eq(c.explain)}</p>${a.assisted?'<p class="fine">Você reabriu as pistas. Este item continuará em Rever erros para retestar sem consulta.</p>':''}</div>`:''}<div class="quiz-actions"><button class="button" data-action="consult">${a?'Rever a explicação':'Consultar as pistas'}</button>${a?`<button class="button primary" data-action="next">${s.index===s.ids.length-1?'Ver resultado':'Próximo conceito →'}</button>`:''}</div>${!a?'<p class="fine">Escolha uma resposta. A correção aparece depois da tentativa.</p>':''}</div>`;
 }
 document.getElementById('topic-list').innerHTML=QUICK.cards.map(t=>`<button data-topic="${t.id}"><small>${t.track==='histo'?'HISTOLOGIA':'EMBRIOLOGIA'}${quickState.history[t.id]?quickState.history[t.id].correct&&!quickState.history[t.id].assisted?' · ACERTO IMEDIATO':' · REVER':''}</small>${eq(t.title)}</button>`).join('');quickSave();
}
function quickBoot(){
 try{quickState=quickNormalize(JSON.parse(localStorage.getItem(QUICK_KEY)));}catch(e){}
 quickRender();
 document.addEventListener('click',e=>{
  const t=e.target.closest('[data-track]');if(t){quickBegin(t.dataset.track);return;}
  const jump=e.target.closest('[data-topic]');if(jump){const c=BY_QUICK[jump.dataset.topic];quickState.session=quickSession(c.track,false,quickState.history);quickState.session.index=quickState.session.ids.indexOf(c.id);quickRender();document.getElementById('study').scrollIntoView({block:'start'});return;}
  const zoom=e.target.closest('[data-zoom]');if(zoom){const im=QUICK.images[zoom.dataset.zoom];document.getElementById('zoom-content').innerHTML=`<h3>${eq(im.title)}</h3><img src="${eq(im.src)}" alt="${eq(im.title)}"><p class="credits">${eq(im.source)} · ${eq(im.author)} · ${eq(im.license)}${im.sourceUrl?` · <a href="${eq(im.sourceUrl)}" target="_blank" rel="noopener">Fonte da imagem</a>`:''}</p>`;document.getElementById('zoom').showModal();return;}
  const opt=e.target.closest('[data-choice]');if(opt){if(quickRecord(quickState,+opt.dataset.choice))quickRender();return;}
  const b=e.target.closest('[data-action]');if(!b)return;
  const s=quickState.session,id=s.ids[s.index];
  if(b.dataset.action==='test'){s.phase='quiz';document.getElementById('map').open=false;}
  if(b.dataset.action==='consult'){if(!s.answers[id]){s.assisted=true;s.helped ||= {};s.helped[id]=true;}s.phase='learn';}
  if(b.dataset.action==='next'){s.index=Math.min(s.ids.length,s.index+1);s.phase='learn';s.assisted=false;}
  if(b.dataset.action==='prev'){s.index=Math.max(0,s.index-1);s.phase='learn';s.assisted=false;}
  quickRender();document.getElementById('study').scrollIntoView({block:'start'});document.getElementById('study').focus({preventScroll:true});
 });
 document.getElementById('close-zoom').onclick=()=>document.getElementById('zoom').close();
}
if(typeof document!=='undefined')quickBoot();
