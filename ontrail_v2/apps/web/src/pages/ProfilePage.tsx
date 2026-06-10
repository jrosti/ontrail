import { Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '../components/ui/Card';
import { Logo } from '../components/ui/Logo';
import { I18N } from '../i18n';
import { HANKO_URL, registerHankoElements } from '../hankoClient';
import { useStore } from '../store';
import { updateProfile, exportData, exportCSV } from '../api';
import { exportXlsx } from '../utils/exportXlsx';

export function ProfilePage() {
  const { lang, currentUser, setCurrentUser } = useStore();
  const t = I18N[lang];
  const registered = useRef(false);
  const queryClient = useQueryClient();

  const [displayName, setDisplayName] = useState(currentUser?.displayName ?? '');
  const [synopsis, setSynopsis] = useState(currentUser?.synopsis ?? '');
  const [restHr, setRestHr] = useState(String(currentUser?.restHr ?? ''));
  const [maxHr, setMaxHr] = useState(String(currentUser?.maxHr ?? ''));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (registered.current) return;
    registered.current = true;
    registerHankoElements().catch(console.error);
  }, []);

  const saveMutation = useMutation({
    mutationFn: () =>
      updateProfile({
        displayName,
        synopsis,
        restHr: restHr ? Number(restHr) : undefined,
        maxHr: maxHr ? Number(maxHr) : undefined,
      }),
    onSuccess: (user) => {
      setCurrentUser(user);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const handleExportJson = async () => {
    const blob = await exportData();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ontrail-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = async () => {
    const blob = await exportCSV();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ontrail-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportXlsx = async () => {
    const blob = await exportData();
    const json = JSON.parse(await blob.text());
    exportXlsx(json.items ?? json, lang);
  };

  if (!currentUser) {
    return (
      <main className="ot-page" style={{ maxWidth: 520, margin: '48px auto' }}>
        <Card
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Logo size={42} withText />
          <div>
            <h1 className="ot-page-title" style={{ margin: 0 }}>
              {t.profile}
            </h1>
            <p className="ot-page-sub" style={{ marginTop: 6 }}>
              {lang === 'fi'
                ? 'Kirjaudu sisään muokataksesi salasanaa, passkeytä, sähköpostia ja MFA-asetuksia.'
                : 'Sign in to manage password, passkeys, email, and MFA settings.'}
            </p>
          </div>
          <Link to="/login" className="ot-rec-btn" style={{ textDecoration: 'none' }}>
            {t.login}
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="ot-page" style={{ maxWidth: 760, margin: '32px auto' }}>
      <div style={{ marginBottom: 18 }}>
        <h1 className="ot-page-title" style={{ margin: 0 }}>
          {t.editProfile}
        </h1>
      </div>

      <Card style={{ padding: 24, marginBottom: 22 }}>
        <h3
          style={{
            marginBottom: 18,
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 17,
          }}
        >
          {t.editProfile}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dim)' }}>
              {t.displayName}
            </span>
            <input
              className="ot-input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t.displayName}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dim)' }}>
              {t.synopsisField}
            </span>
            <textarea
              className="ot-input"
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder={t.synopsisField}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dim)' }}>
                {t.restHr}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  className="ot-input"
                  type="number"
                  value={restHr}
                  onChange={(e) => setRestHr(e.target.value)}
                  placeholder="40"
                  min={20}
                  max={120}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>{t.bpm}</span>
              </div>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dim)' }}>
                {t.maxHr}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  className="ot-input"
                  type="number"
                  value={maxHr}
                  onChange={(e) => setMaxHr(e.target.value)}
                  placeholder="185"
                  min={100}
                  max={220}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>{t.bpm}</span>
              </div>
            </label>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 4 }}>
            <button
              className="ot-rec-btn"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending
                ? '…'
                : saved
                  ? lang === 'fi'
                    ? 'Tallennettu!'
                    : 'Saved!'
                  : t.saveProfile}
            </button>
            <button
              className="ot-iconbtn"
              style={{
                width: 'auto',
                padding: '0 14px',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--text-dim)',
              }}
              onClick={handleExportJson}
            >
              JSON
            </button>
            <button
              className="ot-iconbtn"
              style={{
                width: 'auto',
                padding: '0 14px',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--text-dim)',
              }}
              onClick={handleExportCsv}
            >
              CSV
            </button>
            <button
              className="ot-iconbtn"
              style={{
                width: 'auto',
                padding: '0 14px',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--text-dim)',
              }}
              onClick={handleExportXlsx}
            >
              XLSX
            </button>
          </div>
        </div>
      </Card>

      <Card style={{ padding: 24 }}>
        <h3
          style={{
            marginBottom: 16,
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 17,
          }}
        >
          {lang === 'fi' ? 'Kirjautumisasetukset' : 'Sign-in settings'}
        </h3>
        <hanko-profile style={{ width: '100%' }} lang={lang} />
        <p
          style={{
            fontSize: 11,
            color: 'var(--text-faint)',
            textAlign: 'center',
            margin: '18px 0 0',
          }}
        >
          {lang === 'fi' ? `Hanko-profiili: ${HANKO_URL}` : `Hanko profile: ${HANKO_URL}`}
        </p>
      </Card>
    </main>
  );
}
