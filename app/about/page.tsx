// app/about/page.tsx
'use client';

import { useTranslation } from '@/lib/useTranslation';

export default function AboutPage() {
  const { t, lang } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 slide-up">
          <h1 className="text-4xl font-bold text-gradient mb-4">
            {t.about.title}
          </h1>
          <p className="text-xl text-gray-600">
            {t.about.subtitle}
          </p>
        </div>

        {/* Mission Section */}
        <div className="card p-8 mb-8 fade-in">
          <div className="flex items-center gap-3 mb-4">
            <svg 
              className="h-8 w-8 text-primary" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 10V3L4 14h7v7l9-11h-7z" 
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900">
              {t.about.mission}
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">
            {t.about.missionText}
          </p>
        </div>

        {/* Features Section */}
        <div className="card p-8 mb-8 fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-4">
            <svg 
              className="h-8 w-8 text-primary" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900">
              {t.about.features}
            </h2>
          </div>
          <ul className="space-y-4">
            {t.about.featuresList.map((feature: string, index: number) => (
              <li key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <svg 
                  className="h-6 w-6 text-success flex-shrink-0 mt-0.5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div className="card p-8 fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-4">
            <svg 
              className="h-8 w-8 text-primary" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900">
              {t.about.contact}
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-6">
            {t.about.contactText}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="mailto:support@fatura.one"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              support@fatura.one
            </a>
            <a 
              href="/pricing"
              className="btn-secondary inline-flex items-center justify-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0-1V7m0 1v1" />
              </svg>
              {t.pricing.title}
            </a>
          </div>
        </div>

        {/* Language Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p className="flex items-center justify-center gap-2">
            <span className="text-xl">🌍</span>
            {lang === 'en' && 'Available in English, Svenska, کوردی, العربية'}
            {lang === 'sv' && 'Tillgänglig på engelska, svenska, kurdiska, arabiska'}
            {lang === 'ku' && 'بەردەستە بە ئینگلیزی، سویدی، کوردی، عەرەبی'}
            {lang === 'ar' && 'متوفرة باللغات الإنجليزية، السويدية، الكردية، العربية'}
          </p>
        </div>
      </div>
    </div>
  );
}
