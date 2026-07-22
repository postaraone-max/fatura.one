import { ReactNode } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href={`/${locale}`} className="text-xl font-bold text-blue-600 dark:text-blue-400">
              📄 Fatura.one
            </Link>
            <div className="flex items-center gap-6">
              <Link href={`/${locale}/invoices`} className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
                Invoices
              </Link>
              <Link href={`/${locale}/clients`} className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
                Clients
              </Link>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}