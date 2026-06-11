import { ALL_SPORTS } from '../../../web/src/sports';
import type { Sport } from '../../../web/src/types';
import { sql } from '../db/client';

export async function ensureSportsSeeded(): Promise<void> {
  const count = await sql<{ count: string }[]>`select count(*)::text as count from sports`;
  if (Number(count[0]?.count ?? 0) > 0) return;

  await sql.begin(async (tx) => {
    for (const sport of ALL_SPORTS) {
      await tx`
        insert into sports (key, name_fi, name_en, glyph, color, metric, pace_unit)
        values (
          ${sport.key}, ${sport.nameFi}, ${sport.nameEn}, ${sport.glyph}, ${sport.color},
          ${sport.metric}, ${sport.paceUnit}
        )
        on conflict (key) do update set
          name_fi = excluded.name_fi,
          name_en = excluded.name_en,
          glyph = excluded.glyph,
          color = excluded.color,
          metric = excluded.metric,
          pace_unit = excluded.pace_unit
      `;
    }
  });
}

export async function listSports(): Promise<Sport[]> {
  const rows = await sql<
    {
      key: string;
      name_fi: string;
      name_en: string;
      glyph: string;
      color: string;
      metric: Sport['metric'];
      pace_unit: Sport['paceUnit'];
    }[]
  >`
    select key, name_fi, name_en, glyph, color, metric, pace_unit
    from sports
    order by name_fi asc
  `;

  return rows.map((row) => ({
    key: row.key,
    nameFi: row.name_fi,
    nameEn: row.name_en,
    glyph: row.glyph,
    color: row.color,
    metric: row.metric,
    paceUnit: row.pace_unit,
  }));
}
