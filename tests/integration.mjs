import {encode} from 'next-auth/jwt';
import {neon} from '@neondatabase/serverless';
import assert from 'node:assert/strict';import fs from 'node:fs';import {randomUUID} from 'node:crypto';
const base='http://localhost:4318',run=randomUUID().slice(0,8),users=['test-a-'+run,'test-b-'+run];
const code=fs.readFileSync('../_/Portal Prancha/Acesso - Portal Prancha.md','utf8').match(/\*\*(TURMA-[A-F0-9]+)\*\*/)[1];
if(!process.env.AUTH_SECRET||!process.env.DATABASE_URL)throw Error('Use the isolated .env.test.local environment');
const tokens=new Map(await Promise.all(users.map(async uid=>[uid,await encode({token:{uid,name:'Aluno de teste',email:uid+'@example.test'},secret:process.env.AUTH_SECRET,salt:'authjs.session-token',maxAge:600})])));
const headers=user=>user?{cookie:'authjs.session-token='+tokens.get(user)}:{};
const sql=neon(process.env.DATABASE_URL);
try {
async function get(path,user){const r=await fetch(base+path,{headers:headers(user)});return {status:r.status,body:await r.text()};}
async function post(data,user,origin=base){const r=await fetch(base+'/api/study',{method:'POST',headers:{...headers(user),'content-type':'application/json',origin},body:JSON.stringify(data)});return {status:r.status,data:await r.json()};}
assert.equal((await get('/api/study?action=catalog')).status,401);assert.equal((await get('/media/fsl_992ed811a0ed0fa98c.svg')).status,403);assert.equal((await get('/cadernos/genetica/data.js')).status,403);
assert.equal((await get('/api/study?action=catalog',users[0])).status,403);assert.equal((await post({action:'join',code:'INVALID'},users[0])).status,403);
for(const u of users)assert.equal((await post({action:'join',code},u)).status,200);
const cat=await get('/api/study?action=catalog',users[0]);assert.equal(cat.status,200);const catalog=JSON.parse(cat.body);assert(catalog.items.length>2400);assert(!cat.body.includes('"answer":'));
const id=catalog.items.find(x=>x.kind==='mcq').id;const item=JSON.parse((await get('/api/study?action=item&id='+id,users[0])).body);assert(!('answer'in item));
assert.equal((await post({action:'answer',itemId:id,eventId:randomUUID(),selected:0},users[0],'https://other.example')).status,403);
const eventId=randomUUID(),payload={action:'answer',itemId:id,eventId,selected:0,correct:true,assisted:false};const answer=await post(payload,users[0]);assert.equal(answer.status,200);assert.equal(typeof answer.data.correct,'boolean');assert.equal((await post(payload,users[0])).status,200);
let p=JSON.parse((await get('/api/study?action=progress',users[0])).body);assert.equal(p.events.length,1);assert.equal(JSON.parse((await get('/api/study?action=progress&userId='+users[0],users[1])).body).events.length,0);
const snapshot={action:'book',book:'genetica',revision:0,payload:{'prancha-genetica-v1':JSON.stringify({seen:['one'],history:[]})}};assert.equal((await post(snapshot,users[0])).status,200);assert.equal((await post(snapshot,users[0])).status,409);assert.equal(JSON.parse((await get('/api/study?action=book&book=genetica',users[1])).body).revision,0);assert.equal(JSON.parse((await get('/api/study?action=book&book=genetica',users[0])).body).revision,1);
assert.equal((await get('/media/fsl_992ed811a0ed0fa98c.svg',users[0])).status,200);const book=await get('/api/book?book=genetica',users[0]);assert.equal(book.status,200);assert(book.body.includes('Object.defineProperty(window,\'localStorage\''));
const forged=await fetch(base+'/api/study?action=catalog',{headers:{'oai-authenticated-user-id':users[0],'oai-authenticated-user-email':'forged@example.test'}});assert.equal(forged.status,401);
const tampered=await fetch(base+'/api/study?action=catalog',{headers:{cookie:'authjs.session-token='+tokens.get(users[0]).slice(0,-16)+'invalid'}});assert.equal(tampered.status,401);
const burstId=randomUUID();await Promise.all([post({...payload,eventId:burstId},users[0]),post({...payload,eventId:burstId},users[0])]);assert.equal(JSON.parse((await get('/api/study?action=progress',users[0])).body).events.filter(e=>e.event_id===burstId).length,1);
const full=await get('/cadernos/genetica/index.html',users[0]);assert.equal(full.status,200);assert(full.body.includes('portal-sync'));assert.equal((await get('/cadernos/genetica/data.js',users[0])).status,200);
console.log(JSON.stringify({pass:true,checks:['anonymous blocked','nonmember blocked','invalid invite','join two accounts','catalog gated','answer withheld','CSRF rejection','server grading','idempotent replay','account isolation','snapshot conflict','snapshot isolation','asset authorization','book bridge','forged header rejected','tampered session rejected','concurrent replay','protected full book route'],catalog:catalog.items.length}));

} finally {
for(const uid of users){await sql.query('DELETE FROM members WHERE user_id=$1',[uid]);await sql.query('DELETE FROM join_limits WHERE user_id=$1',[uid]);}
}
