import assert from 'node:assert/strict';
import {neon} from '@neondatabase/serverless';
import {decode,encode} from 'next-auth/jwt';
import {randomUUID,createHmac} from 'node:crypto';
import fs from 'node:fs';
const base='http://localhost:4318';
const code=fs.readFileSync('../_/Portal Prancha/Códigos por turma - 2026.2.md','utf8').match(/FSL-T2A-2026S2-[A-F0-9]{16}/)[0];
const sql=neon(process.env.DATABASE_URL),users=new Set();
const rateKey='code-login:'+createHmac('sha256',process.env.AUTH_SECRET).update('local').digest('hex');
const bucket=Math.floor(Date.now()/600000);
async function login(body,cookie='',origin=base){return fetch(base+'/api/access',{method:'POST',headers:{'content-type':'application/json',origin,cookie},body:JSON.stringify(body)});}
async function get(action,cookie=''){return fetch(base+'/api/study?action='+action,{headers:{cookie}});}
async function session(cookie=''){
 const r=await login({action:'login',code},cookie);assert.equal(r.status,200);
 const lines=r.headers.getSetCookie();assert.equal(lines.length,2);
 assert(lines.every(c=>/HttpOnly/i.test(c)&&/SameSite=lax/i.test(c)&&/Path=\//i.test(c)));
 const jar=Object.fromEntries(lines.map(c=>{const pair=c.split(';')[0],i=pair.indexOf('=');return [pair.slice(0,i),pair.slice(i+1)]}));
 const payload=await decode({token:jar['prancha-session'],secret:process.env.AUTH_SECRET,salt:'prancha-session'});users.add(payload.uid);
 return {uid:payload.uid,jar,cookie:Object.entries(jar).map(([k,v])=>k+'='+v).join('; ')};
}
try{
 assert.equal((await login({action:'login',code:'wrong'})).status,403);
 assert.equal((await login({action:'login',code},'','https://attacker.example')).status,403);
 assert.equal((await login({action:'login',code:42})).status,400);
 assert.equal((await get('catalog')).status,401);
 const a=await session(),b=await session();assert.notEqual(a.uid,b.uid);
 assert.match(a.uid,/^device:/);
 assert.equal((await get('catalog',a.cookie)).status,200);
 const resumed=await session('prancha-device='+a.jar['prancha-device']);assert.equal(resumed.uid,a.uid);
 const catalog=await (await get('catalog',a.cookie)).json();const id=catalog.items.find(i=>i.kind==='mcq').id;
 const write=await fetch(base+'/api/study',{method:'POST',headers:{origin:base,'content-type':'application/json',cookie:a.cookie},body:JSON.stringify({action:'answer',itemId:id,eventId:randomUUID(),selected:0})});assert.equal(write.status,200);
 assert.equal((await (await get('progress',b.cookie)).json()).events.length,0);
 assert.equal((await (await get('progress',resumed.cookie)).json()).events.length,1);
 const out=await login({action:'logout'},a.cookie);assert.equal(out.status,200);assert(out.headers.getSetCookie().some(c=>c.startsWith('prancha-session=')&&c.includes('Max-Age=0')));
 assert.equal((await get('catalog','prancha-device='+a.jar['prancha-device'])).status,401);
 assert.equal((await session('prancha-device='+a.jar['prancha-device'])).uid,a.uid);
 assert.equal((await get('catalog','prancha-session='+a.jar['prancha-device'])).status,401);
 assert.equal((await get('catalog','prancha-session='+a.jar['prancha-session'].slice(0,-20)+'invalid')).status,401);
 const old=await encode({token:{uid:'google:test-legacy'},secret:process.env.AUTH_SECRET,salt:'authjs.session-token',maxAge:60});
 assert.equal((await get('catalog','authjs.session-token='+old)).status,401);
 assert.equal((await fetch(base+'/api/auth/signin/google')).status,410);
 const expired=await encode({token:{uid:a.uid},secret:process.env.AUTH_SECRET,salt:'prancha-session',maxAge:-600});assert.equal((await get('catalog','prancha-session='+expired)).status,401);
 await sql.query('INSERT INTO join_limits(user_id,bucket,count) VALUES($1,$2,300) ON CONFLICT(user_id,bucket) DO UPDATE SET count=300',[rateKey,bucket]);
 assert.equal((await login({action:'login',code:'WRONG'})).status,429);
 console.log(JSON.stringify({pass:true,checks:['valid code','invalid code','CSRF','invalid payload','anonymous blocked','unique browser identities','resume on same browser','progress isolation','logout','device cookie alone denied','cookie purpose separation','tampered cookie','expired cookie','Google login disabled','old Google session rejected','network rate limit','httpOnly and SameSite cookies']}));
}finally{
 for(const uid of users){await sql.query('DELETE FROM members WHERE user_id=$1',[uid]);await sql.query('DELETE FROM join_limits WHERE user_id=$1',[uid]);}
 await sql.query('DELETE FROM join_limits WHERE user_id=$1 AND bucket=$2',[rateKey,bucket]);
}
