"use client";

import { useState } from "react";

export default function WhatsAppSendPage() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate magic link
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        const data = await res.json();
        // Create WhatsApp link
      const message = encodeURIComponent(
  `Login to Fatura: ${data.link}`
);
       const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${message}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, "_blank");
        alert("WhatsApp opened! Send the message to your customer.");
      } else {
        alert("Failed to generate link. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">Send Login Link via WhatsApp</h2>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number (with country code)</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9647701234567"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">Include country code without + (e.g., 964 for Iraq)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email (for login)</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@email.com"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Send via WhatsApp"}
          </button>
        </form>
      </div>
    </div>
  );
}
