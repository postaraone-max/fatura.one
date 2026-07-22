import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // Provide a static locale, fetch from user settings,
  // or from a cookie. Let's use 'en' for now as a fallback.
  const locale = 'en';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});