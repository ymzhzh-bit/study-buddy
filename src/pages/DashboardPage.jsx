import { useApp } from '../context/AppContext';
import { COURSES, PROFILE } from '../data/courses';
import { EVENTS } from '../data/events';

export default function DashboardPage({ onAddCourse }) {
  const { state, t, setView } = useApp();
  const isAr = state.lang === 'ar';

  const NOW = new Date();
  const today = EVENTS
    .filter(e => {
      const d = e.start;
      return d.getFullYear() === NOW.getFullYear() &&
             d.getMonth() === NOW.getMonth() &&
             d.getDate() === NOW.getDate() &&
             e.type !== 'deadline';
    })
    .sort((a,b) => a.start - b.start);

  const deadlines = EVENTS
    .filter(e => e.type === 'deadline' && e.start >= NOW)
    .sort((a,b) => a.start - b.start)
    .slice(0, 4);

  const fmtTime = d => {
    const h = d.getHours();
    const m = d.getMinutes();
    const ampm = h < 12 ? 'AM' : 'PM';
    const hh = ((h + 11) % 12) + 1;
    return { hour: `${hh}:${String(m).padStart(2,'0')}`, ampm };
  };

  const monthShort = d => isAr
    ? ['ينا','فبر','مار','أبر','ماي','يون','يول','أغس','سبت','أكت','نوف','ديس'][d.getMonth()]
    : ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][d.getMonth()];

  const daysLeft = d => Math.ceil((d - NOW) / 86400000);

  return (
    <>
      <div className="welcome-row">
        <div>
          <h2>{t('dashboard.welcome')}, {isAr ? PROFILE.nameAr : PROFILE.nameEn.split(' ')[0]}</h2>
          <p>{isAr ? 'إليك ملخص يومك الأكاديمي.' : "Here's a snapshot of your academic day."}</p>
        </div>
        <span className="semester-tag">{t('dashboard.semester')}</span>
      </div>

      <div className="stats-strip">
        <div className="stat">
          <div className="stat__label">{t('dashboard.stat.gpa')}</div>
          <div className="stat__value mono">3.78</div>
          <div className="stat__delta is-up">▲ 0.12</div>
        </div>
        <div className="stat">
          <div className="stat__label">{t('dashboard.stat.courses')}</div>
          <div className="stat__value mono">{COURSES.length}</div>
          <div className="stat__delta">{isAr ? 'هذا الفصل' : 'this term'}</div>
        </div>
        <div className="stat">
          <div className="stat__label">{t('dashboard.stat.credits')}</div>
          <div className="stat__value mono">{COURSES.reduce((s,c) => s + c.credits, 0)}</div>
          <div className="stat__delta">{isAr ? 'مسجّلة' : 'enrolled'}</div>
        </div>
        <div className="stat">
          <div className="stat__label">{t('dashboard.stat.rank')}</div>
          <div className="stat__value mono">#12</div>
          <div className="stat__delta is-up">▲ 3</div>
        </div>
      </div>

      <div className="grid-2-1">
        <section className="card">
          <header className="card__header">
            <div>
              <h3 className="card__title">{t('dashboard.schedule.title')}</h3>
              <p className="card__sub">{isAr ? `${today.length} محاضرات` : `${today.length} sessions`}</p>
            </div>
            <button className="btn btn--ghost btn--sm" onClick={() => setView('calendar')}>{isAr ? 'عرض الكل' : 'View all'}</button>
          </header>
          <div className="schedule-list">
            {today.length === 0 ? (
              <div className="empty-state">
                <svg><use href="#icon-calendar"/></svg>
                <p>{t('dashboard.schedule.empty')}</p>
              </div>
            ) : today.map(e => {
              const time = fmtTime(e.start);
              return (
                <div key={e.id} className="schedule-item">
                  <div className="schedule-item__time">
                    <div className="schedule-item__time-hour">{time.hour}</div>
                    <div className="schedule-item__time-day">{time.ampm}</div>
                  </div>
                  <div className="schedule-item__main">
                    <div className="schedule-item__course-name">{isAr ? e.titleAr : e.titleEn}</div>
                    <div className="schedule-item__course-meta">{isAr ? e.host : e.hostEn}</div>
                  </div>
                  <span className={`tag tag--${e.type}`}>{t(`calendar.type.${e.type}`)}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="card">
          <header className="card__header"><h3 className="card__title">{t('dashboard.deadlines.title')}</h3></header>
          <div className="deadline-list">
            {deadlines.map(d => (
              <div key={d.id} className="deadline-item">
                <div className="deadline-item__date">
                  <div className="deadline-item__date-day">{d.start.getDate()}</div>
                  <div className="deadline-item__date-month">{monthShort(d.start)}</div>
                </div>
                <div className="deadline-item__main">
                  <div className="deadline-item__title">{isAr ? d.titleAr : d.titleEn}</div>
                  <div className="deadline-item__meta">{daysLeft(d.start)} {isAr ? 'أيام متبقية' : 'days left'}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="ai-strip">
        <div className="ai-strip__left">
          <div className="ai-strip__icon"><svg width="22" height="22"><use href="#icon-sparkles"/></svg></div>
          <div>
            <div className="ai-strip__title">{t('dashboard.ai.title')}</div>
            <div className="ai-strip__desc">{t('dashboard.ai.desc')}</div>
          </div>
        </div>
        <button id="dash-open-ai" className="btn btn--primary" onClick={() => setView('ai')}>{t('dashboard.ai.btn')}</button>
      </div>

      <div className="card">
        <header className="card__header"><h3 className="card__title">{t('dashboard.quick.title')}</h3></header>
        <div className="quick-grid">
          <button className="quick-tile" onClick={onAddCourse}>
            <svg width="20" height="20"><use href="#icon-plus"/></svg>
            <span>{t('dashboard.quick.add')}</span>
          </button>
          <button className="quick-tile" onClick={() => setView('ai')}>
            <svg width="20" height="20"><use href="#icon-zap"/></svg>
            <span>{t('dashboard.quick.ai')}</span>
          </button>
          <button className="quick-tile" onClick={() => setView('calendar')}>
            <svg width="20" height="20"><use href="#icon-calendar"/></svg>
            <span>{t('dashboard.quick.calendar')}</span>
          </button>
          <button className="quick-tile" onClick={() => setView('courses')}>
            <svg width="20" height="20"><use href="#icon-file-text"/></svg>
            <span>{t('dashboard.quick.materials')}</span>
          </button>
        </div>
      </div>

      <div className="card">
        <header className="card__header"><h3 className="card__title">{t('dashboard.analytics.title')}</h3></header>
        <div className="dash-analytics-grid">
          <div className="dash-analytics-cell">
            <div className="dash-analytics-cell__label">{isAr ? 'ساعات الدراسة/أسبوع' : 'Study hours / week'}</div>
            <div className="dash-analytics-cell__value mono">24h</div>
            <div className="dash-analytics-cell__bar"><span style={{width:'70%'}}/></div>
          </div>
          <div className="dash-analytics-cell">
            <div className="dash-analytics-cell__label">{isAr ? 'الواجبات المكتملة' : 'Assignments completed'}</div>
            <div className="dash-analytics-cell__value mono">82%</div>
            <div className="dash-analytics-cell__bar"><span style={{width:'82%'}}/></div>
          </div>
          <div className="dash-analytics-cell">
            <div className="dash-analytics-cell__label">{isAr ? 'الحضور' : 'Attendance'}</div>
            <div className="dash-analytics-cell__value mono">94%</div>
            <div className="dash-analytics-cell__bar"><span style={{width:'94%'}}/></div>
          </div>
        </div>
      </div>

      <div className="card">
        <header className="card__header"><h3 className="card__title">{t('dashboard.activity.title')}</h3></header>
        <ul className="activity-list">
          <li className="activity-item">
            <div className="activity-item__icon"><svg width="14" height="14"><use href="#icon-check"/></svg></div>
            <div className="activity-item__body">
              <div className="activity-item__title">{isAr ? 'سلّمت واجب HCI 2' : 'Submitted HCI Assignment 2'}</div>
              <div className="activity-item__meta">{isAr ? 'منذ ساعتين' : '2 hours ago'}</div>
            </div>
          </li>
          <li className="activity-item">
            <div className="activity-item__icon"><svg width="14" height="14"><use href="#icon-award"/></svg></div>
            <div className="activity-item__body">
              <div className="activity-item__title">{isAr ? 'حصلت على A- في اختبار DS' : 'Earned A- on DS Quiz'}</div>
              <div className="activity-item__meta">{isAr ? 'أمس' : 'Yesterday'}</div>
            </div>
          </li>
          <li className="activity-item">
            <div className="activity-item__icon"><svg width="14" height="14"><use href="#icon-file-text"/></svg></div>
            <div className="activity-item__body">
              <div className="activity-item__title">{isAr ? 'مادة جديدة في CS 201' : 'New material in CS 201'}</div>
              <div className="activity-item__meta">{isAr ? 'منذ يومين' : '2 days ago'}</div>
            </div>
          </li>
          <li className="activity-item">
            <div className="activity-item__icon"><svg width="14" height="14"><use href="#icon-message-circle"/></svg></div>
            <div className="activity-item__body">
              <div className="activity-item__title">{isAr ? 'رسالة جديدة من مجموعة HCI' : 'New message in HCI group chat'}</div>
              <div className="activity-item__meta">{isAr ? 'منذ 3 أيام' : '3 days ago'}</div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}
