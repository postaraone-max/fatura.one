// components/LanguageSwitcher.tsx
'use client';

import { useI18n } from '@/lib/i18n/provider';
import { Locale, translations } from '@/lib/i18n/translations';
import { useState, useRef, useEffect } from 'react';

const flags: Record<Locale, string> = {
  en: '🇬🇧',
  sv: '🇸🇪',
  ku: '🏴',
  ar: '🇸🇦',
};

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const locales: Locale[] = ['sv', 'en', 'ku', 'ar'];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
        aria-label="Switch language"
      >
        <span className="text-lg">{flags[locale]}</span>
        <span className="hidden sm:inline font-medium">{translations[locale].locale}</span>
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute end-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">
          {locales.map((loc) => {
            const isActive = locale === loc;
            return (
              <button
                key={loc}
                onClick={() => {
                  setLocale(loc);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150 ${
                  isActive ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="text-lg">{flags[loc]}</span>
                <span className="flex-1 text-start">{translations[loc].locale}</span>
                {isActive && (
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}