import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import Stripe from 'stripe';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🔑 Payment link requested for invoice:', id);

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY is missing');
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    });

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    console.log('✅ Invoice found:', invoice.invoiceNumber);
    console.log('Payment status:', invoice.paymentStatus);

    if (invoice.paymentStatus === 'PAID') {
      return NextResponse.json(
        { error: 'Invoice already paid' },
        { status: 400 }
      );
    }

    // Update payment status to PENDING
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        paymentStatus: 'PENDING',
      },
    });

    console.log('🔄 Creating Stripe checkout session...');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: invoice.currency.toLowerCase(),
            product_data: {
              name: `Invoice ${invoice.invoiceNumber}`,
              description: `Invoice for ${invoice.customerName}`,
            },
            unit_amount: Math.round(invoice.total * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/invoice/${invoice.id}/payment-success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/invoice/${invoice.id}/view`,
      metadata: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
      },
    });

    console.log('✅ Stripe session created:', session.id);

    return NextResponse.json({
      url: session.url,
      status: 'created',
    });
  } catch (error) {
    console.error('❌ Payment link error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create payment link' },
      { status: 500 }
    );
  }
}