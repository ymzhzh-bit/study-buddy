import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MAJORS } from '../data/courses';

const UNIS = [
  { id: 'kau', nameEn: 'King Abdullah University', nameAr: 'جامعة الملك عبدالله', subEn: 'KAUST · Jeddah', subAr: 'كاوست · جدة' },
  { id: 'ksu', nameEn: 'King Saud University', nameAr: 'جامعة الملك سعود', subEn: 'KSU · Riyadh', subAr: 'KSU · الرياض' },
  { id: 'kfupm', nameEn: 'King Fahd University', nameAr: 'جامعة الملك فهد', subEn: 'KFUPM · Dhahran', subAr: 'KFUPM · الظهران' },
];

function pwStrength(pw) {
  if (!pw) return -1;
  if (pw.length < 8) return 0;
  let s = 0;
  if (/[a-z]/.test(pw)) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^a-zA-Z0-9]/.test(pw)) s++;
  return Math.min(s, 4);
}

export default function AuthPage() {
  const { state, t, setView, setLang, toast } = useApp();
  const isAr = state.lang === 'ar';

  const [mode, setMode] = useState('login');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPw, setLoginPw] = useState('passworD12');
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [remember, setRemember] = useState(true);

  // Signup state
  const [step, setStep] = useState(1);
  const [suName, setSuName] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPw, setSuPw] = useState('');
  const [suPw2, setSuPw2] = useState('');
  const [showSuPw, setShowSuPw] = useState(false);
  const [terms, setTerms] = useState(false);
  const [suUni, setSuUni] = useState('');
  const [suMajor, setSuMajor] = useState('');
  const [suYear, setSuYear] = useState('');
  const [suGpa, setSuGpa] = useState('');
  const [errors, setErrors] = useState({});

  const strength = useMemo(() => pwStrength(suPw), [suPw]);

  const L = (ar, en) => (isAr ? ar : en);

  const resetSignup = () => {
    setStep(1);
    setSuName(''); setSuEmail(''); setSuPw(''); setSuPw2('');
    setShowSuPw(false); setTerms(false);
    setSuUni(''); setSuMajor(''); setSuYear(''); setSuGpa('');
    setErrors({});
  };

  const handleSignIn = (e) => {
    e?.preventDefault();
    setView('dashboard');
    toast(isAr ? 'مرحباً بعودتك!' : 'Welcome back!', 'success');
  };

  const validateStep1 = () => {
    const e = {};
    if (suName.trim().length < 2) e.name = L('الاسم قصير جداً', 'Name is too short');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(suEmail.trim())) e.email = L('بريد إلكتروني غير صحيح', 'Invalid email');
    if (suPw.length < 8) e.pw = L('يجب 8 أحرف على الأقل', 'At least 8 characters');
    else if (strength === 0) e.pw = L('كلمة المرور ضعيفة جداً', 'Password is too weak');
    if (suPw2 !== suPw) e.pw2 = L('كلمتا المرور غير متطابقتين', "Passwords don't match");
    if (!terms) {
      toast(L('يجب الموافقة على الشروط', 'You must accept the terms'), 'warning');
      setErrors(e);
      return false;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!suUni) {
      toast(L('اختر جامعتك أولاً', 'Please choose your university first'), 'warning');
      return false;
    }
    if (!suMajor) e.major = L('اختر تخصصاً', 'Please choose a major');
    if (!suYear) e.year = L('اختر مستواك الدراسي', 'Please choose your level');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goTo = (n) => {
    if (n > step) {
      if (step === 1 && !validateStep1()) return;
      if (step === 2 && !validateStep2()) return;
    }
    setStep(n);
  };

  const createAccount = () => {
    setStep(4);
  };

  const goToDashboard = () => {
    setView('dashboard');
    const firstName = suName.split(/\s+/)[0] || L('صديقي', 'friend');
    toast(L(`مرحباً بك يا ${firstName}!`, `Welcome, ${firstName}!`), 'success');
    setMode('login');
    resetSignup();
  };

  const strengthLabels = isAr
    ? ['ضعيفة جداً', 'ضعيفة', 'متوسطة', 'قوية', 'قوية جداً']
    : ['Too weak', 'Weak', 'Fair', 'Strong', 'Very strong'];
  const strengthPcts = [10, 25, 50, 75, 100];

  const reviewRows = () => {
    const uni = UNIS.find(u => u.id === suUni);
    const m = MAJORS.find(x => x.id === suMajor);
    const rows = [
      { lbl: L('الاسم', 'Name'), val: suName },
      { lbl: L('البريد الإلكتروني', 'Email'), val: suEmail, mono: true },
      { lbl: L('الجامعة', 'University'), val: uni ? (isAr ? uni.nameAr : uni.nameEn) : '—' },
      { lbl: L('التخصص', 'Major'), val: m ? (isAr ? m.nameAr : m.nameEn) : '—' },
      { lbl: L('السنة الدراسية', 'Academic Year'), val: suYear, mono: true },
    ];
    if (suGpa) rows.push({ lbl: L('المعدل', 'GPA'), val: suGpa, mono: true });
    return rows;
  };

  return (
    <section id="page-auth" className="page" style={{ padding: 0 }}>
      <div className="auth">
        {/* Feature side */}
        <div className="auth__feature">
          <div className="auth__feature-top">
            <div className="sidebar__logo" style={{ width: 32, height: 32 }}>SB</div>
            <div>
              <div className="sidebar__brand-name">StudyBuddy</div>
              <div className="sidebar__brand-sub">{isAr ? 'المنصة الأكاديمية' : 'Academic Platform'}</div>
            </div>
          </div>

          <div className="auth__feature-content">
            <span className="tag tag--accent" style={{ marginBottom: 'var(--s-5)' }}>
              {isAr ? 'منصة الطالب · 2025' : 'Student Platform · 2025'}
            </span>
            <h2>
              {isAr
                ? 'كل مواد الدراسة وأدوات الذكاء، في مكان واحد منظم.'
                : 'All your study materials and AI tools in one organized place.'}
            </h2>
            <p>
              {isAr
                ? 'نظّم محاضراتك، تابع المواعيد، وراجع المواد بمساعد ذكي مصمم لطلاب الجامعة.'
                : 'Organize lectures, track deadlines, and review materials with an AI assistant built for university students.'}
            </p>

            <div className="auth__feature-bullets">
              <div className="auth__feature-bullet">
                <span className="auth__feature-bullet-check"><svg width="10" height="10"><use href="#icon-check" /></svg></span>
                <span>{isAr ? 'متابعة 6 مواد بمعدل 3.85 من 4.0' : 'Track 6 courses with a 3.85 / 4.0 GPA'}</span>
              </div>
              <div className="auth__feature-bullet">
                <span className="auth__feature-bullet-check"><svg width="10" height="10"><use href="#icon-check" /></svg></span>
                <span>{isAr ? 'تنبيهات للمواعيد قبل 7 أيام' : 'Deadline alerts 7 days in advance'}</span>
              </div>
              <div className="auth__feature-bullet">
                <span className="auth__feature-bullet-check"><svg width="10" height="10"><use href="#icon-check" /></svg></span>
                <span>{isAr ? 'ملخصات وأسئلة تدريبية للمحاضرات' : 'AI summaries and practice quizzes for lectures'}</span>
              </div>
            </div>
          </div>

          <div className="auth__feature-foot">v 2.1.0 · StudyBuddy</div>
        </div>

        {/* Form side */}
        <div className="auth__form">
          {mode === 'login' && (
            <div className="auth__form-inner" data-auth-mode="login">
              <div className="auth__form-top">
                <div className="lang-switch" role="group" aria-label="Language">
                  <button className={state.lang === 'ar' ? 'is-active' : ''} onClick={() => setLang('ar')}>العربية</button>
                  <button className={state.lang === 'en' ? 'is-active' : ''} onClick={() => setLang('en')}>English</button>
                </div>
              </div>

              <h1>{t('auth.login.title')}</h1>
              <p className="auth__form-sub">{t('auth.login.sub')}</p>

              <form onSubmit={handleSignIn}>
                <div className="input-group">
                  <label className="input-label" htmlFor="auth-email">{t('auth.login.email')}</label>
                  <div className="input">
                    <svg width="14" height="14"><use href="#icon-user" /></svg>
                    <input
                      id="auth-email"
                      type="email"
                      placeholder="ahlan@studybuddy.com"
                      dir="ltr"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="auth-pw">{t('auth.login.password')}</label>
                  <div className="input">
                    <svg width="14" height="14"><use href="#icon-lock" /></svg>
                    <input
                      id="auth-pw"
                      type={showLoginPw ? 'text' : 'password'}
                      placeholder="••••••••••"
                      dir="ltr"
                      value={loginPw}
                      onChange={(e) => setLoginPw(e.target.value)}
                    />
                    <button
                      className="icon-btn"
                      type="button"
                      aria-label="Show password"
                      onClick={() => setShowLoginPw(s => !s)}
                    >
                      <svg width="14" height="14"><use href={`#icon-${showLoginPw ? 'eye-off' : 'eye'}`} /></svg>
                    </button>
                  </div>
                </div>

                <div className="auth__row">
                  <label className="auth__remember">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    <span>{t('auth.login.remember')}</span>
                  </label>
                  <a href="#" className="auth__forgot" onClick={(e) => e.preventDefault()}>
                    {t('auth.login.forgot')}
                  </a>
                </div>

                <button type="submit" className="btn btn--primary btn--block">
                  {t('auth.login.btn')}
                </button>
              </form>

              <p className="auth__switch" style={{ marginTop: 'var(--s-6)' }}>
                <span>{t('auth.login.switch')} </span>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); setMode('signup'); resetSignup(); }}
                >
                  {t('auth.login.switchlink')}
                </a>
              </p>
            </div>
          )}

          {mode === 'signup' && (
            <div className="auth__form-inner signup" data-auth-mode="signup">
              <div className="auth__form-top" style={{ justifyContent: 'space-between' }}>
                <button
                  className="auth__back-link"
                  type="button"
                  onClick={() => { setMode('login'); resetSignup(); }}
                >
                  <svg width="12" height="12"><use href="#icon-chevron-left" /></svg>
                  <span>{isAr ? 'العودة لتسجيل الدخول' : 'Back to sign in'}</span>
                </button>
                <div className="lang-switch" role="group" aria-label="Language">
                  <button className={state.lang === 'ar' ? 'is-active' : ''} onClick={() => setLang('ar')}>العربية</button>
                  <button className={state.lang === 'en' ? 'is-active' : ''} onClick={() => setLang('en')}>English</button>
                </div>
              </div>

              {/* Progress */}
              {step !== 4 && (
                <div className="signup-progress" aria-label="Signup progress">
                  <div className={`signup-progress__step${step === 1 ? ' is-active' : ''}${step > 1 ? ' is-done' : ''}`}>
                    <span className="signup-progress__num">1</span>
                    <span className="signup-progress__label">{isAr ? 'الحساب' : 'Account'}</span>
                  </div>
                  <div className={`signup-progress__bar${step > 1 ? ' is-done' : ''}`}><span></span></div>
                  <div className={`signup-progress__step${step === 2 ? ' is-active' : ''}${step > 2 ? ' is-done' : ''}`}>
                    <span className="signup-progress__num">2</span>
                    <span className="signup-progress__label">{isAr ? 'الأكاديمي' : 'Academic'}</span>
                  </div>
                  <div className={`signup-progress__bar${step > 2 ? ' is-done' : ''}`}><span></span></div>
                  <div className={`signup-progress__step${step === 3 ? ' is-active' : ''}${step > 3 ? ' is-done' : ''}`}>
                    <span className="signup-progress__num">3</span>
                    <span className="signup-progress__label">{isAr ? 'المراجعة' : 'Review'}</span>
                  </div>
                </div>
              )}

              {/* Step 1: Account */}
              {step === 1 && (
                <div className="signup-step is-active">
                  <h1>{t('auth.signup.title')}</h1>
                  <p className="auth__form-sub">{t('auth.signup.sub')}</p>

                  <div className="input-group">
                    <label className="input-label" htmlFor="su-name">{isAr ? 'الاسم الكامل' : 'Full Name'}</label>
                    <div className={`input${errors.name ? ' input--err' : ''}`}>
                      <svg width="14" height="14"><use href="#icon-user" /></svg>
                      <input
                        id="su-name"
                        type="text"
                        placeholder={isAr ? 'مثال: يوسف حكيم' : 'e.g. Youssef Hakim'}
                        value={suName}
                        onChange={(e) => { setSuName(e.target.value); if (errors.name) setErrors({ ...errors, name: undefined }); }}
                      />
                    </div>
                    {errors.name && <div className="input-error">{errors.name}</div>}
                  </div>

                  <div className="input-group">
                    <label className="input-label" htmlFor="su-email">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
                    <div className={`input${errors.email ? ' input--err' : ''}`}>
                      <svg width="14" height="14"><use href="#icon-user" /></svg>
                      <input
                        id="su-email"
                        type="email"
                        placeholder="ahlan@studybuddy.com"
                        dir="ltr"
                        value={suEmail}
                        onChange={(e) => { setSuEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: undefined }); }}
                      />
                    </div>
                    {errors.email && <div className="input-error">{errors.email}</div>}
                  </div>

                  <div className="input-group">
                    <label className="input-label" htmlFor="su-pw">{isAr ? 'كلمة المرور' : 'Password'}</label>
                    <div className={`input${errors.pw ? ' input--err' : ''}`}>
                      <svg width="14" height="14"><use href="#icon-lock" /></svg>
                      <input
                        id="su-pw"
                        type={showSuPw ? 'text' : 'password'}
                        placeholder="••••••••••"
                        dir="ltr"
                        value={suPw}
                        onChange={(e) => { setSuPw(e.target.value); if (errors.pw) setErrors({ ...errors, pw: undefined }); }}
                      />
                      <button
                        className="icon-btn"
                        type="button"
                        aria-label="Show password"
                        onClick={() => setShowSuPw(s => !s)}
                      >
                        <svg width="14" height="14"><use href={`#icon-${showSuPw ? 'eye-off' : 'eye'}`} /></svg>
                      </button>
                    </div>
                    {suPw && (
                      <div className={`pw-meter pw-meter--${strength < 0 ? 0 : strength}`} style={{ opacity: 1 }}>
                        <div className="pw-meter__bar">
                          <span style={{ width: `${strengthPcts[strength < 0 ? 0 : strength]}%` }}></span>
                        </div>
                        <div className="pw-meter__label">{strengthLabels[strength < 0 ? 0 : strength]}</div>
                      </div>
                    )}
                    {errors.pw && <div className="input-error">{errors.pw}</div>}
                  </div>

                  <div className="input-group">
                    <label className="input-label" htmlFor="su-pw2">{isAr ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
                    <div className={`input${errors.pw2 ? ' input--err' : ''}`}>
                      <svg width="14" height="14"><use href="#icon-lock" /></svg>
                      <input
                        id="su-pw2"
                        type="password"
                        placeholder="••••••••••"
                        dir="ltr"
                        value={suPw2}
                        onChange={(e) => { setSuPw2(e.target.value); if (errors.pw2) setErrors({ ...errors, pw2: undefined }); }}
                      />
                    </div>
                    {errors.pw2 && <div className="input-error">{errors.pw2}</div>}
                  </div>

                  <label className="auth__remember signup__terms">
                    <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
                    <span>
                      <span>{isAr ? 'أوافق على ' : 'I agree to the '}</span>
                      <a href="#" onClick={(e) => e.preventDefault()}>{isAr ? 'الشروط والأحكام' : 'Terms & Conditions'}</a>
                      <span>{isAr ? ' وسياسة الخصوصية' : ' and Privacy Policy'}</span>
                    </span>
                  </label>

                  <button
                    type="button"
                    className="btn btn--primary btn--block signup-step__next"
                    onClick={() => goTo(2)}
                  >
                    {isAr ? 'التالي' : 'Next'}
                  </button>

                  <p className="auth__switch" style={{ marginTop: 'var(--s-5)' }}>
                    <span>{t('auth.signup.switch')} </span>
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); setMode('login'); resetSignup(); }}
                    >
                      {t('auth.signup.switchlink')}
                    </a>
                  </p>
                </div>
              )}

              {/* Step 2: Academic */}
              {step === 2 && (
                <div className="signup-step is-active">
                  <h1>{isAr ? 'المعلومات الأكاديمية' : 'Academic Info'}</h1>
                  <p className="auth__form-sub">
                    {isAr ? 'اختر جامعتك ثم تخصصك ومستواك الدراسي.' : 'Pick your university, then major and academic year.'}
                  </p>

                  <div className="input-group">
                    <label className="input-label">{isAr ? 'الجامعة' : 'University'}</label>
                    <div className="signup-unis" role="radiogroup">
                      {UNIS.map(u => (
                        <button
                          key={u.id}
                          type="button"
                          className={`signup-uni${suUni === u.id ? ' is-active' : ''}`}
                          role="radio"
                          aria-checked={suUni === u.id}
                          onClick={() => setSuUni(u.id)}
                        >
                          <span className="signup-uni__icon"><svg width="16" height="16"><use href="#icon-graduation-cap" /></svg></span>
                          <span className="signup-uni__text">
                            <span className="signup-uni__name">{isAr ? u.nameAr : u.nameEn}</span>
                            <span className="signup-uni__sub">{isAr ? u.subAr : u.subEn}</span>
                          </span>
                          <span className="signup-uni__check"><svg width="11" height="11"><use href="#icon-check" /></svg></span>
                        </button>
                      ))}
                      <div className="signup-uni-note">
                        <svg width="12" height="12"><use href="#icon-info" /></svg>
                        <span>{isAr ? 'المزيد من الجامعات قريباً.' : 'More universities coming soon.'}</span>
                      </div>
                    </div>
                  </div>

                  {suUni && (
                    <div className="signup-conditional">
                      <div className="input-group">
                        <label className="input-label">{isAr ? 'التخصص' : 'Major'}</label>
                        <div className="signup-majors" role="radiogroup">
                          {MAJORS.map(m => (
                            <button
                              key={m.id}
                              type="button"
                              className={`signup-major${suMajor === m.id ? ' is-active' : ''}`}
                              role="radio"
                              aria-checked={suMajor === m.id}
                              onClick={() => { setSuMajor(m.id); if (errors.major) setErrors({ ...errors, major: undefined }); }}
                            >
                              <span className="signup-major__icon"><svg width="14" height="14"><use href={`#icon-${m.icon}`} /></svg></span>
                              <span className="signup-major__text">
                                <span className="signup-major__name">{isAr ? m.nameAr : m.nameEn}</span>
                                <span className="signup-major__desc">{isAr ? m.descAr : m.descEn}</span>
                              </span>
                              <span className="signup-major__check"><svg width="10" height="10"><use href="#icon-check" /></svg></span>
                            </button>
                          ))}
                        </div>
                        {errors.major && <div className="input-error">{errors.major}</div>}
                      </div>

                      <div className="signup-row">
                        <div className="input-group">
                          <label className="input-label" htmlFor="su-year">{isAr ? 'السنة الدراسية' : 'Academic Year'}</label>
                          <select
                            id="su-year"
                            className="select"
                            value={suYear}
                            onChange={(e) => { setSuYear(e.target.value); if (errors.year) setErrors({ ...errors, year: undefined }); }}
                          >
                            <option value="">{isAr ? '— اختر السنة —' : '— Select Year —'}</option>
                            <option value="1">{isAr ? 'السنة الأولى' : '1st Year'}</option>
                            <option value="2">{isAr ? 'السنة الثانية' : '2nd Year'}</option>
                            <option value="3">{isAr ? 'السنة الثالثة' : '3rd Year'}</option>
                            <option value="4">{isAr ? 'السنة الرابعة' : '4th Year'}</option>
                            <option value="5">{isAr ? 'السنة الخامسة' : '5th Year'}</option>
                          </select>
                          {errors.year && <div className="input-error">{errors.year}</div>}
                        </div>

                        <div className="input-group">
                          <label className="input-label" htmlFor="su-gpa">{isAr ? 'المعدل (اختياري)' : 'GPA (optional)'}</label>
                          <div className="input">
                            <input
                              id="su-gpa"
                              type="text"
                              placeholder="3.85"
                              dir="ltr"
                              value={suGpa}
                              onChange={(e) => setSuGpa(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="signup-step__nav">
                    <button className="btn btn--ghost" type="button" onClick={() => setStep(1)}>
                      {isAr ? 'رجوع' : 'Back'}
                    </button>
                    <button className="btn btn--primary" type="button" onClick={() => goTo(3)}>
                      {isAr ? 'التالي' : 'Next'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="signup-step is-active">
                  <h1>{isAr ? 'المراجعة والتأكيد' : 'Review & Confirm'}</h1>
                  <p className="auth__form-sub">
                    {isAr ? 'راجع بياناتك قبل إنشاء الحساب.' : 'Review your details before creating your account.'}
                  </p>

                  <div className="signup-review">
                    {reviewRows().map((r, i) => (
                      <div key={i} className="signup-review__row">
                        <span className="signup-review__lbl">{r.lbl}</span>
                        <span className={`signup-review__val${r.mono ? ' mono' : ''}`}>{r.val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="signup-step__nav">
                    <button className="btn btn--ghost" type="button" onClick={() => setStep(2)}>
                      {isAr ? 'رجوع' : 'Back'}
                    </button>
                    <button className="btn btn--primary" type="button" onClick={createAccount}>
                      {isAr ? 'إنشاء الحساب' : 'Create Account'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Done */}
              {step === 4 && (
                <div className="signup-step signup-step--done is-active">
                  <div className="signup-done__check">
                    <svg width="28" height="28"><use href="#icon-check" /></svg>
                  </div>
                  <h1>{isAr ? 'تم إنشاء حسابك بنجاح' : 'Your account is ready'}</h1>
                  <p className="auth__form-sub">
                    {isAr
                      ? `مرحباً بك يا ${suName.split(/\s+/)[0] || 'صديقي'}! حسابك جاهز.`
                      : `Welcome, ${suName.split(/\s+/)[0] || 'friend'}! Your account is ready.`}
                  </p>
                  <button className="btn btn--primary btn--block" type="button" onClick={goToDashboard}>
                    {isAr ? 'الانتقال إلى لوحة التحكم' : 'Go to Dashboard'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
