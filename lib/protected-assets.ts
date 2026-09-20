import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {access} from '@/lib/access';

const mime: Record<string, string> = {'.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff','.json':'application/json'};
export async function protectedAsset(namespace: 'cadernos' | 'media', parts: string[]) {
  const a = await access();
  const headers = {'Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'};
  if (!a.user || !a.member) return new Response('Acesso restrito à turma.', {status:403,headers});
  if (!parts.length || parts.some(p=>p==='..'||p==='.'||p.includes('/')||p.includes('\\')||p.includes('\0'))) return new Response('Arquivo inválido.', {status:400,headers});
  const type = mime[path.extname(parts.at(-1)!).toLowerCase()];
  if (!type) return new Response('Arquivo não encontrado.', {status:404,headers});
  try {
    const bytes = await readFile(path.join(process.cwd(),'protected-assets',namespace,...parts));
    return new Response(bytes, {headers:{...headers,'Content-Type':type}});
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e;
    return new Response('Arquivo não encontrado.', {status:404,headers});
  }
}
