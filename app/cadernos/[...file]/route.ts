import {NextRequest} from 'next/server';import {GET as book} from '@/app/api/book/route';
import {protectedAsset} from '@/lib/protected-assets';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest,{params}:{params:Promise<{file:string[]}>}){const paths:Record<string,string>={'/cadernos/forma/index.html':'forma','/cadernos/forma/histo-embrio.html':'histo','/cadernos/molecula/index.html':'molecula','/cadernos/genetica/index.html':'genetica','/cadernos/ari/index.html':'ari'};const id=paths[req.nextUrl.pathname];if(!id)return protectedAsset('cadernos',(await params).file);const url=new URL(req.url);url.pathname='/api/book';url.search='?book='+id;return book(new NextRequest(url,{headers:req.headers}));}
