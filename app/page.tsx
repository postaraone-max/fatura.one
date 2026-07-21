'use client';

import { useI18n } from '@/lib/i18n/provider';
import Link from 'next/link';

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6">{t('heroTitle')}</h1>
        <p className="text-xl text-gray-600 mb-8">{t('heroSubtitle')}</p>
        <Link
          href="/invoice/new"
          className="inline-block bg-blue-500 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-600 transition-colors"
        >
          {t('heroButton')}
        </Link>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-bold mb-2">📄 {t('createInvoice')}</h3>
          <p className="text-gray-600">Create professional invoices in minutes</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-bold mb-2">📤 {t('send')}</h3>
          <p className="text-gray-600">Send via email or WhatsApp</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-bold mb-2">👁️ {t('viewTracking')}</h3>
          <p className="text-gray-600">Track when clients view your invoices</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-blue-50 p-12 rounded-xl">
        <h2 className="text-3xl font-bold mb-4">{t('featuresTitle')}</h2>
        <p className="text-gray-600 mb-6">
          Start creating professional invoices today. No credit card required.
        </p>
        <Link
          href="/invoice/new"
          className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          {t('createInvoice')}
        </Link>
      </div>
    </div>
  );
}