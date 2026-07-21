'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [message, setMessage] = useState('Your subscription is being activated...');

  useEffect(() => {
    // If not logged in, redirect to login
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/payment/success');
      return;
    }

    if (status === 'authenticated' && session?.user) {
      // Check if user is upgraded
      const checkUpgrade = async () => {
        try {
          const res = await fetch('/api/user/me');
          const data = await res.json();
          
          if (data.plan && data.plan !== 'free') {
            setMessage(`✅ Payment successful! You are now on the ${data.plan} plan.`);
          } else {
            setMessage('⚠️ Payment received, but plan update is pending. Please wait a moment.');
          }
        } catch (error) {
          setMessage('✅ Payment successful! Your account is being upgraded.');
        }
      };

      checkUpgrade();
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Payment Successful! 🎉
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {message}
        </p>
        <div className="space-y-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => router.push('/invoices/new')}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Create an Invoice
          </button>
        </div>
      </div>
    </div>
  );
}