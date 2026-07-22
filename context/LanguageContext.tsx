'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define all available languages
export const languages = {
  en: { name: 'English', flag: '🇬🇧' },
  sv: { name: 'Svenska', flag: '🇸🇪' },
  ku: { name: 'Kurdî', flag: '🏴' },
  ar: { name: 'العربية', flag: '🇸🇦' },
};

type Language = keyof typeof languages;

interface LanguageContextType {
  locale: Language;
  setLocale: (locale: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Import all translations
import en from '@/messages/en.json';
import sv from '@/messages/sv.json';
import ku from '@/messages/ku.json';
import ar from '@/messages/ar.json';

const translations = { en, sv, ku, ar };

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Language>('en');

  useEffect(() => {
    // Get locale from URL on initial load
    const path = window.location.pathname;
    const pathLocale = path.split('/')[1] as Language;
    if (pathLocale && Object.keys(languages).includes(pathLocale)) {
      setLocale(pathLocale);
    } else {
      // Default to 'en' if no valid locale in URL
      setLocale('en');
    }
  }, []);

  // Translation function
  const t = (key: string): string => {
    const translation = translations[locale];
    return translation[key as keyof typeof translation] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}