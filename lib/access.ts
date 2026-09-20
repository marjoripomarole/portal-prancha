import {getChatGPTUser} from '@/app/chatgpt-auth';
import {getDb} from '@/db';import {members} from '@/db/schema';import {eq} from 'drizzle-orm';
export async function access(){const user=await getChatGPTUser();if(!user)return {user:null,member:false};const row=await getDb().select().from(members).where(eq(members.userId,user.userId)).get();return {user,member:!!row};}
