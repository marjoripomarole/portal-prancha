import {protectedAsset} from '@/lib/protected-assets';
export const dynamic = 'force-dynamic';
export async function GET(_req: Request, {params}: {params: Promise<{file:string[]}>}) {
  return protectedAsset('media',(await params).file);
}
