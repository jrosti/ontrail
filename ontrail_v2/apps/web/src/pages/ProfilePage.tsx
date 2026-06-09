import { Link } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Logo } from '../components/ui/Logo';
import { I18N } from '../i18n';
import { HANKO_URL, registerHankoElements } from '../hankoClient';
import { useStore } from '../store';

export function ProfilePage() {
  const { lang, currentUser } = useStore();
  const t = I18N[lang];
  const registered = useRef(false);

  useEffect(() => {
    if (registered.current) return;
    registered.current = true;
    registerHankoElements().catch(console.error);
  }, []);

  if (!currentUser) {
    return (
      <main className="ot-page" style={{ maxWidth: 520, margin: '48px auto' }}>
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', textAlign: 'center' }}>
          <Logo size={42} withText />
          <div>
            <h1 className="ot-page-title" style={{ margin: 0 }}>{t.profile}</h1>
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
        <h1 className="ot-page-title" style={{ margin: 0 }}>{t.profile}</h1>
        <p className="ot-page-sub" style={{ marginTop: 6 }}>
          {lang === 'fi'
            ? 'Muokkaa kirjautumista, sähköposteja, passkeytä, salasanaa ja MFA-asetuksia.'
            : 'Manage sign-in, emails, passkeys, password, and MFA settings.'}
        </p>
      </div>

      <Card style={{ padding: 24 }}>
        <hanko-profile style={{ width: '100%' }} lang={lang} />
        <p style={{ fontSize: 11, color: 'var(--text-faint)', textAlign: 'center', margin: '18px 0 0' }}>
          {lang === 'fi' ? `Hanko-profiili: ${HANKO_URL}` : `Hanko profile: ${HANKO_URL}`}
        </p>
      </Card>
    </main>
  );
}
