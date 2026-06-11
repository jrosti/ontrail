import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { getUnread, markAllRead } from '../../api';
import { I18N } from '../../i18n';
import { useStore } from '../../store';
import { Avatar } from '../ui/Avatar';
import { Icon } from '../ui/Icon';
import { Logo } from '../ui/Logo';

export function TopNav() {
  const { lang, setLang, currentUser, theme, setTheme } = useStore();
  const t = I18N[lang];
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const qc = useQueryClient();

  const { data: unread } = useQuery({
    queryKey: ['unread'],
    queryFn: getUnread,
    enabled: !!currentUser,
    refetchInterval: 60000,
  });

  const markReadMutation = useMutation({
    mutationFn: markAllRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['unread'] }),
  });

  const handleFeedClick = () => {
    if (unread && unread.commentCount > 0) {
      markReadMutation.mutate();
    }
  };

  const hasUnread = !!unread && unread.commentCount > 0;

  return (
    <header className="ot-topnav">
      <div className="ot-topnav-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, minWidth: 0 }}>
          <Link
            to="/feed"
            search={{}}
            style={{ border: 0, background: 'none', padding: 0, cursor: 'pointer' }}
          >
            <Logo />
          </Link>
          <nav className="ot-nav-tabs">
            <Link
              to="/feed"
              search={{}}
              className="ot-nav-tab"
              activeProps={{ className: 'ot-nav-tab active' }}
              inactiveProps={{ className: 'ot-nav-tab' }}
              onClick={handleFeedClick}
              style={{ position: 'relative' }}
            >
              <Icon name="feed" size={18} stroke={2.2} />
              <span>{t.feed}</span>
              {hasUnread && <span className="ot-nav-badge" />}
            </Link>
            <Link
              to="/analytics"
              className="ot-nav-tab"
              activeProps={{ className: 'ot-nav-tab active' }}
              inactiveProps={{ className: 'ot-nav-tab' }}
            >
              <Icon name="analytics" size={18} stroke={2.2} />
              <span>{t.analytics}</span>
            </Link>
            {currentUser && (
              <Link
                to="/calendar"
                className="ot-nav-tab"
                activeProps={{ className: 'ot-nav-tab active' }}
                inactiveProps={{ className: 'ot-nav-tab' }}
              >
                <Icon name="calendar" size={18} stroke={2.2} />
                <span>{t.calendar}</span>
              </Link>
            )}
            <Link
              to="/toplists"
              className="ot-nav-tab"
              activeProps={{ className: 'ot-nav-tab active' }}
              inactiveProps={{ className: 'ot-nav-tab' }}
            >
              <Icon name="bolt" size={18} stroke={2.2} />
              <span>{lang === 'fi' ? 'Top' : 'Top'}</span>
            </Link>
          </nav>
        </div>

        <form
          className="ot-search"
          onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) nav({ to: '/search', search: { q } });
          }}
        >
          <Icon name="search" size={17} stroke={2} style={{ color: 'var(--text-faint)' }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.search}
            aria-label={t.search}
          />
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/log" search={{}} className="ot-rec-btn" aria-label={t.record}>
            <span className="ot-rec-dot" />
            <Icon name="route" size={17} stroke={2.2} />
            <span className="ot-rec-label">{t.record}</span>
          </Link>

          <button
            type="button"
            className="ot-iconbtn"
            aria-label="Toggle theme"
            onClick={() => setTheme({ theme: theme.theme === 'dark' ? 'light' : 'dark' })}
          >
            <Icon name={theme.theme === 'dark' ? 'bolt' : 'flame'} size={18} />
          </button>

          <button
            type="button"
            className="ot-iconbtn"
            aria-label={`${lang.toUpperCase()} Language`}
            onClick={() => setLang(lang === 'fi' ? 'en' : 'fi')}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600 }}>
              {lang.toUpperCase()}
            </span>
          </button>

          {currentUser ? (
            <Link to="/profile" style={{ display: 'flex', padding: 2 }} aria-label={t.profile}>
              <Avatar
                initials={currentUser.avatarInitials}
                color={currentUser.avatarColor}
                size={32}
              />
            </Link>
          ) : (
            <Link to="/login" className="ot-iconbtn" aria-label={t.login}>
              <Icon name="user" size={20} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
