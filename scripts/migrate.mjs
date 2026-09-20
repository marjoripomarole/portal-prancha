import {neon} from '@neondatabase/serverless';
import {readFileSync} from 'node:fs';
if (!process.env.DATABASE_URL) throw Error('DATABASE_URL is required');
const sql=neon(process.env.DATABASE_URL);
const statements=readFileSync(new URL('../db/migrations/001_portal.sql',import.meta.url),'utf8').split(';').map(s=>s.trim()).filter(Boolean);
await sql.transaction(statements.map(s=>sql.query(s)));
console.log('Portal schema ready: members, attempts, snapshots, join_limits.');
