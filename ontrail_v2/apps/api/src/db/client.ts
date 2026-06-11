import postgres from 'postgres';
import { loadConfig } from '../config';

const config = loadConfig();

export const sql = postgres(config.databaseUrl, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export async function closeDb(): Promise<void> {
  await sql.end({ timeout: 5 });
}
