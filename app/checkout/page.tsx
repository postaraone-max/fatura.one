"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export const dynamic = "force-dynamic";

function CheckoutInner() {
  const params = useSearchParams();
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");

  const plan = (params.get("plan") || "authority").toLowerCase();

  const handleCheckout = async () => {
    setStatus("processing");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const json = await res.json().catch(() => null);
      const url = json?.url as string | undefined;

      if (!res.ok || !url) throw new Error("Checkout failed");

      window.location.assign(url);
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      <p className="mb-6">You selected the {plan} plan.</p>

      <button
        onClick={handleCheckout}
        disabled={status === "processing"}
        className="px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition disabled:opacity-50"
      >
        {status === "processing" ? "Redirecting..." : "Continue to Stripe"}
      </button>

      {status === "error" && (
        <p className="mt-4 text-red-600 font-medium">Checkout failed. Try again.</p>
      )}
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckoutInner />
    </Suspense>
  );
}

