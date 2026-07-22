'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage, languages } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale, setLocale } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const switchLanguage = (newLocale: keyof typeof languages) => {
    setLocale(newLocale);
    // Update URL
    const pathWithoutLocale = pathname?.replace(/^\/(en|sv|ku|ar)/, '') || '';
    const newPath = pathWithoutLocale === '' || pathWithoutLocale === '/' 
      ? `/${newLocale}` 
      : `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 px-3 py-2 rounded-lg">
        <span>🌐</span>
        <span className="hidden sm:inline">Loading...</span>
      </div>
    );
  }

  return (
    <div className="relative group">
      <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
        <span>{languages[locale]?.flag || '🌐'}</span>
        <span className="hidden sm:inline">
          {languages[locale]?.name || locale}
        </span>
        <ChevronDown className="w-4 h-4" />
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {Object.entries(languages).map(([code, { name, flag }]) => (
          <button
            key={code}
            onClick={() => switchLanguage(code as keyof typeof languages)}
            className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 ${
              locale === code ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
            }`}
          >
            <span>{flag}</span>
            <span>{name}</span>
            {locale === code && <span className="ml-auto">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}