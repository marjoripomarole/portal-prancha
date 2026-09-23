import {encode} from 'next-auth/jwt';
import {neon} from '@neondatabase/serverless';
import assert from 'node:assert/strict';import fs from 'node:fs';import {randomUUID} from 'node:crypto';
const base='http://localhost:4318',run=randomUUID().slice(0,8),users=['a','b','c','d','race','rate','past','unknown'].map(()=> 'device:'+randomUUID());
const codes=Object.fromEntries([...fs.readFileSync('../_/Portal Prancha/Códigos por turma - 2026.2.md','utf8').matchAll(/`(FSL-(T[12][AB])-2026S2-[A-F0-9]{16})`/g)].map(m=>[m[2],m[1]]));
assert.equal(Object.keys(codes).length,4);
const code=codes.T2A;
const legacyCode=fs.readFileSync('../_/Portal Prancha/Acesso - Portal Prancha.md','utf8').match(/TURMA-[A-F0-9]+/)[0];
if(!process.env.AUTH_SECRET||!process.env.DATABASE_URL)throw Error('Use the isolated .env.test.local environment');
const tokens=new Map(await Promise.all(users.map(async uid=>[uid,await encode({token:{uid,name:'Aluno de teste',email:uid+'@example.test'},secret:process.env.AUTH_SECRET,salt:'prancha-session',maxAge:600})])));
const headers=user=>user?{cookie:'prancha-session='+tokens.get(user)}:{};
const sql=neon(process.env.DATABASE_URL);
try {
async function get(path,user){const r=await fetch(base+path,{headers:headers(user)});return {status:r.status,body:await r.text()};}
async function post(data,user,origin=base){const r=await fetch(base+'/api/study',{method:'POST',headers:{...headers(user),'content-type':'application/json',origin},body:JSON.stringify(data)});return {status:r.status,data:await r.json()};}
assert.equal((await get('/api/study?action=catalog')).status,401);assert.equal((await get('/media/fsl_992ed811a0ed0fa98c.svg')).status,403);assert.equal((await get('/cadernos/genetica/data.js')).status,403);
assert.equal((await get('/api/study?action=catalog',users[0])).status,403);assert.equal((await post({action:'join',code:'INVALID'},users[0])).status,403);
// A pre-existing account must choose a cohort; its original join timestamp survives.
const oldJoined=1600000000000;
await sql.query('INSERT INTO members(user_id,joined_at) VALUES($1,$2)',[users[0],oldJoined]);
assert.equal((await get('/api/study?action=catalog',users[0])).status,403);
assert.equal((await post({action:'join',code:legacyCode},users[0])).status,403);
assert.equal((await post({action:'join',code:'FSL-T3A-2027S1-UNAVAILABLE'},users[2])).status,403);
const preview=await post({action:'preview-invite',code:'  '+code.toLowerCase()+'  '},users[0]);
assert.equal(preview.status,200);assert.equal(preview.data.cohort.id,'t2a-2026s2');
assert.equal((await sql.query('SELECT * FROM enrollments WHERE user_id=$1',[users[0]])).length,0);
for(const [i,label] of ['T2A','T2B','T1A','T1B'].entries()) {
  const joined=await post({action:'join',code:codes[label],groupId:'t3a-2027s1',userId:users[0]},users[i]);
  assert.equal(joined.status,200);assert.equal(joined.data.cohort.cohort+joined.data.cohort.section,label);
  const status=JSON.parse((await get('/api/study?action=status',users[i])).body);
  assert.equal(status.cohort.id,label.toLowerCase()+'-2026s2');assert.equal(status.activeTerm,'2026.2');
}
assert.equal((await sql.query('SELECT joined_at FROM members WHERE user_id=$1',[users[0]]))[0].joined_at,oldJoined);
assert.equal((await post({action:'join',code:codes.T2B},users[0])).status,409);
assert.equal((await post({action:'join',code},users[0])).status,200);
const concurrent=await Promise.all(['T1A','T1B'].map(label=>post({action:'join',code:codes[label]},users[4])));
assert.deepEqual(concurrent.map(x=>x.status).sort(),[200,409]);
assert.equal((await sql.query('SELECT * FROM enrollments WHERE user_id=$1',[users[4]])).length,1);
const rateResults=await Promise.all(Array.from({length:8},()=>post({action:'preview-invite',code:'WRONG'},users[5])));
assert(rateResults.every(x=>x.status===403));
assert.equal((await post({action:'join',code},users[5])).status,429);
for(const i of [6,7])await sql.query('INSERT INTO members(user_id,joined_at) VALUES($1,$2)',[users[i],oldJoined]);
await sql.query('INSERT INTO enrollments(user_id,academic_term,group_id,joined_at) VALUES($1,$2,$3,$4)',[users[6],'2026.1','t2a-2026s1',oldJoined]);
await sql.query('INSERT INTO enrollments(user_id,academic_term,group_id,joined_at) VALUES($1,$2,$3,$4)',[users[7],'2026.2','t3a-2026s2',oldJoined]);
for(const i of [6,7]) {
  assert.equal((await get('/api/study?action=catalog',users[i])).status,403);
  assert.equal((await get('/cadernos/genetica/index.html',users[i])).status,403);
}

const cat=await get('/api/study?action=catalog',users[0]);assert.equal(cat.status,200);const catalog=JSON.parse(cat.body);assert(catalog.items.length>2400);assert(!cat.body.includes('"answer":'));
const id=catalog.items.find(x=>x.kind==='mcq').id;const item=JSON.parse((await get('/api/study?action=item&id='+id,users[0])).body);assert(!('answer'in item));
assert.equal((await post({action:'answer',itemId:id,eventId:randomUUID(),selected:0},users[0],'https://other.example')).status,403);
const eventId=randomUUID(),payload={action:'answer',itemId:id,eventId,selected:0,correct:true,assisted:false};const answer=await post(payload,users[0]);assert.equal(answer.status,200);assert.equal(typeof answer.data.correct,'boolean');assert.equal((await post(payload,users[0])).status,200);
let p=JSON.parse((await get('/api/study?action=progress',users[0])).body);assert.equal(p.events.length,1);assert.equal(JSON.parse((await get('/api/study?action=progress&userId='+users[0],users[1])).body).events.length,0);
const snapshot={action:'book',book:'genetica',revision:0,payload:{'prancha-genetica-v1':JSON.stringify({seen:['one'],history:[]})}};assert.equal((await post(snapshot,users[0])).status,200);assert.equal((await post(snapshot,users[0])).status,409);assert.equal(JSON.parse((await get('/api/study?action=book&book=genetica',users[1])).body).revision,0);assert.equal(JSON.parse((await get('/api/study?action=book&book=genetica',users[0])).body).revision,1);
// Advancing to a new academic term keeps account history and book revisions.
await sql.query('INSERT INTO attempts(user_id,event_id,item_id,kind,correct,assisted,created_at) VALUES($1,$2,$3,$4,$5,$6,$7)',[users[6],randomUUID(),id,'answer',1,0,oldJoined]);
await sql.query('INSERT INTO snapshots(user_id,book,payload,revision,updated_at) VALUES($1,$2,$3,$4,$5)',[users[6],'genetica',JSON.stringify(snapshot.payload),3,oldJoined]);
assert.equal((await post({action:'join',code:codes.T2A},users[6])).status,200);
const advanced=JSON.parse((await get('/api/study?action=export',users[6])).body);
assert.equal(advanced.events.length,1);assert.equal(advanced.books[0].revision,3);assert.equal(advanced.enrollments.length,2);
const otherExport=JSON.parse((await get('/api/study?action=export&userId='+users[6],users[1])).body);
assert.equal(otherExport.events.length,0);assert.equal(otherExport.enrollments.length,1);assert.equal(otherExport.enrollments[0].group_id,'t2b-2026s2');
assert.equal((await get('/media/fsl_992ed811a0ed0fa98c.svg',users[0])).status,200);const book=await get('/api/book?book=genetica',users[0]);assert.equal(book.status,200);assert(book.body.includes('Object.defineProperty(window,\'localStorage\''));
const forged=await fetch(base+'/api/study?action=catalog',{headers:{'oai-authenticated-user-id':users[0],'oai-authenticated-user-email':'forged@example.test'}});assert.equal(forged.status,401);
const tampered=await fetch(base+'/api/study?action=catalog',{headers:{cookie:'prancha-session='+tokens.get(users[0]).slice(0,-16)+'invalid'}});assert.equal(tampered.status,401);
const burstId=randomUUID();await Promise.all([post({...payload,eventId:burstId},users[0]),post({...payload,eventId:burstId},users[0])]);assert.equal(JSON.parse((await get('/api/study?action=progress',users[0])).body).events.filter(e=>e.event_id===burstId).length,1);
const full=await get('/cadernos/genetica/index.html',users[0]);assert.equal(full.status,200);assert(full.body.includes('portal-sync'));assert.equal((await get('/cadernos/genetica/data.js',users[0])).status,200);
console.log(JSON.stringify({pass:true,checks:['four cohort invitations','invitation preview does not enroll','legacy invite rejected','T3 unavailable','legacy account preserved','cohort persisted','cohort cannot be overwritten','concurrent cohort admission','atomic invitation rate limit','past term access denied','unknown cohort access denied','history preserved across terms','export enrollment isolation','anonymous blocked','nonmember blocked','invalid invite','join two accounts','catalog gated','answer withheld','CSRF rejection','server grading','idempotent replay','account isolation','snapshot conflict','snapshot isolation','asset authorization','book bridge','forged header rejected','tampered session rejected','concurrent replay','protected full book route'],catalog:catalog.items.length}));

} finally {
for(const uid of users){await sql.query('DELETE FROM members WHERE user_id=$1',[uid]);await sql.query('DELETE FROM join_limits WHERE user_id=$1',[uid]);}
}
