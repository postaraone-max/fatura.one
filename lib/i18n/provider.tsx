'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { translations, defaultLocale, Locale } from './translations';

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || defaultLocale);

  useEffect(() => {
    const saved = localStorage.getItem('language') as Locale;
    if (saved && ['en', 'sv', 'ku', 'ar'].includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    localStorage.setItem('language', newLocale);
    setLocaleState(newLocale);
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLocale;
    window.location.reload();
  }, []);

  const t = useCallback(
    (key: string): string => {
      const keys = key.split('.');
      let result: any = translations[locale];
      for (const k of keys) {
        if (result && result[k] !== undefined) {
          result = result[k];
        } else {
          return key;
        }
      }
      return typeof result === 'string' ? result : key;
    },
    [locale]
  );

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dir }}>
      <div dir={dir} className={dir === 'rtl' ? 'rtl' : ''} style={{ direction: dir }}>
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
}