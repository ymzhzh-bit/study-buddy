import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function PDFViewer({ item }) {
  const { state } = useApp();
  const isAr = state.lang === 'ar';
  const totalPages = item.pages || 8;
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const stageRef = useRef(null);
  const pageRefs = useRef([]);

  useEffect(() => {
    const el = pageRefs.current[page - 1];
    if (el && stageRef.current) {
      stageRef.current.scrollTo({ top: el.offsetTop - 20, behavior: 'smooth' });
    }
  }, [page]);

  const onScroll = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const scrollTop = stage.scrollTop;
    let current = 1;
    pageRefs.current.forEach((el, i) => {
      if (el && el.offsetTop <= scrollTop + 100) {
        current = i + 1;
      }
    });
    if (current !== page) setPage(current);
  };

  const pagesContent = Array.from({ length: totalPages }, (_, i) => i + 1);
  const sampleText = isAr
    ? 'هذا نص توضيحي لمحتوى الصفحة. يتم استخدام النص العربي لإظهار قابلية التمثيل لمستندات PDF داخل عارض المتصفح.'
    : 'This is sample content text demonstrating how PDF documents are rendered inside the in-browser viewer.';

  return (
    <div className="pdf-viewer">
      <div className="pdf-viewer__toolbar">
        <div className="pdf-viewer__filename">
          <svg><use href="#icon-file-text"/></svg>
          <span>{isAr ? item.titleAr : item.title}.pdf</span>
        </div>
        <div className="pdf-viewer__nav">
          <button className="icon-btn" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
            <svg><use href="#icon-chevron-left"/></svg>
          </button>
          <span className="pdf-viewer__page-indicator">{page} / {totalPages}</span>
          <button className="icon-btn" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
            <svg><use href="#icon-chevron-right"/></svg>
          </button>
        </div>
        <div className="pdf-viewer__zoom">
          <button className="icon-btn" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>−</button>
          <span>{Math.round(zoom * 100)}%</span>
          <button className="icon-btn" onClick={() => setZoom(Math.min(2, zoom + 0.1))}>+</button>
        </div>
      </div>
      <div className="pdf-viewer__stage" ref={stageRef} onScroll={onScroll}>
        <div className="pdf-viewer__pages" style={{ '--pdf-zoom': zoom }}>
          {pagesContent.map((p) => (
            <div key={p} className="pdf-page" ref={(el) => (pageRefs.current[p - 1] = el)}>
              <div className="pdf-page__header">
                <div className="pdf-page__brand">
                  <div className="pdf-page__brand-logo">SB</div>
                  <div>
                    <div className="pdf-page__brand-title">{isAr ? 'ستادي بادي' : 'StudyBuddy'}</div>
                    <div className="pdf-page__brand-sub">{isAr ? 'ملخص دراسي' : 'Study Summary'}</div>
                  </div>
                </div>
                <div className="pdf-page__doc-meta">{isAr ? `صفحة ${p}` : `PAGE ${p}`}</div>
              </div>
              <div className="pdf-page__title-block">
                <span className="pdf-page__week">{isAr ? `الأسبوع ${Math.ceil(p / 2)}` : `WEEK ${Math.ceil(p / 2)}`}</span>
                <h1 className="pdf-page__title">{isAr ? item.titleAr : item.title}</h1>
                <div className="pdf-page__sub">{item.date}</div>
              </div>
              <div className="pdf-page__content">
                <p>{sampleText}</p>
                <h3 className="pdf-page__heading">{isAr ? 'النقاط الرئيسية' : 'Key Concepts'}</h3>
                <ul className="pdf-page__list">
                  <li>{isAr ? 'النقطة الأولى — شرح موجز' : 'First key point — brief explanation'}</li>
                  <li>{isAr ? 'النقطة الثانية — تفصيل إضافي' : 'Second key point — additional detail'}</li>
                  <li>{isAr ? 'النقطة الثالثة — مثال تطبيقي' : 'Third key point — practical example'}</li>
                </ul>
                <p>{sampleText}</p>
                <h3 className="pdf-page__heading">{isAr ? 'الخلاصة' : 'Summary'}</h3>
                <p>{sampleText}</p>
              </div>
              <div className="pdf-page__footer">
                <span>{isAr ? 'ستادي بادي · للاستخدام الأكاديمي' : 'StudyBuddy · Academic Use'}</span>
                <span>{p} / {totalPages}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
