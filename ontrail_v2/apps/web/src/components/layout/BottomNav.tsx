import { Link } from '@tanstack/react-router';
import { Icon } from '../ui/Icon';
import { useStore } from '../../store';
import { I18N } from '../../i18n';

export function BottomNav() {
  const { lang } = useStore();
  const t = I18N[lang];
  const tab = (active: boolean) => ({ className: 'ot-bottom-tab' + (active ? ' active' : '') });
  return (
    <nav className="ot-bottomnav">
      <Link to="/feed" search={{}} activeProps={tab(true)} inactiveProps={tab(false)} className="ot-bottom-tab">
        <Icon name="feed" size={22} stroke={2.1} /><span>{t.feed}</span>
      </Link>
      <Link to="/analytics" activeProps={tab(true)} inactiveProps={tab(false)} className="ot-bottom-tab">
        <Icon name="analytics" size={22} stroke={2.1} /><span>{t.analytics}</span>
      </Link>
      <Link to="/log" search={{}} className="ot-bottom-fab" aria-label={t.record}>
        <Icon name="plus" size={24} stroke={2.6} />
      </Link>
      <Link to="/calendar" activeProps={tab(true)} inactiveProps={tab(false)} className="ot-bottom-tab">
        <Icon name="calendar" size={22} stroke={2.1} /><span>{t.calendar}</span>
      </Link>
      <Link to="/login" activeProps={tab(true)} inactiveProps={tab(false)} className="ot-bottom-tab">
        <Icon name="user" size={22} stroke={2.1} /><span>{t.login}</span>
      </Link>
    </nav>
  );
}
