'use client';

import { useI18n } from '@/lib/i18n/provider';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'sv', label: 'Svenska' },
  { code: 'ku', label: 'کوردی' },
  { code: 'ar', label: 'العربية' },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as 'en' | 'sv' | 'ku' | 'ar';
    setLocale(newLang);
    // Force reload to apply translations
    window.location.reload();
  };

  return (
    <select
      value={locale}
      onChange={handleChange}
      className="bg-transparent border border-gray-300 rounded px-2 py-1 text-sm"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}