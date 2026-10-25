import { useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { getMe } from '../api';
import { Card } from '../components/ui/Card';
import { Logo } from '../components/ui/Logo';
import { HANKO_URL, registerHankoElements } from '../hankoClient';
import { useStore } from '../store';
import { usernameTakenFrom } from '../utils/apiErrors';

export function LoginPage() {
  const { lang, setCurrentUser } = useStore();
  const nav = useNavigate();
  const registered = useRef(false);
  const [takenUsername, setTakenUsername] = useState<string | null>(null);

  useEffect(() => {
    if (registered.current) return;
    registered.current = true;

    registerHankoElements().catch(console.error);
  }, []);

  useEffect(() => {
    const el = document.querySelector('hanko-auth');
    if (!el) return;

    const onSuccess = async () => {
      try {
        // After Hanko sets its cookie/session, fetch the OnTrail user profile.
        // The mock/real API reads the Hanko JWT from the cookie automatically.
        const user = await getMe();
        setCurrentUser(user);
        nav({ to: '/feed', search: {} });
      } catch (error) {
        // The Hanko username belongs to another OnTrail user: stay here and explain.
        const taken = usernameTakenFrom(error);
        if (taken !== null) {
          setTakenUsername(taken);
          return;
        }
        // User authenticated with Hanko but doesn't have an OnTrail profile yet.
        // The real API will auto-create one on first login.
        nav({ to: '/feed', search: {} });
      }
    };

    el.addEventListener('onSessionCreated', onSuccess);
    return () => el.removeEventListener('onSessionCreated', onSuccess);
  }, [nav, setCurrentUser]);

  return (
    <div style={{ maxWidth: 440, margin: '60px auto', padding: '0 16px' }}>
      <Card
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          alignItems: 'center',
          padding: '32px 28px',
        }}
      >
        <Logo size={44} withText />
        <div style={{ textAlign: 'center' }}>
          <h2
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, margin: 0 }}
          >
            {lang === 'fi' ? 'Tervetuloa OnTrailiin' : 'Welcome to OnTrail'}
          </h2>
          <p style={{ color: 'var(--text-faint)', fontSize: 14, marginTop: 6, marginBottom: 0 }}>
            {lang === 'fi'
              ? 'Kirjaudu passkey- tai sähköpostitodentamisella'
              : 'Sign in with passkey or email'}
          </p>
        </div>

        {takenUsername !== null && (
          <p
            role="alert"
            style={{
              margin: 0,
              fontSize: 14,
              color: 'var(--danger, #c0392b)',
              textAlign: 'center',
            }}
          >
            {lang === 'fi'
              ? `Käyttäjätunnus ${takenUsername} on jo toisen OnTrail-käyttäjän käytössä. Vaihda käyttäjätunnus Hankon profiilissa ja kirjaudu uudelleen.`
              : `The username ${takenUsername} already belongs to another OnTrail user. Change your username in your Hanko profile and sign in again.`}
          </p>
        )}

        {/* Hanko auth web component — rendered after register() resolves */}
        <hanko-auth style={{ width: '100%' }} lang={lang} />

        <p style={{ fontSize: 11, color: 'var(--text-faint)', textAlign: 'center', margin: 0 }}>
          {lang === 'fi' ? `Kirjautuminen: ${HANKO_URL}` : `Auth endpoint: ${HANKO_URL}`}
        </p>
      </Card>
    </div>
  );
}
