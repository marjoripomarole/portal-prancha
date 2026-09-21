import {createHash, timingSafeEqual} from 'node:crypto';
import configuration from '@/content/cohorts.json';

export type Cohort = {
  id: string;
  cohort: string;
  section: string;
  academicTerm: string;
  coursePeriod: number;
};

export const activeTerm = configuration.activeTerm;

// The browser receives only public cohort fields, never hashes or invitation codes.
function publicCohort(group: (typeof configuration.groups)[number]): Cohort {
  const {id, cohort, section, academicTerm, coursePeriod} = group;
  return {id, cohort, section, academicTerm, coursePeriod};
}

export function currentCohort(id: string): Cohort | null {
  const group = configuration.groups.find(g => g.id === id && g.enabled && g.academicTerm === activeTerm);
  return group ? publicCohort(group) : null;
}

export function resolveInvite(value: unknown): Cohort | null {
  if (typeof value !== 'string' || value.length > 96) return null;
  const digest = createHash('sha256').update(value.trim().toUpperCase()).digest();
  const group = configuration.groups.find(g => g.enabled && g.academicTerm === activeTerm &&
    timingSafeEqual(digest, Buffer.from(g.inviteHash, 'hex')));
  return group ? publicCohort(group) : null;
}
