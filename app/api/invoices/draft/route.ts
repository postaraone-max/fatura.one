import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ✅ FIXED: Use only 'id' from session.user
    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json({ error: 'Invalid user' }, { status: 401 });
    }

    const body = await request.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      items,
      currency = 'IQD',
      total,
      bankName,
      bankAccount,
      bankAccountName,
    } = body;

    // Create the invoice
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: `DRAFT-${Date.now().toString().slice(-6)}`,
        userId: userId,
        customerName: customerName || 'Draft Customer',
        customerEmail: customerEmail || '',
        customerPhone: customerPhone || '',
        currency: currency,
        total: total || 0,
        status: 'DRAFT',
        bankName: bankName || '',
        bankAccount: bankAccount || '',
        bankAccountName: bankAccountName || '',
        items: {
          create: items?.map((item: any) => ({
            description: item.description || '',
            quantity: item.quantity || 1,
            price: item.price || 0,
          })) || [],
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error('Draft invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to create draft invoice' },
      { status: 500 }
    );
  }
}