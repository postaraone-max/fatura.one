import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'sv', 'ku', 'ar'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // ✅ FIXED: Return both 'messages' AND 'locale'
  return {
    locale: locale,        // <-- THIS WAS MISSING!
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});