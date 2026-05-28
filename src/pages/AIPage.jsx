import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { COURSES } from '../data/courses';

const RESPONSES = {
  en: {
    explain: 'Affordances refer to the perceived and actual properties of an object that suggest how it can be used. For example, a button affords pressing, a handle affords pulling. Don Norman expanded this concept for HCI, distinguishing between perceived affordances (what users think they can do) and actual affordances (what is truly possible).',
    quiz: "Here's a quick quiz on HCI:\n\n1. Which principle describes properties of an object that suggest how it should be used?\n   a) Mapping\n   b) Affordance\n   c) Feedback\n\n2. What is Miller's Magic Number?\n   a) 5±2\n   b) 7±2\n   c) 10±2\n\nReply with your answers!",
    plan: "Here's a personalized 7-day study plan for finals:\n\n• Day 1-2: Review lecture notes + create mind maps\n• Day 3: Practice problems for HCI 301\n• Day 4: Group study session for CS 201\n• Day 5: Take practice exams\n• Day 6: Focus on weak areas\n• Day 7: Light review + rest\n\nWould you like me to add these to your calendar?",
    summary: "Here's a summary of your recent HCI materials:\n\n• Affordances & Signifiers — Properties that hint at usage\n• Mental Models — User's internal representation of systems\n• Fitts's Law — Time to acquire targets depends on distance and size\n• Nielsen's 10 Heuristics — Industry standard usability principles\n\nWant me to dive deeper into any of these?",
  },
  ar: {
    explain: 'تشير "المنح" (Affordances) إلى الخصائص المُدركة والفعلية للشيء التي توحي بكيفية استخدامه. مثلاً، الزر يمنح الضغط، والمقبض يمنح السحب. وسّع دون نورمان هذا المفهوم في تفاعل الإنسان والحاسب، مميزاً بين المنح المُدركة (ما يعتقد المستخدمون أنهم يستطيعون فعله) والمنح الفعلية (ما هو ممكن حقاً).',
    quiz: 'إليك اختباراً سريعاً في HCI:\n\n1. أي مبدأ يصف خصائص الشيء التي توحي بكيفية استخدامه؟\n   أ) التخطيط\n   ب) المنح\n   ج) التغذية الراجعة\n\n2. ما هو رقم ميلر السحري؟\n   أ) 5±2\n   ب) 7±2\n   ج) 10±2\n\nأرسل إجاباتك!',
    plan: 'إليك خطة دراسية مخصصة لمدة 7 أيام للامتحانات النهائية:\n\n• اليوم 1-2: مراجعة ملاحظات المحاضرات + إنشاء خرائط ذهنية\n• اليوم 3: حل تمارين HCI 301\n• اليوم 4: جلسة دراسية جماعية لـ CS 201\n• اليوم 5: إجراء امتحانات تدريبية\n• اليوم 6: التركيز على النقاط الضعيفة\n• اليوم 7: مراجعة خفيفة + راحة\n\nهل تود أن أضيف هذه إلى تقويمك؟',
    summary: 'إليك ملخص لموادك الأخيرة في HCI:\n\n• المنح والدوال — خصائص تلمح إلى الاستخدام\n• النماذج الذهنية — التمثيل الداخلي للمستخدم للأنظمة\n• قانون فيتس — وقت الوصول للهدف يعتمد على المسافة والحجم\n• مبادئ نيلسن العشرة — المعايير الصناعية لقابلية الاستخدام\n\nهل تريد التعمق في أي منها؟',
  },
};

const fmtTime = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

export default function AIPage() {
  const { state, t, toast } = useApp();
  const isAr = state.lang === 'ar';
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('chat');
  const [typing, setTyping] = useState(false);
  const [activeConvId, setActiveConvId] = useState(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, typing]);

  const convs = [
    { id: 'today', label: t('ai.today'), items: [
      { id: 'c1', title: isAr ? 'شرح مبادئ UX' : 'Explain UX principles', time: '14:30' },
      { id: 'c2', title: isAr ? 'اختبار HCI سريع' : 'Quick HCI quiz', time: '11:08' },
    ]},
    { id: 'yesterday', label: t('ai.yesterday'), items: [
      { id: 'c3', title: isAr ? 'خطة دراسة HCI' : 'HCI Study Plan', time: '21:15' },
      { id: 'c4', title: isAr ? 'مفاهيم التعلم الآلي' : 'ML concepts', time: '15:42' },
    ]},
  ];

  const newConv = () => {
    setActiveConvId(null);
    setMessages([]);
  };

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg = { id: Date.now(), role: 'user', text: trimmed, time: fmtTime() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const lower = trimmed.toLowerCase();
      let resp;
      if (lower.includes('quiz') || trimmed.includes('اختبر')) resp = RESPONSES[state.lang].quiz;
      else if (lower.includes('plan') || trimmed.includes('خطة')) resp = RESPONSES[state.lang].plan;
      else if (lower.includes('summar') || trimmed.includes('ملخص') || trimmed.includes('لخّص') || trimmed.includes('لخص')) resp = RESPONSES[state.lang].summary;
      else resp = RESPONSES[state.lang].explain;
      setTyping(false);
      setMessages(m => [...m, { id: Date.now() + 1, role: 'ai', text: resp, time: fmtTime() }]);
    }, 900);
  };

  const handleSend = () => sendMessage(input);

  const suggests = [
    { key: 'explain', icon: 'book', prompt: isAr ? 'اشرح مفهوم المنح في UX' : 'Explain the concept of affordances in UX' },
    { key: 'quiz', icon: 'edit-2', prompt: isAr ? 'اختبرني في مفاهيم HCI' : 'Quiz me on HCI concepts' },
    { key: 'plan', icon: 'calendar', prompt: isAr ? 'أنشئ خطة دراسة للامتحانات' : 'Create a study plan for finals' },
    { key: 'summary', icon: 'file-text', prompt: isAr ? 'لخّص ملاحظاتي في HCI' : 'Summarize my HCI notes' },
  ];

  const copyMsg = (text) => {
    if (navigator.clipboard) navigator.clipboard.writeText(text);
    toast(isAr ? 'تم النسخ' : 'Copied', 'success');
  };

  return (
    <div className="ai-shell">
      <aside className="ai-rail">
        <button className="btn btn--primary btn--block" onClick={newConv}>
          <svg width="14" height="14"><use href="#icon-plus"/></svg> {t('ai.new')}
        </button>
        <div className="ai-rail__search">
          <svg><use href="#icon-search"/></svg>
          <input placeholder={t('ai.search')}/>
        </div>
        {convs.map(group => (
          <div key={group.id} className="ai-rail__group">
            <div className="ai-rail__group-label">{group.label}</div>
            {group.items.map(item => (
              <button
                key={item.id}
                className={`ai-conv-item${activeConvId === item.id ? ' is-active' : ''}`}
                onClick={() => setActiveConvId(item.id)}
              >
                <div className="ai-conv-item__title">{item.title}</div>
                <div className="ai-conv-item__time">{item.time}</div>
              </button>
            ))}
          </div>
        ))}
        <div className="ai-rail__group">
          <div className="ai-rail__group-label">{t('ai.context')}</div>
          <div className="ai-context">
            {COURSES.slice(0, 4).map(c => (
              <button key={c.id} className="ai-context__row">
                <svg><use href="#icon-book-open"/></svg>
                <span>{isAr ? c.nameAr : c.nameEn}</span>
                <span className="ai-context__code">{c.code}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <section className="ai-conv">
        <header className="ai-conv__header">
          <div className="ai-conv__title-wrap">
            <h3>{t('ai.title')}</h3>
            <span className="ai-conv__badge">Claude 4.7</span>
          </div>
        </header>
        <div className="ai-conv__body" ref={bodyRef}>
          {messages.length === 0 ? (
            <div className="ai-intro">
              <div className="ai-intro__spark"><svg><use href="#icon-sparkles"/></svg></div>
              <h4>{t('ai.intro.title')}</h4>
              <p>{t('ai.intro.desc')}</p>
              <div className="ai-suggest-grid">
                {suggests.map(s => (
                  <button key={s.key} className="ai-suggest" onClick={() => sendMessage(s.prompt)}>
                    <div className="ai-suggest__icon"><svg><use href={`#icon-${s.icon}`}/></svg></div>
                    <div className="ai-suggest__title">{t(`ai.suggest.${s.key}.title`)}</div>
                    <div className="ai-suggest__desc">{t(`ai.suggest.${s.key}.desc`)}</div>
                  </button>
                ))}
              </div>
              <div className="ai-tips">
                <span className="ai-tips__label">{t('ai.tips.label')}</span>
                {['ai.tip.1','ai.tip.2','ai.tip.3'].map(k => (
                  <button key={k} className="ai-tip" onClick={() => sendMessage(t(k))}>{t(k)}</button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map(m => (
                <div key={m.id} className={`ai-msg${m.role === 'user' ? ' ai-msg--user' : ''}`}>
                  <div className="ai-msg__avatar">{m.role === 'user' ? 'YH' : 'AI'}</div>
                  <div className="ai-msg__main">
                    <div className="ai-msg__name">{m.role === 'user' ? t('ai.you') : 'Claude'} <time>{m.time}</time></div>
                    <div className="ai-msg__bubble">{m.text}</div>
                    {m.role === 'ai' && (
                      <div className="ai-msg__actions">
                        <button className="ai-msg__act" onClick={() => copyMsg(m.text)}>{t('ai.copy')}</button>
                        <button className="ai-msg__act">{t('ai.regen')}</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="ai-msg">
                  <div className="ai-msg__avatar">AI</div>
                  <div className="ai-msg__main">
                    <div className="ai-msg__bubble"><div className="ai-typing"><span/><span/><span/></div></div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="ai-composer">
          <div className="ai-composer__bar">
            <button className="ai-composer__attach"><svg><use href="#icon-paperclip"/></svg></button>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={t('ai.placeholder')}
              rows={1}
            />
            <button className="btn btn--primary btn--sm ai-composer__send" onClick={handleSend}>
              <svg width="14" height="14"><use href="#icon-send"/></svg>
              <span>{t('ai.send')}</span>
            </button>
          </div>
          <div className="ai-composer__chips">
            {['chat','explain','quiz','summary'].map(m => (
              <button key={m} className={`ai-mode-chip${mode === m ? ' is-active' : ''}`} onClick={() => setMode(m)}>
                {t(`ai.mode.${m}`)}
              </button>
            ))}
            <span className="ai-composer__hint">↵ {isAr ? 'للإرسال' : 'to send'}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
