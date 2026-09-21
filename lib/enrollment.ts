import {one, query} from '@/db';
import {activeTerm, currentCohort, resolveInvite} from '@/lib/cohorts';

export async function inviteAction(uid: string, action: 'join' | 'preview-invite', code: unknown) {
  const bucket = Math.floor(Date.now() / 600000);
  const rate = await one<{count:number}>(
    `INSERT INTO join_limits(user_id,bucket,count) VALUES($1,$2,1)
     ON CONFLICT(user_id,bucket) DO UPDATE SET count=join_limits.count+1 RETURNING count`, [uid,bucket]);
  if (!rate || rate.count > 8) return {status:429, body:{error:'Muitas tentativas. Aguarde 10 minutos.'}};
  const cohort = resolveInvite(code);
  if (!cohort) return {status:403, body:{error:'Convite inválido ou indisponível para o semestre atual. Confira o código da sua turma.'}};
  if (action === 'preview-invite') return {status:200, body:{cohort}};

  // One enrollment per account and term. A concurrent or different invite cannot overwrite it.
  await query(
    `WITH account AS (
       INSERT INTO members(user_id,joined_at) VALUES($1,$2)
       ON CONFLICT(user_id) DO UPDATE SET user_id=EXCLUDED.user_id RETURNING user_id
     )
     INSERT INTO enrollments(user_id,academic_term,group_id,joined_at)
     SELECT user_id,$3,$4,$2 FROM account
     ON CONFLICT(user_id,academic_term) DO NOTHING RETURNING group_id`,
    [uid,Date.now(),activeTerm,cohort.id]);
  const saved = await one<{group_id:string}>('SELECT group_id FROM enrollments WHERE user_id=$1 AND academic_term=$2', [uid,activeTerm]);
  if (!saved) throw Error('Enrollment was not persisted');
  if (saved.group_id !== cohort.id) {
    const existing = currentCohort(saved.group_id);
    const label = existing ? `${existing.cohort}${existing.section}` : 'outra turma';
    return {status:409, body:{error:`Sua conta já está vinculada à ${label} em ${activeTerm}. Para corrigir a turma, fale com a administração do Portal.`}};
  }
  return {status:200, body:{member:true,cohort}};
}
