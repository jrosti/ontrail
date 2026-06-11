/**
 * Legacy exercise migration script: MongoDB `exercise` -> Postgres `exercises`.
 *
 * Migrates exercise ROWS only. Embedded comments/cares are a separate step: they
 * are authored by other users and `comments.user_id` / `cares.user_id` are NOT
 * NULL FKs, so they cannot load until the full user set is migrated.
 *
 * Idempotent: deletes the target owner's existing exercises, then reloads
 * (truncate-and-reload per plan2-migration §5). Safe today because no
 * comments/cares reference these rows yet; revisit once those are migrated.
 *
 * Export the source with `--jsonArray` (Mongo 3.2 emits extended JSON v1:
 * `{"$oid"}`, `{"$numberLong"}`, `{"$date"}`). One author:
 *   docker exec ontrailmongo mongoexport --db ontrail --collection exercise \
 *     --query '{"user":"Jörö"}' --jsonArray 2>/dev/null > exercises.json
 *
 * Usage:
 *   MONGO_EXERCISES_JSON=/path/to/exercises.json bun run src/scripts/migrate-exercises.ts
 *
 * Conversion rules (plan2-migration §3, reconciled with the live data):
 *   - duration: centiseconds -> seconds (÷100). null -> 0 (duration_sec is NOT NULL >= 0).
 *   - distance: meters. null -> NULL. negative -> NULL.
 *   - avghr: bpm tri-state. 0 -> NULL, >230 -> NULL, null -> NULL (avg_hr CHECK > 0).
 *   - sport: Finnish name -> sport_key via sports.name_fi, plus SPORT_OVERRIDES.
 *   - creationDate -> exercise_date (UTC date; legacy is noon-shifted so == local date)
 *     and created_at; lastModifiedDate -> updated_at.
 *   - detailElevation -> climb_m; detailRepeats/detailVolume -> details jsonb;
 *     detailKcal -> detail_kcal; origin -> source; drop hid, mdbody, pace (generated).
 *   - title "" -> sport display name; body "" -> NULL.
 *
 * KNOWN LIMITATION: body HTML is carried VERBATIM. The API has no allowlist
 * sanitizer yet (plan2 §4 #2). Acceptable for a single trusted author's legacy
 * content; the bulk run must sanitize on load.
 */

import { readFileSync } from 'node:fs';
import { sql } from '../db/client';

/** Legacy sport display names with no direct sports.name_fi match. */
export const SPORT_OVERRIDES: Record<string, string> = {
  // "Lepo" (rest day) has no sport in the new model; treat as a plain note.
  Lepo: 'muu-merkinta',
};

type Long = number | { $numberLong: string } | null | undefined;
type BsonDate = { $date: string | number } | string | number | null | undefined;

export interface MongoExercise {
  _id: { $oid: string };
  user: string;
  sport: string;
  title?: string;
  body?: string;
  tags?: string[];
  duration?: Long;
  distance?: Long;
  avghr?: Long;
  detailElevation?: Long;
  detailRepeats?: Long;
  detailVolume?: Long;
  detailKcal?: Long;
  origin?: string;
  creationDate?: BsonDate;
  lastModifiedDate?: BsonDate;
}

export interface ExerciseRow {
  legacy_object_id: string;
  owner_id: string;
  sport_key: string;
  title: string;
  body_html: string | null;
  body_markdown: null;
  tags: string[];
  exercise_date: string;
  duration_sec: number;
  distance_m: number | null;
  avg_hr: number | null;
  climb_m: number | null;
  detail_kcal: number | null;
  source: string | null;
  details: Record<string, number>;
  created_at: string;
  updated_at: string;
}

/** Coerce a Mongo long/int/null into a JS integer (or null). */
export function coerceLong(v: Long): number | null {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') return Math.trunc(v);
  if (typeof v === 'object' && typeof v.$numberLong === 'string') {
    const n = Number.parseInt(v.$numberLong, 10);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/** Coerce an extended-JSON BSON date into a Date (or null). */
export function coerceDate(v: BsonDate): Date | null {
  if (v === null || v === undefined) return null;
  const raw = typeof v === 'object' ? v.$date : v;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** bpm tri-state -> valid avg_hr or null (0 -> null, >230 -> null). */
export function normalizeAvgHr(v: Long): number | null {
  const hr = coerceLong(v);
  return hr !== null && hr > 0 && hr <= 230 ? hr : null;
}

/** Assemble the details jsonb from the sparse legacy detail fields. */
export function buildDetails(doc: MongoExercise): Record<string, number> {
  const details: Record<string, number> = {};
  const repeats = coerceLong(doc.detailRepeats);
  const volume = coerceLong(doc.detailVolume);
  if (repeats !== null) details.repeats = repeats;
  if (volume !== null) details.volume = volume;
  return details;
}

/**
 * Map one legacy exercise doc to an exercises row. `sportMap` is name_fi->key
 * from the DB. Throws on an owner/sport that cannot be resolved so the caller
 * can report and skip rather than silently corrupt data.
 */
export function buildExerciseRow(
  doc: MongoExercise,
  ownerId: string,
  sportMap: Map<string, string>,
): ExerciseRow {
  const sportKey = sportMap.get(doc.sport) ?? SPORT_OVERRIDES[doc.sport];
  if (!sportKey) throw new Error(`unmapped sport: "${doc.sport}"`);

  const created = coerceDate(doc.creationDate);
  if (!created) throw new Error(`missing/invalid creationDate on ${doc._id.$oid}`);
  const modified = coerceDate(doc.lastModifiedDate) ?? created;

  const durationCs = coerceLong(doc.duration);
  const durationSec = durationCs === null ? 0 : Math.round(durationCs / 100);

  const distance = coerceLong(doc.distance);
  const distanceM = distance !== null && distance >= 0 ? distance : null;

  const climb = coerceLong(doc.detailElevation);
  const detailKcal = coerceLong(doc.detailKcal);

  const title = doc.title?.trim() ? doc.title : doc.sport;
  const body = doc.body && doc.body !== '' ? doc.body : null;

  return {
    legacy_object_id: doc._id.$oid,
    owner_id: ownerId,
    sport_key: sportKey,
    title,
    body_html: body,
    body_markdown: null,
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    // UTC date part; legacy creationDate is noon-shifted so it equals the local date.
    exercise_date: created.toISOString().slice(0, 10),
    duration_sec: durationSec,
    distance_m: distanceM,
    avg_hr: normalizeAvgHr(doc.avghr),
    climb_m: climb !== null && climb >= 0 ? climb : null,
    detail_kcal: detailKcal,
    source: doc.origin ?? null,
    details: buildDetails(doc),
    created_at: created.toISOString(),
    updated_at: modified.toISOString(),
  };
}

async function main() {
  const path = process.env.MONGO_EXERCISES_JSON;
  if (!path) {
    console.error('MONGO_EXERCISES_JSON env var is required');
    process.exit(1);
  }

  const docs: MongoExercise[] = JSON.parse(readFileSync(path, 'utf8'));
  console.log(`loaded ${docs.length} exercise docs`);

  // name_fi -> key map from the DB.
  const sportRows = await sql<{ name_fi: string; key: string }[]>`
    select name_fi, key from sports
  `;
  const sportMap = new Map(sportRows.map((r) => [r.name_fi, r.key]));

  // Resolve owners by legacy username.
  const usernames = [...new Set(docs.map((d) => d.user))];
  const userRows = await sql<{ id: string; username: string }[]>`
    select id::text, username from users where username = any(${usernames})
  `;
  const ownerMap = new Map(userRows.map((r) => [r.username, r.id]));
  const missingUsers = usernames.filter((u) => !ownerMap.has(u));
  if (missingUsers.length) {
    console.error(
      `  ERROR: unmigrated authors (run user migration first): ${missingUsers.join(', ')}`,
    );
    process.exit(1);
  }

  // Build rows, collecting any unmapped sports.
  const rows: ExerciseRow[] = [];
  const unmappedSports = new Map<string, number>();
  let skipped = 0;
  for (const doc of docs) {
    const ownerId = ownerMap.get(doc.user);
    if (!ownerId) {
      skipped++;
      continue;
    }
    try {
      rows.push(buildExerciseRow(doc, ownerId, sportMap));
    } catch (err) {
      const msg = (err as Error).message;
      if (msg.startsWith('unmapped sport')) {
        unmappedSports.set(doc.sport, (unmappedSports.get(doc.sport) ?? 0) + 1);
      } else {
        console.warn(`  skip ${doc._id.$oid}: ${msg}`);
      }
      skipped++;
    }
  }

  if (unmappedSports.size) {
    console.error('  ERROR: unmapped sports (add to SPORT_OVERRIDES):');
    for (const [s, n] of unmappedSports) console.error(`    "${s}": ${n} docs`);
    process.exit(1);
  }

  const cols = [
    'legacy_object_id',
    'owner_id',
    'sport_key',
    'title',
    'body_html',
    'body_markdown',
    'tags',
    'exercise_date',
    'duration_sec',
    'distance_m',
    'avg_hr',
    'climb_m',
    'detail_kcal',
    'source',
    'details',
    'created_at',
    'updated_at',
  ] as const;

  // Truncate-and-reload, scoped to the owners being migrated.
  const ownerIds = [...ownerMap.values()];
  let inserted = 0;
  await sql.begin(async (tx) => {
    const del = await tx`delete from exercises where owner_id = any(${ownerIds})`;
    console.log(`  deleted ${del.count} existing exercises for ${ownerIds.length} owner(s)`);
    for (let i = 0; i < rows.length; i += 500) {
      // Pass `details` as a plain object: postgres.js serializes objects to
      // jsonb. Pre-stringifying would store a double-encoded jsonb string.
      const chunk = rows.slice(i, i + 500);
      const res = await tx`insert into exercises ${tx(chunk, ...cols)}`;
      inserted += res.count;
    }
  });

  console.log('\n=== Exercise migration summary ===');
  console.log(`  input docs:  ${docs.length}`);
  console.log(`  inserted:    ${inserted}`);
  console.log(`  skipped:     ${skipped}`);

  await sql.end({ timeout: 5 });
}

if (import.meta.main) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
