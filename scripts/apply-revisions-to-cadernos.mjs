// Propagates reviewed alternatives from content/catalog.json to the embedded planks (protected-assets/cadernos).
// A plank question changes only when its current alternatives match the fingerprint recorded by the revision.
// Rerun after `import-content.mjs --rebuild-legacy`, which restores the planks from the vault.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {optionsFingerprint} from './apply-reviewed-content.mjs';

const dir = 'protected-assets/cadernos/';
const revised = new Map(JSON.parse(fs.readFileSync('content/catalog.json')).items.filter(i => i.revisedFrom).map(i => [i.id, i]));

// Evaluate a plank data file and return the named globals.
function evaluate(code, names) {
  const ctx = {};
  ctx.window = ctx; // browser scripts assign globals through window
  vm.createContext(ctx);
  vm.runInContext(code + ';' + names.map(n => `this.__${n}=(typeof ${n}!=='undefined'?${n}:window.${n})`).join(';'), ctx);
  // JSON round-trip: values from the sandbox realm would otherwise fail strict comparisons.
  return Object.fromEntries(names.map(n => [n, JSON.parse(JSON.stringify(ctx['__' + n]))]));
}

// End index (exclusive) of the JSON/JS literal array starting at `start` ('[').
function arrayEnd(src, start) {
  assert.equal(src[start], '[');
  let depth = 0, quote = null;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (quote) { if (c === '\\') i++; else if (c === quote) quote = null; continue; }
    if (c === '"' || c === "'") quote = c;
    else if (c === '[') depth++;
    else if (c === ']' && --depth === 0) return i + 1;
  }
  throw Error('Unterminated array');
}

// First '[' at or after `from` that is not inside a string literal.
function firstArrayStart(src, from) {
  let quote = null;
  for (let i = from; i < src.length; i++) {
    const c = src[i];
    if (quote) { if (c === '\\') i++; else if (c === quote) quote = null; continue; }
    if (c === '"' || c === "'" || c === '`') quote = c;
    else if (c === '[') return i;
  }
  throw Error('No array found');
}

// JSON planks: replace the "options" array that follows the question id.
function patchJson(file, name, list, prefix) {
  let src = fs.readFileSync(dir + file, 'utf8');
  const before = evaluate(src, [name])[name];
  const questions = list(before);
  let changed = 0, skipped = 0;
  for (const q of questions) {
    const item = revised.get(prefix + q.id);
    if (!item) continue;
    if (JSON.stringify(q.options) === JSON.stringify(item.options)) continue;
    if (optionsFingerprint(q) !== item.revisedFrom || q.answer !== item.answer) { skipped++; console.warn(`Plank differs from revision base, kept: ${prefix + q.id}`); continue; }
    const idAt = src.search(new RegExp(`"id"\\s*:\\s*${JSON.stringify(q.id).replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*[,}]`));
    assert(idAt >= 0, `id not found: ${q.id}`);
    const optAt = src.indexOf('"options"', idAt);
    const open = src.indexOf('[', optAt), close = arrayEnd(src, open);
    assert.deepEqual(JSON.parse(src.slice(open, close)), q.options, `options mismatch at ${q.id}`);
    src = src.slice(0, open) + JSON.stringify(item.options) + src.slice(close);
    changed++;
  }
  return {src, before, changed, skipped};
}

// Genetica plank: module 1 questions are object literals in data.js; the rest are
// addQ(m,n,topic,prompt,['correct|why','distractor|why',...]) calls in bank.js, rotated right by shift=(3m+n)%4.
const literal = s => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
function patchGenetica() {
  let data = fs.readFileSync(dir + 'genetica/data.js', 'utf8'), bank = fs.readFileSync(dir + 'genetica/bank.js', 'utf8');
  const load = (d, b) => evaluate(d + ';' + b, ['QUESTIONS']).QUESTIONS.filter(q => q.type === 'choice');
  const before = load(data, bank);
  let changed = 0, skipped = 0;
  for (const q of before) {
    const item = revised.get('gen-' + q.id);
    if (!item || JSON.stringify(q.options) === JSON.stringify(item.options)) continue;
    if (optionsFingerprint({options: q.options, answer: q.correct}) !== item.revisedFrom || q.correct !== item.answer) { skipped++; console.warn(`Plank differs from revision base, kept: gen-${q.id}`); continue; }
    const [, m, n] = q.id.match(/^m(\d+)q(\d+)$/);
    const call = bank.search(new RegExp(`addQ\\(\\s*${m}\\s*,\\s*${n}\\s*,`));
    if (call >= 0) {
      const shift = (Number(m) * 3 + Number(n)) % 4, len = q.options.length;
      const open = firstArrayStart(bank, call), close = arrayEnd(bank, open);
      const arr = evaluate(`const A=${bank.slice(open, close)}`, ['A']).A;
      assert.equal(arr.length, len);
      // Source position i appears at rotated position (i+shift)%len.
      const next = arr.map((entry, i) => {
        const [text, ...why] = entry.split('|');
        assert.equal(text, q.options[(i + shift) % len], `source order mismatch at ${q.id}`);
        return [item.options[(i + shift) % len], ...why].join('|');
      });
      bank = bank.slice(0, open) + '[' + next.map(literal).join(',') + ']' + bank.slice(close);
    } else {
      const at = data.search(new RegExp(`id\\s*:\\s*'${q.id}'\\s*,`));
      assert(at >= 0, `question not found in genetica plank: ${q.id}`);
      const optAt = data.indexOf('options', at), open = firstArrayStart(data, optAt), close = arrayEnd(data, open);
      assert.deepEqual(evaluate(`const A=${data.slice(open, close)}`, ['A']).A, q.options, `options mismatch at ${q.id}`);
      data = data.slice(0, open) + '[' + item.options.map(literal).join(',') + ']' + data.slice(close);
    }
    changed++;
  }
  // Re-evaluate both files together: revised questions carry the new alternatives and key; the rest are untouched.
  const after = new Map(load(data, bank).map(q => [q.id, q]));
  assert.equal(after.size, before.length);
  for (const q of before) {
    const now = after.get(q.id), item = revised.get('gen-' + q.id);
    if (item && JSON.stringify(now.options) === JSON.stringify(item.options)) { assert.equal(now.correct, item.answer, q.id); continue; }
    assert.deepEqual(now.options, q.options, `unexpected change: ${q.id}`);
  }
  return {files: [['genetica/data.js', data], ['genetica/bank.js', bank]], changed, skipped};
}

const results = [];
const forma = patchJson('forma/data.js', 'DATA', d => d.units.flatMap(u => u.mcq), 'forma-');
results.push({file: 'forma/data.js', ...forma, check: s => evaluate(s, ['DATA']).DATA.units.flatMap(u => u.mcq), prefix: 'forma-'});
const histo = patchJson('forma/histo-data.js', 'QUICK', d => d.cards, 'histo-');
results.push({file: 'forma/histo-data.js', ...histo, check: s => evaluate(s, ['QUICK']).QUICK.cards, prefix: 'histo-'});
const mol = patchJson('molecula/data.js', 'COURSE', d => d.questions, 'mol-');
results.push({file: 'molecula/data.js', ...mol, check: s => evaluate(s, ['COURSE']).COURSE.questions, prefix: 'mol-'});

for (const r of results) {
  // Re-evaluate: revised questions carry the new alternatives and key; every other question is untouched.
  const after = r.check(r.src);
  const byId = new Map(after.map(q => [q.id, q]));
  const beforeList = (r.file === 'forma/data.js' ? r.before.units.flatMap(u => u.mcq) : r.file === 'forma/histo-data.js' ? r.before.cards : r.before.questions);
  assert.equal(after.length, beforeList.length, r.file);
  for (const q of beforeList) {
    const now = byId.get(q.id), item = revised.get(r.prefix + q.id);
    if (item && JSON.stringify(now.options) === JSON.stringify(item.options)) { assert.equal(now.answer, item.answer, q.id); continue; }
    assert.deepEqual(now.options, q.options, `unexpected change: ${q.id}`);
  }
  if (!process.argv.includes('--dry')) fs.writeFileSync(dir + r.file, r.src);
  console.log(JSON.stringify({file: r.file, changed: r.changed, skipped: r.skipped}));
}

const gen = patchGenetica();
if (!process.argv.includes('--dry')) for (const [file, src] of gen.files) fs.writeFileSync(dir + file, src);
console.log(JSON.stringify({file: 'genetica/data.js + bank.js', changed: gen.changed, skipped: gen.skipped}));
