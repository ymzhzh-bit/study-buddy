import { useApp } from '../context/AppContext';
import Notifications from './Notifications';

const PAGE_TITLES = {
  dashboard: { en: 'Dashboard', ar: 'الرئيسية', sub: { en: 'Spring 2025 · GPA 3.78', ar: 'الفصل الربيعي 2025 · المعدل 3.78' } },
  courses: { en: 'My Courses', ar: 'مقرراتي', sub: { en: '6 enrolled this semester', ar: '6 مقررات مسجّلة هذا الفصل' } },
  majors: { en: 'Majors', ar: 'التخصصات', sub: { en: 'Explore academic programs', ar: 'استكشف البرامج الأكاديمية' } },
  'major-detail': { en: 'Major Detail', ar: 'تفاصيل التخصص', sub: { en: '', ar: '' } },
  'course-detail': { en: 'Course Detail', ar: 'تفاصيل المقرر', sub: { en: '', ar: '' } },
  profile: { en: 'My Profile', ar: 'ملفي الشخصي', sub: { en: 'Manage your information', ar: 'إدارة معلوماتك الشخصية' } },
  meetings: { en: 'Meetings', ar: 'الاجتماعات', sub: { en: 'Upcoming sessions & rooms', ar: 'الجلسات القادمة والغرف' } },
  ai: { en: 'AI Assistant', ar: 'المساعد الذكي', sub: { en: 'Powered by Claude', ar: 'مدعوم بكلود' } },
  calendar: { en: 'Calendar', ar: 'التقويم', sub: { en: 'Your schedule & events', ar: 'جدولك والأحداث' } },
};

export default function Topbar({ onMenuClick }) {
  const { state, setLang, setTheme } = useApp();
  const isAr = state.lang === 'ar';
  const page = PAGE_TITLES[state.view] || PAGE_TITLES.dashboard;

  return (
    <header className="topbar">
      <button className="topbar__menu icon-btn" onClick={onMenuClick} aria-label="Menu">
        <svg width="18" height="18"><use href="#icon-menu" /></svg>
      </button>

      <div className="topbar__title">
        <h1>{isAr ? page.ar : page.en}</h1>
        {(isAr ? page.sub.ar : page.sub.en) && (
          <p>{isAr ? page.sub.ar : page.sub.en}</p>
        )}
      </div>

      <div className="topbar__search-wrap" style={{ flex: 1, maxWidth: 360, minWidth: 120 }}>
        <div className="search">
          <svg width="16" height="16"><use href="#icon-search" /></svg>
          <input type="text" placeholder={isAr ? 'ابحث…' : 'Search…'} />
          <kbd className="kbd">{isAr ? 'K ⌘' : '⌘K'}</kbd>
        </div>
      </div>

      <div className="topbar__actions">
        <div className="lang-switch">
          <button
            className={state.lang === 'en' ? 'is-active' : ''}
            onClick={() => setLang('en')}
          >EN</button>
          <button
            className={state.lang === 'ar' ? 'is-active' : ''}
            onClick={() => setLang('ar')}
          >AR</button>
        </div>

        <button
          className="icon-btn"
          onClick={() => setTheme(state.theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          {state.theme === 'dark' ? (
            <svg width="18" height="18"><use href="#icon-sun" /></svg>
          ) : (
            <svg width="18" height="18"><use href="#icon-moon" /></svg>
          )}
        </button>

        <Notifications />

        <div className="topbar__avatar">YH</div>
      </div>
    </header>
  );
}
