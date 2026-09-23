import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sanitizeAnalyticsEvent as clean} from '../lib/analytics-policy.mjs';
test('strips potentially sensitive queries and fragments',()=>{
 assert.deepEqual(clean({type:'pageview',url:'https://portal-prancha.vercel.app/?code=secret&user=123#private'}),{type:'pageview',url:'https://portal-prancha.vercel.app/'});
});
test('only public routes on the production origin are allowed',()=>{
 for(const url of ['https://portal-prancha.vercel.app/api/study?id=private','https://portal-prancha.vercel.app/cadernos/genetica/index.html','https://portal-prancha.vercel.app/student/private','https://preview.vercel.app/','http://localhost:4318/','invalid']) assert.equal(clean({type:'pageview',url}),null);
 for(const path of ['/','/entrar','/privacidade'])assert.equal(clean({type:'pageview',url:'https://portal-prancha.vercel.app'+path}).url,'https://portal-prancha.vercel.app'+path);
});
test('custom events are not collected',()=>assert.equal(clean({type:'event',url:'https://portal-prancha.vercel.app/'}),null));
