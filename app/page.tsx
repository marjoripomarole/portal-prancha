import Portal from './portal';
import { getUser } from '@/auth';
import {activeTerm} from '@/lib/cohorts';
export const dynamic = 'force-dynamic';
export default async function Home(){const user=await getUser();return <Portal academicTerm={activeTerm} authReady={!!(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET && process.env.DATABASE_URL)} user={user?{name:user.displayName,id:user.userId}:null}/>}
