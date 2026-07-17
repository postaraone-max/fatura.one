'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'sv', label: 'Svenska' },
  { code: 'ku', label: 'کوردی' },
  { code: 'ar', label: 'العربية' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setLanguage(lang);
    router.refresh();
  };

  return (
    <select
      value={language}
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