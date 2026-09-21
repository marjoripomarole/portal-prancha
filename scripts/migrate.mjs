import {neon} from '@neondatabase/serverless';
import {readFileSync,readdirSync} from 'node:fs';
if (!process.env.DATABASE_URL) throw Error('DATABASE_URL is required');
const sql=neon(process.env.DATABASE_URL);
const directory=new URL('../db/migrations/',import.meta.url);
await sql.query('CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())');
const applied=new Set((await sql.query('SELECT name FROM schema_migrations')).map(r=>r.name));
for(const name of readdirSync(directory).filter(n=>/^\d+_.+\.sql$/.test(n)).sort()) {
  if(applied.has(name))continue;
  const statements=readFileSync(new URL(name,directory),'utf8').split(';').map(s=>s.trim()).filter(Boolean);
  await sql.transaction([...statements.map(s=>sql.query(s)),sql.query('INSERT INTO schema_migrations(name) VALUES($1)',[name])]);
  console.log('Applied '+name);
}
console.log('Portal schema ready.');
