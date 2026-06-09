import { Link, useNavigate } from '@tanstack/react-router';
import { Icon } from '../ui/Icon';
import { Logo } from '../ui/Logo';
import { Avatar } from '../ui/Avatar';
import { useStore } from '../../store';
import { I18N } from '../../i18n';
import { useState } from 'react';

export function TopNav() {
  const { lang, setLang, currentUser, theme, setTheme } = useStore();
  const t = I18N[lang];
  const nav = useNavigate();
  const [q, setQ] = useState('');

  return (
    <header className="ot-topnav">
      <div className="ot-topnav-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, minWidth: 0 }}>
          <Link to="/feed" search={{}} style={{ border: 0, background: 'none', padding: 0, cursor: 'pointer' }}>
            <Logo />
          </Link>
          <nav className="ot-nav-tabs">
            <Link to="/feed" search={{}} className="ot-nav-tab"
              activeProps={{ className: 'ot-nav-tab active' }}
              inactiveProps={{ className: 'ot-nav-tab' }}>
              <Icon name="feed" size={18} stroke={2.2} /><span>{t.feed}</span>
            </Link>
            <Link to="/analytics" className="ot-nav-tab"
              activeProps={{ className: 'ot-nav-tab active' }}
              inactiveProps={{ className: 'ot-nav-tab' }}>
              <Icon name="analytics" size={18} stroke={2.2} /><span>{t.analytics}</span>
            </Link>
            <Link to="/calendar" className="ot-nav-tab"
              activeProps={{ className: 'ot-nav-tab active' }}
              inactiveProps={{ className: 'ot-nav-tab' }}>
              <Icon name="calendar" size={18} stroke={2.2} /><span>{t.calendar}</span>
            </Link>
          </nav>
        </div>

        <form className="ot-search" onSubmit={e => { e.preventDefault(); if (q.trim()) nav({ to: '/search', search: { q } }); }}>
          <Icon name="search" size={17} stroke={2} style={{ color: 'var(--text-faint)' }} />
          <input
            value={q} onChange={e => setQ(e.target.value)}
            placeholder={t.search}
            aria-label={t.search}
          />
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/log" search={{}} className="ot-rec-btn">
            <span className="ot-rec-dot" />
            <Icon name="route" size={17} stroke={2.2} />
            <span className="ot-rec-label">{t.record}</span>
          </Link>

          <button className="ot-iconbtn" aria-label="Toggle theme"
            onClick={() => setTheme({ theme: theme.theme === 'dark' ? 'light' : 'dark' })}>
            <Icon name={theme.theme === 'dark' ? 'bolt' : 'flame'} size={18} />
          </button>

          <button className="ot-iconbtn" aria-label="Language" onClick={() => setLang(lang === 'fi' ? 'en' : 'fi')}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600 }}>{lang.toUpperCase()}</span>
          </button>

          {currentUser ? (
            <Link to="/diary/$username" params={{ username: currentUser.username }} style={{ display: 'flex', padding: 2 }}>
              <Avatar initials={currentUser.avatarInitials} color={currentUser.avatarColor} size={32} />
            </Link>
          ) : (
            <Link to="/login" className="ot-iconbtn">
              <Icon name="user" size={20} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
