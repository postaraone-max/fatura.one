import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if Stripe key exists
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("❌ STRIPE_SECRET_KEY is missing in .env");
      return NextResponse.json(
        { error: "Stripe configuration error" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    });

    const { plan } = await req.json();
    
    const prices: Record<string, string> = {
      pro: "price_1TsBFsEZUuoWAg9Go1CrRs10",
      business: "price_1TsBHCEZUuoWAg9GBEjmWsin",
    };

    if (!prices[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Create a customer in Stripe
    const customer = await stripe.customers.create({
      email: session.user.email!,
      metadata: {
        userId: session.user.id,
      },
    });

    console.log("✅ Customer created:", customer.id);

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price: prices[plan],
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXTAUTH_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
      metadata: {
        userId: session.user.id,
        plan: plan,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create checkout session" },
      { status: 500 }
    );
  }
}