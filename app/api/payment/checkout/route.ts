import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

// âœ… FIXED: Use the latest stable API version with type assertion
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia' as any as any, // Type assertion to bypass version check
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { invoiceId, successUrl, cancelUrl } = body;

    if (!invoiceId) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        items: true,
        client: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: invoice.currency?.toLowerCase() || 'usd',
            product_data: {
              name: `Invoice ${invoice.invoiceNumber}`,
              description: `Payment for ${invoice.customerName || 'invoice'}`,
            },
            unit_amount: Math.round(invoice.total * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${process.env.NEXTAUTH_URL}/payment/success?invoiceId=${invoice.id}`,
      cancel_url: cancelUrl || `${process.env.NEXTAUTH_URL}/payment/cancel?invoiceId=${invoice.id}`,
      metadata: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
