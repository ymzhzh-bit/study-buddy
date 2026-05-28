import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PROFILE, MAJORS } from '../data/courses';

function FieldRow({ field, label, value, icon, isEditing, tempValue, onStartEdit, onChange, onSave, onCancel, readOnly = false }) {
  return (
    <div className="field-row">
      <div className="field-row__label">
        {icon && <svg width="14" height="14"><use href={`#icon-${icon}`}/></svg>}
        {label}
      </div>
      <div className="field-row__value">
        {isEditing ? (
          <input
            className="field-row__input"
            value={tempValue}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSave();
              if (e.key === 'Escape') onCancel();
            }}
            autoFocus
          />
        ) : (
          <span>{value}</span>
        )}
      </div>
      {!readOnly && (
        isEditing ? (
          <div className="field-row__actions" style={{ display: 'inline-flex', gap: 'var(--s-1)' }}>
            <button className="icon-btn" onClick={onSave}>
              <svg width="14" height="14"><use href="#icon-check"/></svg>
            </button>
            <button className="icon-btn" onClick={onCancel}>
              <svg width="14" height="14"><use href="#icon-x"/></svg>
            </button>
          </div>
        ) : (
          <button className="icon-btn" onClick={() => onStartEdit(field, value)}>
            <svg width="14" height="14"><use href="#icon-edit-2"/></svg>
          </button>
        )
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { state, t, setLang, setTheme, toast } = useApp();
  const isAr = state.lang === 'ar';
  const [profile, setProfile] = useState(PROFILE);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  const startEdit = (field, currentValue) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const saveEdit = () => {
    const field = editingField;
    if (!field) return;
    const updates = { [field]: tempValue };
    if (field === 'nameEn' && isAr) updates.nameAr = tempValue;
    if (field === 'bio' && isAr) updates.bioAr = tempValue;
    setProfile({ ...profile, ...updates });
    setEditingField(null);
    toast(isAr ? 'تم الحفظ' : 'Saved', 'success');
  };

  const cancelEdit = () => setEditingField(null);

  const major = MAJORS.find((m) => m.id === profile.majorId);

  const fields = [
    { field: 'nameEn', label: t('profile.field.name'), value: isAr ? profile.nameAr : profile.nameEn, icon: 'user' },
    { field: 'email', label: t('profile.field.email'), value: profile.email, icon: 'message-circle' },
    { field: 'phone', label: t('profile.field.phone'), value: profile.phone, icon: 'bell' },
    { field: 'bio', label: t('profile.field.bio'), value: isAr ? profile.bioAr : profile.bio, icon: 'file-text' },
  ];

  return (
    <div className="profile-grid">
      <section className="profile-hero">
        <div className="profile-hero__avatar">{profile.initials}</div>
        <div className="profile-hero__info">
          <h2 className="profile-hero__name">{isAr ? profile.nameAr : profile.nameEn}</h2>
          <p className="profile-hero__sub">{isAr ? major.nameAr : major.nameEn} · {profile.year}</p>
          <div className="profile-hero__meta">
            <div className="profile-hero__meta-item">
              <div className="label">{t('profile.field.gpa')}</div>
              <div className="value mono">{profile.gpa}</div>
            </div>
            <div className="profile-hero__meta-item">
              <div className="label">{isAr ? 'الجامعة' : 'University'}</div>
              <div className="value">{profile.university}</div>
            </div>
            <div className="profile-hero__meta-item">
              <div className="label">{isAr ? 'السنة' : 'Year'}</div>
              <div className="value">{profile.year}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <header className="card__header">
          <h3 className="card__title">{isAr ? 'المعلومات الشخصية' : 'Personal Information'}</h3>
        </header>
        <div className="field-rows">
          {fields.map((f) => (
            <FieldRow
              key={f.field}
              field={f.field}
              label={f.label}
              value={f.value}
              icon={f.icon}
              isEditing={editingField === f.field}
              tempValue={tempValue}
              onStartEdit={startEdit}
              onChange={setTempValue}
              onSave={saveEdit}
              onCancel={cancelEdit}
            />
          ))}
        </div>
      </section>

      <section className="card">
        <header className="card__header">
          <h3 className="card__title">{isAr ? 'الإعدادات' : 'Settings'}</h3>
        </header>
        <div className="field-rows">
          <div className="field-row">
            <div className="field-row__label">
              <svg width="14" height="14"><use href="#icon-globe"/></svg>
              {t('profile.field.lang')}
            </div>
            <div className="field-row__value">
              <div className="lang-switch" style={{ display: 'inline-flex' }}>
                <button className={state.lang === 'en' ? 'is-active' : ''} onClick={() => setLang('en')}>EN</button>
                <button className={state.lang === 'ar' ? 'is-active' : ''} onClick={() => setLang('ar')}>AR</button>
              </div>
            </div>
          </div>
          <div className="field-row">
            <div className="field-row__label">
              {state.theme === 'dark'
                ? <svg width="14" height="14"><use href="#icon-moon"/></svg>
                : <svg width="14" height="14"><use href="#icon-sun"/></svg>}
              {t('profile.field.theme')}
            </div>
            <div className="field-row__value">
              <button className="btn btn--ghost" onClick={() => setTheme(state.theme === 'dark' ? 'light' : 'dark')}>
                {state.theme === 'dark' ? (isAr ? 'داكن' : 'Dark') : (isAr ? 'فاتح' : 'Light')}
              </button>
            </div>
          </div>
          <div className="field-row">
            <div className="field-row__label">
              <svg width="14" height="14"><use href="#icon-bell"/></svg>
              {t('profile.field.notifs')}
            </div>
            <div className="field-row__value">
              <button className="icon-btn" onClick={() => setProfile({ ...profile, notifs: !profile.notifs })}>
                <svg width="20" height="20"><use href={`#icon-toggle-${profile.notifs ? 'right' : 'left'}`}/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
