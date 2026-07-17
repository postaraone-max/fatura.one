// lib/i18n/utils.ts
import { Locale, defaultLocale } from './translations';

const LOCALE_COOKIE = 'fatura-locale';

export function setLocaleCookie(locale: Locale) {
  if (typeof document === 'undefined') return;
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

export function getLocaleCookie(): Locale | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + LOCALE_COOKIE + '=([^;]+)'));
  return match ? (match[2] as Locale) : null;
}

export function getLocaleFromBrowser(): Locale | null {
  if (typeof navigator === 'undefined') return null;
  const browserLang = navigator.language.split('-')[0];
  const supported: Locale[] = ['en', 'sv', 'ku', 'ar'];
  return supported.includes(browserLang as Locale) ? (browserLang as Locale) : null;
}