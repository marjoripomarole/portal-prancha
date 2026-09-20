import {readFileSync,appendFileSync,writeFileSync,chmodSync} from 'node:fs';
import {randomBytes} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const prodFile='.env.production.local';
const envText=readFileSync(prodFile,'utf8');
if(!/^AUTH_SECRET=/m.test(envText)) {
  const secret=randomBytes(48).toString('base64url');
  const r=spawnSync('vercel',['env','add','AUTH_SECRET','production'],{input:secret,encoding:'utf8'});
  if(r.status!==0)throw Error(r.stderr);
  appendFileSync(prodFile,'\nAUTH_SECRET='+secret+'\n');
}
const database=envText.match(/^DATABASE_URL=.*$/m)?.[0];
if(!database)throw Error('Dedicated database configuration missing');
writeFileSync('.env.test.local',database+'\nAUTH_SECRET='+randomBytes(48).toString('base64url')+'\nAUTH_TRUST_HOST=true\nAUTH_URL=http://localhost:4318\n');
chmodSync(prodFile,0o600);chmodSync('.env.test.local',0o600);
console.log('Production secret set in Vercel; isolated local test signing secret created. No secret values displayed.');
