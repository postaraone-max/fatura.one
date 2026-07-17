import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v || v.trim().length === 0) throw new Error(`Missing env: ${name}`);
  return v.trim();
}

function planToPriceId(plan: string): string {
  const p = String(plan || "").toLowerCase().trim();

  if (p === "authority") {
    return mustEnv("STRIPE_PRICE_ID_AUTHORITY");
  }

  throw new Error("UNSUPPORTED_PLAN");
}

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();

    const secretKey = mustEnv("STRIPE_SECRET_KEY");
    const stripe = new Stripe(secretKey);

    const priceId = planToPriceId(plan);

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL?.trim() ||
      process.env.NEXTAUTH_URL?.trim() ||
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/protocolum/thanks?checkout=success`,
      cancel_url: `${baseUrl}/protocolum/pricing?checkout=cancel`,
      // Ensure email is present for webhook mapping
      customer_email: undefined,
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (err: any) {
    const msg = String(err?.message ?? err);
    const status = msg === "UNSUPPORTED_PLAN" ? 400 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
