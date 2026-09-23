import {cookies} from 'next/headers';
import {encode, decode} from 'next-auth/jwt';

const secure = process.env.AUTH_URL?.startsWith('https://') ?? false;
export const sessionCookie = secure ? '__Host-prancha-session' : 'prancha-session';
export const deviceCookie = secure ? '__Host-prancha-device' : 'prancha-device';
const lifetime = 180 * 24 * 60 * 60;
const options = {httpOnly:true, secure, sameSite:'lax' as const, path:'/'};

async function identity(name:string) {
  const token = (await cookies()).get(name)?.value;
  if (!token || !process.env.AUTH_SECRET) return null;
  try {
    const data = await decode({token, secret:process.env.AUTH_SECRET, salt:name});
    return typeof data?.uid === 'string' && /^device:[0-9a-f-]{36}$/.test(data.uid) ? data.uid : null;
  } catch { return null; }
}
export async function getDeviceId() { return identity(deviceCookie); }
export async function getUser() {
  const userId = await identity(sessionCookie);
  return userId ? {userId,displayName:'Este navegador',email:null} : null;
}
export async function startDeviceSession(uid:string) {
  if (!process.env.AUTH_SECRET) throw Error('AUTH_SECRET is required');
  const jar = await cookies();
  for (const name of [deviceCookie,sessionCookie]) {
    const token = await encode({token:{uid},secret:process.env.AUTH_SECRET,salt:name,maxAge:lifetime});
    jar.set(name,token,{...options,maxAge:lifetime});
  }
}
export async function endDeviceSession() {
  (await cookies()).set(sessionCookie,'',{...options,maxAge:0});
}
