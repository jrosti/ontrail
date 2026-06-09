import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import postgres from 'postgres';
import { loadConfig } from '../config';

const config = loadConfig();
const sql = postgres(config.databaseUrl, { max: 1 });
const migrationsDir = new URL('../../migrations', import.meta.url).pathname;

await sql`
  create table if not exists schema_migrations (
    id text primary key,
    applied_at timestamptz not null default now()
  )
`;

const files = readdirSync(migrationsDir)
  .filter((file) => file.endsWith('.sql'))
  .sort();

for (const file of files) {
  const existing = await sql`select id from schema_migrations where id = ${file}`;
  if (existing.length > 0) continue;

  const body = readFileSync(join(migrationsDir, file), 'utf8');
  await sql.begin(async (tx) => {
    await tx.unsafe(body);
    await tx`insert into schema_migrations (id) values (${file})`;
  });
  console.log(`applied ${file}`);
}

await sql.end({ timeout: 5 });
