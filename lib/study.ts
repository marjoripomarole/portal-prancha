// Pure study helpers shared by the portal UI and tests. No server-only imports.

export type StudyEvent = {item_id: string; kind: string; correct: number | null; assisted: number; rating: number | null; created_at: number};
export type Exam = {date: string; subject: string; title: string; note?: string; assessment: boolean};

// Official weekly board for T2A, 28/09 to 02/10/2026, checked on 27/09/2026.
export const calendars: Record<string, {checked: string; exams: Exam[]}> = {
  't2a-2026s2': {
    checked: 'Quadro semanal de 28/09 a 02/10, conferido em 27/09.',
    exams: [
      {date: '2026-09-28', subject: 'pesquisa', title: 'Pesquisa · N1', assessment: true},
      {date: '2026-09-29', subject: 'microbiota', title: 'Microbiota · N1', assessment: true},
      {date: '2026-09-30', subject: 'molecula', title: 'Molécula · vista da P1', note: 'Sem prova', assessment: false},
      {date: '2026-10-01', subject: 'pfis', title: 'PFIS · N1 e apresentação SWOT', assessment: true},
      {date: '2026-10-02', subject: 'genetica', title: 'Genética · P2', note: '70% da N1. Manhã, chegada até 9h45', assessment: true},
    ],
  },
};

const weekdays = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

// Local calendar date as YYYY-MM-DD, so the next exam changes at local midnight.
export function localDate(now: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

export function dayLabel(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  return `${weekdays[new Date(y, m - 1, d).getDay()]} ${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`;
}

export function upcomingExams(cohortId: string | undefined, today: string): Exam[] {
  const calendar = cohortId ? calendars[cohortId] : undefined;
  return calendar ? calendar.exams.filter(e => e.assessment && e.date >= today) : [];
}

export function nextExam(cohortId: string | undefined, today: string): Exam | null {
  return upcomingExams(cohortId, today)[0] ?? null;
}

// Earliest upcoming assessment date per subject; subjects without one sort after, in their original order.
export function orderSubjects<T extends {id: string}>(subjects: T[], cohortId: string | undefined, today: string): T[] {
  const first = new Map<string, string>();
  for (const e of upcomingExams(cohortId, today)) if (!first.has(e.subject)) first.set(e.subject, e.date);
  return subjects.map((s, i) => ({s, i, d: first.get(s.id)})).sort((a, b) =>
    a.d && b.d ? a.d.localeCompare(b.d) || a.i - b.i : a.d ? -1 : b.d ? 1 : a.i - b.i).map(x => x.s);
}

export function shuffle<T>(list: T[], rand: () => number = Math.random): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Display order for alternatives: position i on screen shows original option order[i].
export function optionOrder(count: number, rand: () => number = Math.random): number[] {
  return shuffle(Array.from({length: count}, (_, i) => i), rand);
}

// Last graded event per item: objective answers, self-ratings and readings.
export function latestByItem(events: StudyEvent[]): Map<string, StudyEvent> {
  const m = new Map<string, StudyEvent>();
  for (const e of events) if (e.kind === 'answer' || e.kind === 'rate' || e.kind === 'read') m.set(e.item_id, e);
  return m;
}

export function isMistake(e: StudyEvent | undefined): boolean {
  if (!e) return false;
  return (e.kind === 'answer' && (!e.correct || !!e.assisted)) || (e.kind === 'rate' && e.rating !== 2);
}

// Mistakes and doubts come back at once; clean successes after 24 hours.
export function isDue(e: StudyEvent | undefined, now: number): boolean {
  if (!e || e.kind === 'read') return false;
  return isMistake(e) || now - e.created_at >= 86400000;
}

// Round order: mistakes first, then never practised, then older clean successes.
export function prioritize<T extends {id: string}>(pool: T[], latest: Map<string, StudyEvent>, rand: () => number = Math.random): T[] {
  const mistakes: T[] = [], fresh: T[] = [], known: T[] = [];
  for (const x of pool) {
    const e = latest.get(x.id);
    if (!e || e.kind === 'read') fresh.push(x);
    else if (isMistake(e)) mistakes.push(x);
    else known.push(x);
  }
  const oldest = shuffle(known, rand).sort((a, b) => latest.get(a.id)!.created_at - latest.get(b.id)!.created_at);
  return [...shuffle(mistakes, rand), ...shuffle(fresh, rand), ...oldest];
}

// Never practised items, in course order: week first, then catalog order.
export function unseen<T extends {id: string; week: number}>(pool: T[], latest: Map<string, StudyEvent>): T[] {
  return pool.map((x, i) => ({x, i})).filter(({x}) => !latest.has(x.id))
    .sort((a, b) => a.x.week - b.x.week || a.i - b.i).map(({x}) => x);
}
