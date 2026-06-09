import { useStore } from '../store';
import { Card } from '../components/ui/Card';
import { Logo } from '../components/ui/Logo';

export function LoginPage() {
  const { lang } = useStore();

  return (
    <div style={{ maxWidth: 420, margin: '60px auto', padding: '0 16px' }}>
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 24, textAlign: 'center' }}>
        <div style={{ margin: '0 auto' }}><Logo size={48} withText /></div>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, margin: 0 }}>
            {lang === 'fi' ? 'Tervetuloa OnTrailiin' : 'Welcome to OnTrail'}
          </h2>
          <p style={{ color: 'var(--text-faint)', fontSize: 14, marginTop: 8 }}>
            {lang === 'fi' ? 'Kirjaudu sisään päiväkirjaasi' : 'Sign in to your diary'}
          </p>
        </div>

        {/* Hanko auth element placeholder */}
        <div id="hanko-auth" style={{
          padding: '20px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)',
          border: '1px dashed var(--border)', color: 'var(--text-faint)', fontSize: 13,
        }}>
          {lang === 'fi' ? 'Hanko-kirjautuminen lisätään tähän' : 'Hanko authentication widget goes here'}
          <br /><br />
          <code style={{ fontSize: 11 }}>@teamhanko/hanko-elements</code>
        </div>

        <p style={{ fontSize: 12, color: 'var(--text-faint)' }}>
          {lang === 'fi' ? 'Paskey- ja sähköpostitodentaminen Hankon kautta' : 'Passkey and email authentication via Hanko'}
        </p>
      </Card>
    </div>
  );
}
