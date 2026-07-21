import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { I18nProvider } from '@/lib/i18n/provider';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fatura.one - Professional Invoicing',
  description: 'Create, send, and manage professional invoices',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <I18nProvider>
            <div className="flex h-screen bg-gray-50">
              <Sidebar />
              <main className="flex-1 overflow-auto p-8">
                <div className="flex justify-end mb-4">
                  <LanguageSwitcher />
                </div>
                {children}
              </main>
            </div>
          </I18nProvider>
        </Providers>
      </body>
    </html>
  );
}