// lib/i18n/provider.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { translations, defaultLocale, Locale } from './translations';
import { getLocaleFromBrowser, setLocaleCookie, getLocaleCookie } from './utils';

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
    const saved = getLocaleCookie();
    const browser = getLocaleFromBrowser();
    const detected = saved || browser || defaultLocale;
    if (detected !== locale) {
      setLocaleState(detected as Locale);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleCookie(newLocale);
    setLocaleState(newLocale);
    fetch('/api/user/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ language: newLocale }),
    }).catch(() => {});
  }, []);

  const t = useCallback(
    (key: string): string => {
      const keys = key.split('.');
      let result: any = translations[locale];
      for (const k of keys) {
        if (result && result[k] !== undefined) {
          result = result[k];
        } else {
          console.warn(`Missing translation: ${key} for locale ${locale}`);
          return key;
        }
      }
      return typeof result === 'string' ? result : key;
    },
    [locale]
  );

  const dir = translations[locale]?.dir || 'ltr';

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