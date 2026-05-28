import { useApp } from '../context/AppContext';
import { MAJORS, CATALOG } from '../data/courses';

export default function MajorsPage() {
  const { state, t, setView, setState } = useApp();
  const isAr = state.lang === 'ar';

  const openMajor = (id) => {
    setState(p => ({ ...p, selectedMajorId: id }));
    setView('major-detail');
  };

  return (
    <>
      <div className="page__header">
        <div>
          <h2 className="page__title">{t('majors.title')}</h2>
          <p className="page__sub">{t('majors.explore')}</p>
        </div>
      </div>

      <div className="majors-grid">
        {MAJORS.map(m => {
          const courseCount = CATALOG.filter(c => c.majorId === m.id).length;
          return (
            <button key={m.id} className="major-card" onClick={() => openMajor(m.id)}>
              <div className="major-card__icon"><svg width="24" height="24"><use href={`#icon-${m.icon}`}/></svg></div>
              <h3 className="major-card__name">{isAr ? m.nameAr : m.nameEn}</h3>
              <p className="major-card__desc">{isAr ? m.descAr : m.descEn}</p>
              <div className="major-card__stats">
                <div className="major-card__stat"><span className="mono">{m.courses}</span> {t('majors.courses')}</div>
                <div className="major-card__stat"><span className="mono">{m.credits}</span> {t('majors.credits')}</div>
                <div className="major-card__stat"><span className="mono">{m.students}</span> {t('majors.enrolled')}</div>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
