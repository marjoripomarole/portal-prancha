import {getUser} from '@/auth';
import {one} from '@/db';
import {activeTerm,currentCohort} from '@/lib/cohorts';
export async function access() {
  const user = await getUser();
  if (!user) return {user:null, member:false, cohort:null};
  const row = await one<{group_id:string}>('SELECT group_id FROM enrollments WHERE user_id=$1 AND academic_term=$2', [user.userId,activeTerm]);
  const cohort = row ? currentCohort(row.group_id) : null;
  return {user, member:!!cohort, cohort};
}
