"use client";

import { useState, useEffect } from "react";
import LogoUpload from "@/components/common/LogoUpload";

export default function SettingsPage() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Fetch current user data (you'll need an API endpoint for this)
        const res = await fetch("/api/user/me");
        if (res.ok) {
          const data = await res.json();
          setLogoUrl(data.logoUrl || null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogoUpload = (url: string) => {
    setLogoUrl(url);
    alert("✅ Logo uploaded successfully! It will appear on your PDFs.");
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Settings</h1>
      <p className="text-slate-500 mb-8">Manage your account and branding</p>

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Company Logo</h2>
        <p className="text-sm text-slate-500 mb-4">
          Upload your company logo. It will appear on all your invoices and PDFs.
        </p>
        <LogoUpload currentLogoUrl={logoUrl} onUploadSuccess={handleLogoUpload} />
      </div>

      {/* Placeholder for other settings */}
      <div className="bg-white border rounded-xl p-6 shadow-sm mt-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Preferences</h2>
        <p className="text-sm text-slate-500">Language, currency, and other preferences coming soon.</p>
      </div>
    </div>
  );
}