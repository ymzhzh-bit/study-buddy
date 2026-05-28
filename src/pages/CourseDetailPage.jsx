import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COURSES, MAJORS } from '../data/courses';
import MaterialsTab from './materials/MaterialsTab';

export default function CourseDetailPage() {
  const { state, t, setView, setState } = useApp();
  const isAr = state.lang === 'ar';
  const course = COURSES.find(c => c.id === state.selectedCourseId) || COURSES[0];
  const major = MAJORS.find(m => m.id === course.majorId);
  const tab = state.detailTab || 'overview';

  const setTab = (newTab) => setState(p => ({...p, detailTab: newTab}));
  const goBack = () => setView(state.courseDetailFrom === 'major' ? 'major-detail' : 'courses');

  return (
    <div id="page-course-detail">
      <button className="major-hero__back" onClick={goBack}>
        <svg width="12" height="12"><use href="#icon-arrow-left"/></svg>
        {t('course.back')}
      </button>

      <div className="course-detail-hero">
        <div className="course-detail-hero__head">
          <div>
            <div className="course-detail-hero__code mono">{course.code}</div>
            <h2 className="course-detail-hero__name">{isAr ? course.nameAr : course.nameEn}</h2>
            <div className="course-detail-hero__instr">
              <svg width="14" height="14"><use href="#icon-user"/></svg>
              {course.instructor}
            </div>
          </div>
          <div className="course-detail-hero__meta">
            <div className="course-detail-hero__stat">
              <div className="lbl">{t('courses.progress')}</div>
              <div className="val mono">{course.progress}%</div>
            </div>
            <div className="course-detail-hero__stat">
              <div className="lbl">{t('courses.grade')}</div>
              <div className="val mono">{course.grade || '-'}</div>
            </div>
            <div className="course-detail-hero__stat">
              <div className="lbl">{t('courses.credits')}</div>
              <div className="val mono">{course.credits}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="course-tabs">
        {['overview', 'materials', 'chat', 'resources'].map(tk => (
          <button
            key={tk}
            className={`course-tab${tab === tk ? ' is-active' : ''}`}
            onClick={() => setTab(tk)}
          >
            {t(`course.tab.${tk}`)}
          </button>
        ))}
      </div>

      <div className="course-tab-content">
        {tab === 'overview' && <OverviewTab course={course} major={major} t={t} isAr={isAr}/>}
        {tab === 'materials' && <MaterialsTab course={course}/>}
        {tab === 'chat' && <ChatTab course={course} isAr={isAr}/>}
        {tab === 'resources' && <ResourcesTab course={course} isAr={isAr}/>}
      </div>
    </div>
  );
}

function OverviewTab({ course, major, t, isAr }) {
  return (
    <div className="overview-grid">
      <section className="card">
        <h3 className="card__title">{t('course.overview.instructor')}</h3>
        <div className="instructor-card">
          <div className="instructor-card__avatar">{course.instructor.split(' ').map(w=>w[0]).slice(-2).join('')}</div>
          <div>
            <div className="instructor-card__name">{course.instructor}</div>
            <div className="instructor-card__meta">{isAr ? major.nameAr : major.nameEn}</div>
          </div>
        </div>
      </section>
      <section className="card">
        <h3 className="card__title">{t('course.overview.schedule')}</h3>
        <ul className="syllabus-list">
          <li><span>{isAr ? 'الأحد' : 'Sunday'}</span><span className="mono">10:00 - 11:30</span></li>
          <li><span>{isAr ? 'الثلاثاء' : 'Tuesday'}</span><span className="mono">10:00 - 11:30</span></li>
        </ul>
      </section>
      <section className="card">
        <h3 className="card__title">{t('course.overview.progress')}</h3>
        <div className="progress-detail">
          <div className="progress-bar"><span style={{width:`${course.progress}%`}}/></div>
          <div className="progress-detail__label">{course.progress}% {isAr ? 'مكتمل' : 'completed'}</div>
        </div>
      </section>
      <section className="card" style={{gridColumn:'1 / -1'}}>
        <h3 className="card__title">{t('course.overview.syllabus')}</h3>
        <ul className="syllabus-list">
          {[1,2,3,4,5,6].map(w => (
            <li key={w}>
              <span>{isAr ? `الأسبوع ${w}` : `Week ${w}`}</span>
              <span>{['Introduction','Core Concepts','Methods','Practical','Advanced','Review'][w-1]}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ChatTab({ course, isAr }) {
  const [messages, setMessages] = useState([
    { id: 1, author: 'AK', authorName: 'Ahmed Karim', text: isAr ? 'مرحباً بالجميع!' : 'Hi everyone!', time: '10:30', isMe: false },
    { id: 2, author: 'YH', authorName: 'Youssef Hakim', text: isAr ? 'أهلاً، هل بدأنا في الفصل الثالث؟' : 'Hey, are we starting chapter 3?', time: '10:31', isMe: true },
    { id: 3, author: 'SM', authorName: 'Sara Mansour', text: isAr ? 'نعم، الواجب موعده الجمعة' : 'Yes, assignment is due Friday', time: '10:33', isMe: false },
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), author: 'YH', authorName: 'You', text: input, time: 'now', isMe: true }]);
    setInput('');
  };

  return (
    <div className="card chat chat--group">
      <header className="chat__group-header">
        <div className="chat__group-icon"><svg width="16" height="16"><use href="#icon-message-circle"/></svg></div>
        <div>
          <div className="chat__group-title">{course.code} {isAr ? 'مجموعة' : 'Group'}</div>
          <div className="chat__group-sub">{isAr ? '28 عضو · 5 متصلين' : '28 members · 5 online'}</div>
        </div>
        <div className="chat__group-avatars">
          {['AK','SM','YH','LF'].map(a => <div key={a} className="chat__group-av">{a}</div>)}
        </div>
      </header>
      <div className="chat__messages">
        <div className="chat__day-divider"><span>{isAr ? 'اليوم' : 'Today'}</span></div>
        {messages.map(m => (
          <div key={m.id} className={`chat__msg${m.isMe ? ' chat__msg--me' : ''}`}>
            <div className="chat__msg-avatar">{m.author}</div>
            <div className="chat__msg-body">
              <div className="chat__msg-meta">{m.authorName} · {m.time}</div>
              <div className="chat__msg-bubble">{m.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="chat__composer">
        <button className="icon-btn"><svg width="16" height="16"><use href="#icon-paperclip"/></svg></button>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') send(); }}
          placeholder={isAr ? 'اكتب رسالة...' : 'Type a message...'}
        />
        <button className="btn btn--primary btn--sm" onClick={send}>
          <svg width="14" height="14"><use href="#icon-send"/></svg>
        </button>
      </div>
    </div>
  );
}

function ResourcesTab({ course, isAr }) {
  const resources = [
    { icon: 'link', titleEn: 'Course Website', titleAr: 'موقع المقرر', url: '#' },
    { icon: 'file-text', titleEn: 'Recommended Textbook', titleAr: 'الكتاب الموصى به', url: '#' },
    { icon: 'video', titleEn: 'Recorded Lectures', titleAr: 'المحاضرات المسجلة', url: '#' },
    { icon: 'globe', titleEn: 'External Resources', titleAr: 'موارد خارجية', url: '#' },
  ];
  return (
    <div className="card">
      <h3 className="card__title">{isAr ? 'الموارد' : 'Resources'}</h3>
      <div className="file-list">
        {resources.map((r, i) => (
          <a key={i} className="file-row" href={r.url}>
            <div className="file-row__icon"><svg width="16" height="16"><use href={`#icon-${r.icon}`}/></svg></div>
            <div className="file-row__main">{isAr ? r.titleAr : r.titleEn}</div>
            <svg width="14" height="14"><use href="#icon-external-link"/></svg>
          </a>
        ))}
      </div>
    </div>
  );
}
