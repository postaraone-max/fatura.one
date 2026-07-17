import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;
  const appUrl = process.env.APP_URL;

  if (!secretKey) {
    return NextResponse.json({ error: "STRIPE_SECRET_KEY missing" }, { status: 500 });
  }

  if (!priceId) {
    return NextResponse.json({ error: "STRIPE_PRICE_ID missing" }, { status: 500 });
  }

  if (!appUrl) {
    return NextResponse.json({ error: "APP_URL missing" }, { status: 500 });
  }

  const stripe = new Stripe(secretKey);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/protocolum/thanks`,
    cancel_url: `${appUrl}/protocolum/pricing`,
  });

  return NextResponse.json({ url: session.url });
}