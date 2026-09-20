import {neon} from '@neondatabase/serverless';
let client: ReturnType<typeof neon> | undefined;
function getClient() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  return client ??= neon(process.env.DATABASE_URL);
}
// SQL and placeholders are authored on the server. All user values are parameters.
export async function query<T = Record<string, any>>(sql: string, values: unknown[] = []): Promise<T[]> {
  return await getClient().query(sql, values) as T[];
}
export async function one<T = Record<string, any>>(sql: string, values: unknown[] = []): Promise<T | null> {
  return (await query<T>(sql, values))[0] ?? null;
}
