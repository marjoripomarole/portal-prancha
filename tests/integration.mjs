import assert from 'node:assert/strict';import fs from 'node:fs';import {randomUUID} from 'node:crypto';
const base='http://127.0.0.1:4318',run=randomUUID().slice(0,8),users=['test-a-'+run,'test-b-'+run];
const code=fs.readFileSync('../_/Portal Prancha/Acesso - Portal Prancha.md','utf8').match(/\*\*(TURMA-[A-F0-9]+)\*\*/)[1];
const headers=user=>user?{'oai-authenticated-user-id':user,'oai-authenticated-user-email':user+'@example.test'}:{};
async function get(path,user){const r=await fetch(base+path,{headers:headers(user)});return {status:r.status,body:await r.text()};}
async function post(data,user,origin=base){const r=await fetch(base+'/api/study',{method:'POST',headers:{...headers(user),'content-type':'application/json',origin},body:JSON.stringify(data)});return {status:r.status,data:await r.json()};}
assert.equal((await get('/api/study?action=catalog')).status,401);assert.equal((await get('/media/fsl_992ed811a0ed0fa98c.svg')).status,401);assert.equal((await get('/cadernos/genetica/data.js')).status,401);
assert.equal((await get('/api/study?action=catalog',users[0])).status,403);assert.equal((await post({action:'join',code:'INVALID'},users[0])).status,403);
for(const u of users)assert.equal((await post({action:'join',code},u)).status,200);
const cat=await get('/api/study?action=catalog',users[0]);assert.equal(cat.status,200);const catalog=JSON.parse(cat.body);assert(catalog.items.length>2400);assert(!cat.body.includes('"answer":'));
const id=catalog.items.find(x=>x.kind==='mcq').id;const item=JSON.parse((await get('/api/study?action=item&id='+id,users[0])).body);assert(!('answer'in item));
assert.equal((await post({action:'answer',itemId:id,eventId:randomUUID(),selected:0},users[0],'https://other.example')).status,403);
const eventId=randomUUID(),payload={action:'answer',itemId:id,eventId,selected:0,correct:true,assisted:false};const answer=await post(payload,users[0]);assert.equal(answer.status,200);assert.equal(typeof answer.data.correct,'boolean');assert.equal((await post(payload,users[0])).status,200);
let p=JSON.parse((await get('/api/study?action=progress',users[0])).body);assert.equal(p.events.length,1);assert.equal(JSON.parse((await get('/api/study?action=progress&userId='+users[0],users[1])).body).events.length,0);
const snapshot={action:'book',book:'genetica',revision:0,payload:{'prancha-genetica-v1':JSON.stringify({seen:['one'],history:[]})}};assert.equal((await post(snapshot,users[0])).status,200);assert.equal((await post(snapshot,users[0])).status,409);assert.equal(JSON.parse((await get('/api/study?action=book&book=genetica',users[1])).body).revision,0);assert.equal(JSON.parse((await get('/api/study?action=book&book=genetica',users[0])).body).revision,1);
assert.equal((await get('/media/fsl_992ed811a0ed0fa98c.svg',users[0])).status,200);const book=await get('/api/book?book=genetica',users[0]);assert.equal(book.status,200);assert(book.body.includes('Object.defineProperty(window,\'localStorage\''));
console.log(JSON.stringify({pass:true,checks:['anonymous blocked','nonmember blocked','invalid invite','join two accounts','catalog gated','answer withheld','CSRF rejection','server grading','idempotent replay','account isolation','snapshot conflict','snapshot isolation','asset authorization','book bridge'],catalog:catalog.items.length}));
