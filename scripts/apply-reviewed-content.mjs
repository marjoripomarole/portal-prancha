import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// Additive by default: an absent source never removes an existing activity.
export function mergeReviewed(catalog, bundles) {
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
