"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">Dashboard</h1>
      <p className="text-slate-500 mb-6">Welcome back! Here's your invoice dashboard.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/invoice/new"
          className="p-6 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition"
        >
          <h2 className="text-lg font-semibold text-blue-700">📄 New Invoice</h2>
          <p className="text-sm text-blue-600">Create a new invoice using the 3-step wizard</p>
        </Link>

        <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
          <h2 className="text-lg font-semibold text-slate-700">📊 Stats</h2>
          <p className="text-sm text-slate-500">Coming soon: invoice analytics</p>
        </div>

        <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
          <h2 className="text-lg font-semibold text-slate-700">⚙️ Settings</h2>
          <Link href="/settings" className="text-sm text-blue-600 hover:underline">
            Manage your account →
          </Link>
        </div>
      </div>
    </div>
  );
}