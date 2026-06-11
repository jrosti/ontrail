import * as XLSX from 'xlsx';

interface ExerciseRow {
  id: string;
  sport: string;
  title: string;
  date: string;
  durationCs: number;
  distanceM?: number;
  avgHr?: number;
  climbM?: number;
  tags?: string[];
  feelRating?: string;
  commentCount?: number;
  careCount?: number;
}

export function exportXlsx(exercises: ExerciseRow[], lang: 'fi' | 'en') {
  const header =
    lang === 'fi'
      ? [
          'Päivämäärä',
          'Laji',
          'Otsikko',
          'Kesto (min)',
          'Matka (km)',
          'Ka.syke',
          'Nousu (m)',
          'Avainsanat',
          'Tuntemus',
          'Kommentit',
          'Peukut',
          'ID',
        ]
      : [
          'Date',
          'Sport',
          'Title',
          'Duration (min)',
          'Distance (km)',
          'Avg HR',
          'Climb (m)',
          'Tags',
          'Feel',
          'Comments',
          'Kudos',
          'ID',
        ];

  const rows = exercises.map((ex) => [
    ex.date?.slice(0, 10) ?? '',
    ex.sport ?? '',
    ex.title ?? '',
    ex.durationCs != null ? Math.round(ex.durationCs / 6000) : '',
    ex.distanceM != null ? Number((ex.distanceM / 1000).toFixed(2)) : '',
    ex.avgHr ?? '',
    ex.climbM ?? '',
    Array.isArray(ex.tags) ? ex.tags.join(', ') : '',
    ex.feelRating ?? '',
    ex.commentCount ?? '',
    ex.careCount ?? '',
    ex.id ?? '',
  ]);

  const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);

  // Column widths
  ws['!cols'] = [
    { wch: 12 },
    { wch: 18 },
    { wch: 36 },
    { wch: 12 },
    { wch: 12 },
    { wch: 8 },
    { wch: 10 },
    { wch: 24 },
    { wch: 8 },
    { wch: 10 },
    { wch: 8 },
    { wch: 36 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, lang === 'fi' ? 'Harjoitukset' : 'Exercises');

  const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  const blob = new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ontrail-export.xlsx';
  a.click();
  URL.revokeObjectURL(url);
}
