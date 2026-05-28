import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { I18N } from '../data/i18n';

const AppContext = createContext(null);

const DEFAULT_STATE = {
  lang: 'en',
  theme: 'light',
  view: 'auth',
  prevView: null,
  selectedCourseId: null,
  courseDetailFrom: null,
  detailTab: 'overview',
  selectedMajorId: null,
  filterLevel: 'all',
  filterProgress: 'all',
};

export function AppProvider({ children }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const [toasts, setToasts] = useState([]);

  // Apply lang to document on mount and whenever lang changes
  useEffect(() => {
    document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = state.lang;
  }, [state.lang]);

  // Apply theme to document on mount and whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  const t = useCallback(
    (key) => {
      const dict = I18N[state.lang] || I18N['en'];
      return dict[key] ?? key;
    },
    [state.lang]
  );

  const setView = useCallback((view) => {
    setState((prev) => ({ ...prev, prevView: prev.view, view }));
  }, []);

  const setTheme = useCallback((theme) => {
    setState((prev) => ({ ...prev, theme }));
  }, []);

  const setLang = useCallback((lang) => {
    setState((prev) => ({ ...prev, lang }));
  }, []);

  const toast = useCallback((msg, kind = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, msg, kind }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = {
    state,
    setState,
    t,
    setView,
    setTheme,
    setLang,
    toast,
    toasts,
    dismissToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}
