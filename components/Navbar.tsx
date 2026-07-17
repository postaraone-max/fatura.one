// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useI18n } from '@/lib/i18n/provider';

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useI18n();

  const navItems = [
    { href: '/dashboard', label: t('nav.dashboard') },
    { href: '/invoices', label: t('nav.invoices') },
    { href: '/clients', label: t('nav.clients') },
    { href: '/settings', label: t('nav.settings') },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              F
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
              Fatura
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 pb-1'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right side: Language Switcher + User */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={() => {
                fetch('/api/auth/signout', { method: 'POST', credentials: 'include' }).then(() => {
                  window.location.href = '/';
                });
              }}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {t('common.logout')}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}