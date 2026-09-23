import {NextRequest,NextResponse} from 'next/server';
import {createHmac,randomUUID} from 'node:crypto';
import {getDeviceId,startDeviceSession,endDeviceSession} from '@/auth';
import {inviteAction} from '@/lib/enrollment';
import {one} from '@/db';
import {resolveInvite} from '@/lib/cohorts';
export const dynamic='force-dynamic';
const reply=(body:unknown,status=200)=>NextResponse.json(body,{status,headers:{'Cache-Control':'no-store'}});
export async function POST(req:NextRequest) {
  if(req.headers.get('origin')!==req.nextUrl.origin) return reply({error:'Origem inválida.'},403);
  if(!req.headers.get('content-type')?.includes('application/json')) return reply({error:'Formato inválido.'},415);
  if(!process.env.AUTH_SECRET||!process.env.DATABASE_URL) return reply({error:'Acesso temporariamente indisponível.'},503);
  try {
    const raw=await req.text();
    if(raw.length>512) return reply({error:'Código inválido.'},400);
    let body;try{body=JSON.parse(raw)}catch{return reply({error:'Formato inválido.'},400)}
    if(body?.action==='logout'){await endDeviceSession();return reply({ok:true});}
    if(body?.action!=='login'||typeof body.code!=='string'||body.code.length>96) return reply({error:'Informe o código da turma.'},400);
    // Vercel supplies this header; untrusted forwarded headers are not used.
    const address=process.env.VERCEL==='1'?req.headers.get('x-vercel-forwarded-for')??'unknown':'local';
    const rateKey='code-login:'+createHmac('sha256',process.env.AUTH_SECRET).update(address).digest('hex');
    const rate=await one<{count:number}>(`INSERT INTO join_limits(user_id,bucket,count) VALUES($1,$2,1)
      ON CONFLICT(user_id,bucket) DO UPDATE SET count=join_limits.count+1 RETURNING count`,[rateKey,Math.floor(Date.now()/600000)]);
    if(!rate||rate.count>300) return reply({error:'Muitas tentativas nesta rede. Aguarde 10 minutos.'},429);
    if(!resolveInvite(body.code)) return reply({error:'Código inválido ou indisponível para o semestre atual.'},403);
    const uid=await getDeviceId()??`device:${randomUUID()}`;
    const result=await inviteAction(uid,'join',body.code);
    if(result.status!==200) return reply(result.body,result.status);
    await startDeviceSession(uid);
    return reply({ok:true,cohort:result.body.cohort});
  } catch {return reply({error:'Não foi possível entrar. Tente novamente.'},503);}
}
