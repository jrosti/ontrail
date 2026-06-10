import { Link } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Icon } from '../ui/Icon';
import { useStore } from '../../store';
import { I18N } from '../../i18n';
import { getUnread, markAllRead } from '../../api';

export function BottomNav() {
  const { lang, currentUser } = useStore();
  const t = I18N[lang];
  const qc = useQueryClient();
  const tab = (active: boolean) => ({ className: 'ot-bottom-tab' + (active ? ' active' : '') });

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

  const hasUnread = !!unread && unread.commentCount > 0;

  return (
    <nav className="ot-bottomnav">
      <Link
        to="/feed"
        search={{}}
        activeProps={tab(true)}
        inactiveProps={tab(false)}
        className="ot-bottom-tab"
        onClick={() => {
          if (hasUnread) markReadMutation.mutate();
        }}
        style={{ position: 'relative' }}
      >
        <Icon name="feed" size={22} stroke={2.1} />
        <span>{t.feed}</span>
        {hasUnread && <span className="ot-nav-badge" />}
      </Link>
      <Link
        to="/analytics"
        activeProps={tab(true)}
        inactiveProps={tab(false)}
        className="ot-bottom-tab"
      >
        <Icon name="analytics" size={22} stroke={2.1} />
        <span>{t.analytics}</span>
      </Link>
      <Link to="/log" search={{}} className="ot-bottom-fab" aria-label={t.record}>
        <Icon name="plus" size={24} stroke={2.6} />
      </Link>
      <Link
        to="/toplists"
        activeProps={tab(true)}
        inactiveProps={tab(false)}
        className="ot-bottom-tab"
      >
        <Icon name="bolt" size={22} stroke={2.1} />
        <span>{lang === 'fi' ? 'Top' : 'Top'}</span>
      </Link>
      <Link
        to="/profile"
        activeProps={tab(true)}
        inactiveProps={tab(false)}
        className="ot-bottom-tab"
      >
        <Icon name="user" size={22} stroke={2.1} />
        <span>{t.profile}</span>
      </Link>
    </nav>
  );
}
