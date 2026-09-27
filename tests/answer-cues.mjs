// Fails when an objective question has an option visibly longer or shorter than all the others,
// a cue that lets students guess the key without knowing the content.
// Visible means more than 10% and more than 8 characters beyond the nearest other option.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const {items} = JSON.parse(fs.readFileSync('content/catalog.json'));
const visibly = (a, b) => a > b * 1.10 && a - b > 8;
const flagged = [];
const bySubject = {};
for (const i of items.filter(x => x.kind === 'mcq')) {
  const L = i.options.map(o => o.length);
  const s = (bySubject[i.subject] ??= {questions: 0, correctLongest: 0});
  s.questions++;
  const others = L.filter((_, k) => k !== i.answer);
  if (L[i.answer] > Math.max(...others)) s.correctLongest++;
  L.forEach((l, k) => {
    const rest = L.filter((_, j) => j !== k);
    if (visibly(l, Math.max(...rest)) || visibly(Math.min(...rest), l)) flagged.push(`${i.id} [${k}]`);
  });
}
assert.deepEqual(flagged, [], 'Options that stand out by length: ' + flagged.join(', '));
for (const [subject, s] of Object.entries(bySubject)) {
  // Correct answer being the (even slightly) longest option should stay near or below chance.
  assert(s.correctLongest / s.questions <= 0.30, `${subject}: correct option is the longest in ${s.correctLongest}/${s.questions}`);
}
console.log(JSON.stringify(Object.fromEntries(Object.entries(bySubject).map(([k, s]) => [k, `${s.correctLongest}/${s.questions} correta mais longa`]))));
