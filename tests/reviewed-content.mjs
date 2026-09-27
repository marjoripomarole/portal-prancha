import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {mergeReviewed,optionsFingerprint} from '../scripts/apply-reviewed-content.mjs';
const before=JSON.parse(execFileSync('git',['show','HEAD:content/catalog.json'],{encoding:'utf8',maxBuffer:20_000_000}));
const current=JSON.parse(fs.readFileSync('content/catalog.json'));
const bundles=fs.readdirSync('content/reviewed').filter(f=>f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync('content/reviewed/'+f)));
const result=mergeReviewed(before,bundles);
assert.deepEqual(result,current);
// Existing items change only through a new version of their reviewed bundle or an explicit revision.
const revisedIds=new Set(bundles.flatMap(b=>(b.revisions??[]).map(r=>r.id)));
let revisedCount=0,updatedReviewed=0;
for(const item of before.items){const now=result.items.find(x=>x.id===item.id);
  if(revisedIds.has(item.id)){assert.equal(now.title,item.title);assert.equal(now.options.length,item.options.length);assert.equal(now.options[now.answer]&&true,true);if(JSON.stringify(now)!==JSON.stringify(item))revisedCount++;continue;}
  if(item.id.startsWith('reviewed-')&&now.version!==item.version){updatedReviewed++;continue;}
  assert.deepEqual(now,item,`Existing item changed: ${item.id}`);}
// Revisions: applied once, idempotent, skipped when the original changed, forbidden on reviewed items.
const target=before.items.find(i=>i.kind==='mcq'&&!i.id.startsWith('reviewed-'));
const rev={id:target.id,from:optionsFingerprint(target),version:'test.1',reason:'test',options:target.options.map((o,i)=>'Opção '+i),answer:target.answer};
const probe={reviewedAt:'2026-09-27',sources:[{path:'x',sha256:'y',scope:'z'}],items:[],revisions:[rev]};
const warnings=[],warn=m=>warnings.push(m);
const applied=mergeReviewed(before,[probe],warn);
assert.deepEqual(applied.items.find(i=>i.id===target.id).options,rev.options);
assert.deepEqual(mergeReviewed(applied,[probe],warn),applied,'Revision must be idempotent');
const drifted=structuredClone(before);drifted.items.find(i=>i.id===target.id).options[0]+=' (mudou)';
assert.deepEqual(mergeReviewed(drifted,[probe],warn).items.find(i=>i.id===target.id),drifted.items.find(i=>i.id===target.id),'Stale revision must not apply');
assert(warnings.some(w=>w.startsWith('Stale revision skipped')));
assert.throws(()=>mergeReviewed(before,[{...probe,revisions:[{...rev,id:'reviewed-x'}]}],warn),/own bundle/);
assert.deepEqual(mergeReviewed(result,bundles),result,'Repeated import must be idempotent');
assert.deepEqual(mergeReviewed(result,[]),result,'Missing bundle must not delete existing activities');
assert.throws(()=>mergeReviewed(before,[bundles[0],bundles[0]]),/Duplicate reviewed ID/);
const invalid=structuredClone(bundles[0]); invalid.items[0].id=before.items[0].id;
assert.throws(()=>mergeReviewed(before,[invalid]),/namespace/);
assert(result.items.some(i=>i.week===8));
assert.equal((150/500)/(60/500),2.5);assert.equal((200/100)/(100/200),4);
console.log(JSON.stringify({preservedItems:before.items.length,newItems:result.items.length-before.items.length,revisedItems:revisedCount,updatedReviewedItems:updatedReviewed,idempotent:true,missingSourcesPreserved:true}));
