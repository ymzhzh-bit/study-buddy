import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  { key: 'dashboard', icon: 'home', labelKey: 'nav.dashboard' },
  { key: 'courses', icon: 'book-open', labelKey: 'nav.courses' },
  { key: 'majors', icon: 'layers', labelKey: 'nav.majors' },
  { key: 'meetings', icon: 'video', labelKey: 'nav.meetings' },
  { key: 'ai', icon: 'zap', labelKey: 'nav.ai' },
  { key: 'calendar', icon: 'calendar', labelKey: 'nav.calendar' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { state, t, setView } = useApp();

  const handleNav = (view) => {
    setView(view);
    onClose?.();
  };

  return (
    <>
      {isOpen && <div className="sidebar-backdrop is-open" onClick={onClose} />}
      <aside className={`sidebar${isOpen ? ' is-open' : ''}`}>
        <div className="sidebar__brand">
          <div className="sidebar__logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
            </svg>
          </div>
          <div className="sidebar__brand-text">
            <span className="sidebar__brand-name">StudyBuddy</span>
            <span className="sidebar__brand-sub">Academic Platform</span>
          </div>
        </div>

        <nav className="sidebar__nav">
          <div className="sidebar__nav-group">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                className={`nav-item${state.view === item.key ? ' is-active' : ''}`}
                onClick={() => handleNav(item.key)}
              >
                <svg className="nav-item__icon" width="18" height="18">
                  <use href={`#icon-${item.icon}`} />
                </svg>
                <span className="nav-item__label">{t(item.labelKey)}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="sidebar__footer">
          <button
            className={`nav-item${state.view === 'profile' ? ' is-active' : ''}`}
            onClick={() => handleNav('profile')}
          >
            <svg className="nav-item__icon" width="18" height="18">
              <use href="#icon-user" />
            </svg>
            <span className="nav-item__label">{t('nav.profile')}</span>
          </button>
          <button className="nav-item" onClick={() => setView('auth')}>
            <svg className="nav-item__icon" width="18" height="18">
              <use href="#icon-log-out" />
            </svg>
            <span className="nav-item__label">{state.lang === 'ar' ? 'تسجيل الخروج' : 'Sign out'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
