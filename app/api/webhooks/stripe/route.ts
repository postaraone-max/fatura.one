import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') || '';

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log('Webhook event received:', event.type);

    // Handle subscription events (existing)
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Check if this is a subscription payment
      if (session.metadata?.userId && session.metadata?.plan) {
        const userId = session.metadata.userId;
        const plan = session.metadata.plan;
        
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: plan,
            subscriptionStatus: 'active',
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            subscriptionEnds: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
        
        console.log(`âœ… User ${userId} upgraded to ${plan}`);
      }
      
      // NEW: Check if this is an invoice payment
      if (session.metadata?.invoiceId) {
        const invoiceId = session.metadata.invoiceId;
        
        await prisma.invoice.update({
          where: { id: invoiceId },
          data: {
            paymentStatus: 'PAID',
            paidAt: new Date(),
            status: 'PAID',
          },
        });
        
        console.log(`âœ… Invoice ${invoiceId} marked as PAID`);
      }
    }

    // Handle subscription cancellation
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      
      await prisma.user.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          subscriptionStatus: 'canceled',
          plan: 'free',
        },
      });
      
      console.log(`âœ… Subscription ${subscription.id} canceled`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
