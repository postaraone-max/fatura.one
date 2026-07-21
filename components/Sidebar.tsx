'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/provider';
import { signOut } from 'next-auth/react';
import {
  HomeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();

  const navigation = [
    { name: t('dashboard'), href: '/', icon: HomeIcon },
    { name: t('invoices'), href: '/invoices', icon: DocumentTextIcon },
    { name: t('clients'), href: '/clients', icon: UserGroupIcon },
    { name: t('pricing'), href: '/pricing', icon: CreditCardIcon },
    { name: t('settings'), href: '/settings', icon: Cog6ToothIcon },
  ];

  // ✅ Simple logout that works
  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <span className="text-xl font-bold text-blue-600">{t('appName')}</span>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-red-600 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
          {t('logout')}
        </button>
      </div>
    </div>
  );
}