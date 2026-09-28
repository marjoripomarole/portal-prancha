// Run: node --experimental-strip-types tests/study.mjs
import assert from 'node:assert/strict';
import {nextExam, upcomingExams, orderSubjects, dayLabel, optionOrder, shuffle, prioritize, isDue, isMistake, latestByItem, localDate, unseen} from '../lib/study.ts';

const t2a = 't2a-2026s2';
// Next assessment follows the official weekly board; the P1 review is not an assessment.
assert.equal(nextExam(t2a, '2026-09-27').subject, 'pesquisa');
assert.equal(nextExam(t2a, '2026-09-28').subject, 'pesquisa', 'exam day still shows that exam');
assert.equal(nextExam(t2a, '2026-09-29').subject, 'microbiota');
assert.equal(nextExam(t2a, '2026-09-30').subject, 'pfis', 'vista da P1 is not an assessment');
assert.equal(nextExam(t2a, '2026-10-02').subject, 'genetica');
assert.equal(nextExam(t2a, '2026-10-03'), null);
assert.equal(nextExam('t1a-2026s2', '2026-09-27'), null, 'no calendar for other cohorts');
assert.equal(nextExam(undefined, '2026-09-27'), null);
assert.equal(upcomingExams(t2a, '2026-09-27').length, 4);

assert.equal(dayLabel('2026-09-28'), 'seg 28/09');
assert.equal(dayLabel('2026-10-02'), 'sex 02/10');
assert.equal(localDate(new Date(2026, 8, 27, 23, 59)), '2026-09-27');

const subjects = ['forma', 'molecula', 'genetica', 'microbiota', 'pfis', 'pesquisa', 'pratica'].map(id => ({id}));
assert.deepEqual(orderSubjects(subjects, t2a, '2026-09-27').map(s => s.id), ['pesquisa', 'microbiota', 'pfis', 'genetica', 'forma', 'molecula', 'pratica']);
assert.deepEqual(orderSubjects(subjects, t2a, '2026-09-30').map(s => s.id), ['pfis', 'genetica', 'forma', 'molecula', 'microbiota', 'pesquisa', 'pratica']);
assert.deepEqual(orderSubjects(subjects, 't1a-2026s2', '2026-09-27').map(s => s.id), subjects.map(s => s.id));

// Seeded random for deterministic checks.
function seeded(seed) { return () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }; }

// Every order is a permutation and the correct option can be traced back after shuffling.
for (let n = 2; n <= 6; n++) for (let s = 1; s < 50; s++) {
  const order = optionOrder(n, seeded(s));
  assert.deepEqual([...order].sort((a, b) => a - b), Array.from({length: n}, (_, i) => i));
  const answer = s % n, shown = order.indexOf(answer);
  assert.equal(order[shown], answer, 'display index maps back to the original answer');
}
// Position of the correct alternative becomes roughly uniform.
const positions = [0, 0, 0, 0];
for (let i = 0; i < 40000; i++) positions[optionOrder(4).indexOf(0)]++;
for (const p of positions) assert(p > 9000 && p < 11000, 'uniform display position: ' + positions);
assert.deepEqual(shuffle([1, 2, 3], seeded(7)).sort(), [1, 2, 3]);

// Review and priority rules.
const now = Date.UTC(2026, 8, 27, 12);
const ev = (item_id, kind, extra = {}) => ({item_id, kind, correct: null, assisted: 0, rating: null, created_at: now - 3600000, ...extra});
const events = [
  ev('wrong', 'answer', {correct: 0}),
  ev('assisted', 'answer', {correct: 1, assisted: 1}),
  ev('partial', 'rate', {rating: 1}),
  ev('recent-ok', 'answer', {correct: 1}),
  ev('old-ok', 'answer', {correct: 1, created_at: now - 3 * 86400000}),
  ev('older-ok', 'rate', {rating: 2, created_at: now - 5 * 86400000}),
  ev('read', 'read'),
];
const latest = latestByItem(events);
assert(isMistake(latest.get('wrong')) && isMistake(latest.get('assisted')) && isMistake(latest.get('partial')));
assert(!isMistake(latest.get('recent-ok')) && !isMistake(undefined));
assert(isDue(latest.get('wrong'), now) && isDue(latest.get('old-ok'), now));
assert(!isDue(latest.get('recent-ok'), now) && !isDue(latest.get('read'), now) && !isDue(undefined, now));

const pool = ['old-ok', 'new-1', 'wrong', 'recent-ok', 'older-ok', 'partial', 'new-2', 'assisted'].map(id => ({id}));
for (let s = 1; s < 30; s++) {
  const order = prioritize(pool, latest, seeded(s)).map(x => x.id);
  assert.deepEqual(order.slice(0, 3).sort(), ['assisted', 'partial', 'wrong'], 'mistakes first');
  assert.deepEqual(order.slice(3, 5).sort(), ['new-1', 'new-2'], 'then never practised');
  assert.deepEqual(order.slice(5), ['older-ok', 'old-ok', 'recent-ok'], 'then oldest successes first');
}
// A later correct answer clears an earlier mistake.
assert(!isMistake(latestByItem([ev('x', 'answer', {correct: 0}), ev('x', 'answer', {correct: 1})]).get('x')));

// Only never practised items, ordered by week and then by catalog order.
const course = [{id: 'w3a', week: 3}, {id: 'wrong', week: 1}, {id: 'w1a', week: 1}, {id: 'old-ok', week: 2}, {id: 'w2a', week: 2}, {id: 'w1b', week: 1}];
assert.deepEqual(unseen(course, latest).map(x => x.id), ['w1a', 'w1b', 'w2a', 'w3a']);
assert.deepEqual(unseen([{id: 'wrong', week: 1}], latest), [], 'mistakes are not unseen');

console.log('study helpers: all checks passed');
