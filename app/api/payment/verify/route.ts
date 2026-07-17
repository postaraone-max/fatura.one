import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionId = req.nextUrl.searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (checkoutSession.payment_status !== "paid") {
      return NextResponse.json({ success: false });
    }

    const plan = checkoutSession.metadata?.plan || "pro";
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        plan: plan,
        stripeSubscriptionId: checkoutSession.subscription as string,
        subscriptionEnds: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}