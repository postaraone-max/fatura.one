"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";

export default function AdminAnalyticsPage() {
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/postara/analytics?token=CRON");
        const text = await res.text();
        if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
        setHtml(text);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin Analytics</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <div className="border border-gray-200 rounded p-4 overflow-auto" dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </main>
  );
}

