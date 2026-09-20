import Portal from './portal';
import { getUser } from '@/auth';
export const dynamic = 'force-dynamic';
export default async function Home(){const user=await getUser();return <Portal authReady={!!(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET && process.env.DATABASE_URL)} user={user?{name:user.displayName,id:user.userId}:null}/>}
