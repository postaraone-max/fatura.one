// app/verify/phone/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslation } from '@/lib/useTranslation';
import PhoneVerification from '@/components/PhoneVerification';

export default function VerifyPhonePage() {
  const { t, lang } = useTranslation();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userStatus, setUserStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchUserStatus();
    }
  }, [status, router]);

  const fetchUserStatus = async () => {
    try {
      const response = await fetch('/api/user/status');
      if (response.ok) {
        const data = await response.json();
        setUserStatus(data);
        
        // If phone already verified, redirect to invoices
        if (data.phoneVerified) {
          router.push('/invoices');
        }
      }
    } catch (error) {
      console.error('Error fetching user status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerified = () => {
    // Redirect to invoices after verification
    router.push('/invoices');
  };

  if (loading || status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">{t.common.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {lang === 'en' && 'Verify Your Phone Number'}
            {lang === 'sv' && 'Verifiera ditt telefonnummer'}
            {lang === 'ku' && 'پشتڕاستکردنەوەی ژمارەی تەلەفۆنەکەت'}
            {lang === 'ar' && 'تحقق من رقم هاتفك'}
          </h1>
          <p className="mt-2 text-gray-600">
            {lang === 'en' && 'Phone verification is required to create invoices'}
            {lang === 'sv' && 'Telefonverifiering krävs för att skapa fakturor'}
            {lang === 'ku' && 'پشتڕاستکردنەوەی تەلەفۆن پێویستە بۆ دروستکردنی فاکتور'}
            {lang === 'ar' && 'التحقق من الهاتف مطلوب لإنشاء الفواتير'}
          </p>
        </div>

        {session?.user && (
          <PhoneVerification 
            userId={(session?.user as any)?.id || ""} 
            onVerified={handlePhoneVerified} 
          />
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/pricing')}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {lang === 'en' && 'Upgrade to Pro →'}
            {lang === 'sv' && 'Uppgradera till Pro →'}
            {lang === 'ku' && '← گەڕانەوە بۆ دەستپێک'}
            {lang === 'ar' && 'الترقية إلى Pro →'}
          </button>
        </div>
      </div>
    </div>
  );
}

