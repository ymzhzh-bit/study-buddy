import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CATALOG, COURSES } from '../data/courses';

export default function CatalogModal({ open, onClose }) {
  const { state, t, toast } = useApp();
  const isAr = state.lang === 'ar';
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [addedIds, setAddedIds] = useState(new Set());

  const filtered = useMemo(() => {
    return CATALOG.filter(c => {
      if (levelFilter !== 'all' && c.level !== levelFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return c.code.toLowerCase().includes(q) ||
               c.nameEn.toLowerCase().includes(q) ||
               c.nameAr.includes(search);
      }
      return true;
    });
  }, [search, levelFilter]);

  const handleAdd = (course) => {
    setAddedIds(prev => new Set([...prev, course.id]));
    toast(t('toast.course.added'), 'success');
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal modal--wide catalog-modal">
        <header className="modal__header">
          <h3 className="modal__title">{t('catalog.title')}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <svg width="16" height="16"><use href="#icon-x"/></svg>
          </button>
        </header>
        <div className="modal__body">
          <div className="catalog-toolbar">
            <div className="search">
              <svg width="14" height="14"><use href="#icon-search"/></svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('catalog.search')}
              />
            </div>
            <div className="filter-chips">
              {['all', 100, 200, 300, 400].map(l => (
                <button
                  key={l}
                  className={`filter-chip${levelFilter === l ? ' is-active' : ''}`}
                  onClick={() => setLevelFilter(l)}
                >
                  {l === 'all' ? t('catalog.filter.all') : t(`catalog.filter.${l}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="catalog-list">
            {filtered.map(c => {
              const added = addedIds.has(c.id);
              return (
                <div key={c.id} className="catalog-row">
                  <div className="catalog-row__main">
                    <div className="catalog-row__code">{c.code}</div>
                    <div className="catalog-row__name">{isAr ? c.nameAr : c.nameEn}</div>
                    <div className="catalog-row__meta">
                      {c.instructor} · {c.credits} {t('courses.credits')} · {c.students} {isAr ? 'طالب' : 'students'}
                    </div>
                  </div>
                  <button
                    className={`btn ${added ? 'btn--ghost' : 'btn--primary'} btn--sm`}
                    disabled={added}
                    onClick={() => handleAdd(c)}
                  >
                    {added ? (<>
                      <svg width="12" height="12"><use href="#icon-check"/></svg> {t('catalog.added')}
                    </>) : (<>
                      <svg width="12" height="12"><use href="#icon-plus"/></svg> {t('catalog.add')}
                    </>)}
                  </button>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="empty-state">{isAr ? 'لا توجد نتائج' : 'No results'}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
