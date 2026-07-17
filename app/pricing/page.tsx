'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/24/outline';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: [
      '2 invoices per month',
      '2 templates',
      'Basic PDF export',
      'Email support',
    ],
    cta: 'Current Plan',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For growing businesses',
    features: [
      'Unlimited invoices',
      '5 professional templates',
      'Logo upload',
      'Send via email',
      'WhatsApp sharing',
      'View tracking',
      'Priority support',
    ],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    name: 'Business',
    price: '$49',
    period: '/month',
    description: 'For teams and agencies',
    features: [
      'All Pro features',
      '5 team members',
      'Auto-reminders',
      'Bulk invoicing',
      'API access',
      'Custom branding',
      '24/7 phone support',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function PricingPage() {
  const { data: session, status } = useSession();

  const handleUpgrade = async (plan: string) => {
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: plan.toLowerCase() }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned:', data);
        alert('Failed to start checkout. Please try again.');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pricing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that works best for your business. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 transition-all hover:shadow-xl ${
                plan.popular ? 'border-blue-500 scale-105' : 'border-transparent'
              }`}
            >
              {plan.popular && (
                <div className="bg-blue-500 text-white text-center text-sm font-medium py-1">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-500 text-sm ml-1">{plan.period}</span>
                  )}
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  {session ? (
                    plan.name === 'Free' ? (
                      <button
                        disabled
                        className="w-full py-2 px-4 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
                      >
                        Current Plan
                      </button>
                    ) : plan.name === 'Business' ? (
                      <a
                        href="mailto:sales@fatura.one"
                        className="w-full block text-center py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Contact Sales
                      </a>
                    ) : (
                      <button
                        onClick={() => handleUpgrade('pro')}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {plan.cta}
                      </button>
                    )
                  ) : (
                    <Link
                      href="/auth/signin"
                      className="w-full block text-center py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Sign In to Upgrade
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 text-sm text-gray-500">
          <p>All plans include secure payments, mobile-responsive invoices, and 24/7 support.</p>
          <p className="mt-1">
            Need a custom plan? <a href="mailto:support@fatura.one" className="text-blue-600 hover:underline">Contact us</a>
          </p>
        </div>
      </div>
    </div>
  );
}