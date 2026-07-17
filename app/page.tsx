'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  DocumentPlusIcon, 
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

export default function LandingPage() {
  const { data: session } = useSession();

  const features = [
    {
      icon: DocumentPlusIcon,
      title: 'Free Invoice Generator',
      description: 'Create professional invoices in 30 seconds. No registration required to start.',
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Send via Email & WhatsApp',
      description: 'Share invoices instantly with your clients through email or WhatsApp.',
    },
    {
      icon: UserGroupIcon,
      title: 'Client Management',
      description: 'Save your clients and auto-fill their details. Never type the same info twice.',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Private',
      description: 'Your data is encrypted and stored securely. Only you have access.',
    },
    {
      icon: GlobeAltIcon,
      title: 'Multi-Language Support',
      description: 'Create invoices in English, Swedish, Kurdish, or Arabic.',
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Multiple Currencies',
      description: 'Support for SEK, USD, EUR, IQD and more.',
    },
  ];

  const steps = [
    'Fill in your invoice details (customer, items, price)',
    'Preview your invoice in real-time',
    'Download or send your invoice instantly',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Free Invoice Generator
            <br />
            <span className="text-blue-600">Made Simple</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create professional invoices in 30 seconds. No sign-up required.
            Download PDF, send via email, or share on WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/invoice/new"
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Create Invoice Now
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
            {!session && (
              <Link
                href="/auth/signin"
                className="px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-4">🚀 Free forever • 2 invoices/month • No credit card required</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Professional invoicing features that help you get paid faster.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <p className="text-gray-700 italic mb-4">
                "Finally a simple invoice tool that actually works. I got my first invoice out in 2 minutes."
              </p>
              <p className="text-gray-600 font-medium">— Freelance Designer</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <p className="text-gray-700 italic mb-4">
                "The WhatsApp integration is a game changer. My clients love getting invoices directly."
              </p>
              <p className="text-gray-600 font-medium">— Small Business Owner</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <p className="text-gray-700 italic mb-4">
                "I've tried many invoicing apps. This one is the easiest and most intuitive."
              </p>
              <p className="text-gray-600 font-medium">— Consultant</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Start free. Upgrade when you need more. No hidden fees.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-blue-500">
              <h3 className="text-2xl font-bold text-gray-900">Free</h3>
              <p className="text-4xl font-bold text-gray-900 my-4">$0</p>
              <p className="text-gray-500 mb-6">Perfect for getting started</p>
              <ul className="text-left space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  <span>2 invoices per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  <span>2 professional templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  <span>WhatsApp sharing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  <span>PDF download</span>
                </li>
              </ul>
              <Link
                href="/invoice/new"
                className="block w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-200 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Pro</h3>
              <p className="text-4xl font-bold text-gray-900 my-4">$19</p>
              <p className="text-gray-500 text-sm">/month</p>
              <p className="text-gray-500 mb-6">For growing businesses</p>
              <ul className="text-left space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  <span>Unlimited invoices</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  <span>5 professional templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  <span>Logo upload</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  <span>Email & WhatsApp sharing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  <span>View tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Link
                href={session ? "/pricing" : "/auth/signin"}
                className="block w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {session ? 'Upgrade to Pro' : 'Sign Up to Upgrade'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Create Your First Invoice?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using Fatura.one to create professional invoices.
          </p>
          <Link
            href="/invoice/new"
            className="inline-block px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
          >
            Create Invoice Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left">
            <span className="text-xl font-bold text-white">Fatura.one</span>
            <p className="text-sm mt-1">Professional invoicing made simple.</p>
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/settings" className="hover:text-white transition-colors">
              Settings
            </Link>
            <a href="mailto:support@fatura.one" className="hover:text-white transition-colors">
              Support
            </a>
          </div>
          <p className="text-sm mt-4 md:mt-0">© 2026 Fatura.one. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}