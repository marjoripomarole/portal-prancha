import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

// Fingerprint of an imported question's alternatives and key, recorded by each revision.
export const optionsFingerprint = item => crypto.createHash('sha256').update(JSON.stringify([item.options, item.answer])).digest('hex').slice(0, 16);

// Revisions rewrite the alternatives of imported questions (for example, to remove answer-length cues).
// A revision applies only while the imported original still matches its fingerprint; otherwise it is skipped loudly.
function applyRevisions(byId, bundles, warn) {
  const revised = new Set();
  for (const bundle of bundles) for (const r of bundle.revisions ?? []) {
    assert(!revised.has(r.id), `Duplicate revision: ${r.id}`);
    revised.add(r.id);
    assert(!r.id.startsWith('reviewed-'), 'Edit reviewed items in their own bundle');
    assert(r.from && r.version && r.reason, `Revision needs from, version and reason: ${r.id}`);
    const item = byId.get(r.id);
    if (!item) { warn(`Revision target missing: ${r.id}`); continue; }
    assert(item.kind === 'mcq' && Array.isArray(r.options) && r.options.length === item.options.length && Number.isInteger(r.answer) && r.options[r.answer], `Invalid revision: ${r.id}`);
    const same = JSON.stringify([item.options, item.answer]) === JSON.stringify([r.options, r.answer]) && (!r.explanation || item.explanation === r.explanation);
    if (same) {
      // Already applied: keep provenance so the revision can be updated later.
      if (item.revisedFrom !== r.from || item.version !== r.version) byId.set(r.id, {...item, version: r.version, revisedFrom: r.from});
      continue;
    }
    // An item revised earlier carries the fingerprint of its imported original.
    if ((item.revisedFrom ?? optionsFingerprint(item)) !== r.from) { warn(`Stale revision skipped: ${r.id}`); continue; }
    byId.set(r.id, {...item, options: r.options, answer: r.answer, ...(r.explanation ? {explanation: r.explanation} : {}), version: r.version, revisedFrom: r.from});
  }
  return revised;
}

// Fingerprint of the image an imported card shows after its answer, recorded by each figure.
export const visualFingerprint = item => crypto.createHash('sha256').update(item.solutionVisual ?? '').digest('hex').slice(0, 16);

// Figures replace the image shown after an imported card's answer, for example with the lecture slide that taught it.
// A figure applies only while the card still shows the image it was chosen against; otherwise it is skipped loudly.
function applyFigures(byId, bundles, warn) {
  const figured = new Set();
  for (const bundle of bundles) for (const f of bundle.figures ?? []) {
    assert(!figured.has(f.id), `Duplicate figure: ${f.id}`);
    figured.add(f.id);
    assert(!f.id.startsWith('reviewed-'), 'Edit reviewed items in their own bundle');
    assert(f.from && f.version && f.reason && f.solutionVisual, `Figure needs from, version, reason and solutionVisual: ${f.id}`);
    const item = byId.get(f.id);
    if (!item) { warn(`Figure target missing: ${f.id}`); continue; }
    if (item.solutionVisual === f.solutionVisual) {
      if (item.figureFrom !== f.from) byId.set(f.id, {...item, figureFrom: f.from});
      continue;
    }
    // A card that already received a figure carries the fingerprint of its imported image.
    if ((item.figureFrom ?? visualFingerprint(item)) !== f.from) { warn(`Stale figure skipped: ${f.id}`); continue; }
    byId.set(f.id, {...item, solutionVisual: f.solutionVisual, figureFrom: f.from});
  }
  return figured;
}

// Additive by default: an absent source never removes an existing activity.
export function mergeReviewed(catalog, bundles, warn = message => console.warn(message)) {
  const byId = new Map(catalog.items.map(item => [item.id, item]));
  const reviewedIds = new Set();
  for (const bundle of bundles) {
    assert(bundle.reviewedAt && bundle.sources?.length, 'Missing review provenance');
    for (const item of bundle.items) {
      assert(!reviewedIds.has(item.id), `Duplicate reviewed ID: ${item.id}`);
      reviewedIds.add(item.id);
      assert(item.id.startsWith('reviewed-'), 'Reviewed IDs must use their own namespace');
      assert(catalog.subjects.some(s => s.id === item.subject), 'Unknown subject');
      assert(Number.isInteger(item.week) && item.week > 0, 'Invalid week');
      assert(item.title && item.source && item.version, 'Missing item metadata');
      assert(['read','mcq','written','recall'].includes(item.kind), 'Invalid format');
      if (item.kind === 'mcq') assert(Array.isArray(item.options) && Number.isInteger(item.answer) && item.options[item.answer] && item.explanation, 'Invalid answer');
      byId.set(item.id, item);
    }
  }
  applyRevisions(byId, bundles, warn);
  applyFigures(byId, bundles, warn);
  return {...catalog, items: [...byId.values()]};
}
export function applyReviewed() {
  const catalog = JSON.parse(fs.readFileSync('content/catalog.json'));
  const bundles = fs.readdirSync('content/reviewed').filter(f => f.endsWith('.json')).sort().map(f => JSON.parse(fs.readFileSync('content/reviewed/'+f)));
  const next = mergeReviewed(catalog, bundles);
  if (JSON.stringify(next) === JSON.stringify(catalog)) { console.log('No reviewed content changes'); return; }
  const report = JSON.parse(fs.readFileSync('content/import-report.json'));
  report.updated = new Date().toISOString().slice(0,10);
  report.items = next.items.length;
  report.bySubject = report.bySubject.map(s => ({...s, counts: Object.fromEntries(['read','mcq','written','recall'].map(k=>[k,next.items.filter(i=>i.subject===s.id&&i.kind===k).length])), weeks:[...new Set(next.items.filter(i=>i.subject===s.id).map(i=>i.week))].sort((a,b)=>a-b)}));
  fs.writeFileSync('content/catalog.json',JSON.stringify(next));
  fs.writeFileSync('content/import-report.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify({before:catalog.items.length,after:next.items.length,updated:report.updated}));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) applyReviewed();
