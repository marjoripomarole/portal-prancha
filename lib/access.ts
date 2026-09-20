import {getUser} from '@/auth';
import {one} from '@/db';
export async function access() {
  const user = await getUser();
  if (!user) return {user:null, member:false};
  const row = await one('SELECT user_id FROM members WHERE user_id=$1', [user.userId]);
  return {user, member:!!row};
}
