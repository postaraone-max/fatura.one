import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invoices = await prisma.invoice.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: true,
        client: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Invoices fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // ✅ FIXED: Removed 'customerAddress' (not in schema)
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: body.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
        userId: session.user.id,
        clientId: body.clientId || null,
        customerName: body.customerName || '',
        customerEmail: body.customerEmail || '',
        customerPhone: body.customerPhone || '',
        currency: body.currency || 'IQD',
        total: body.total || 0,
        status: body.status || 'DRAFT',
        bankName: body.bankName || '',
        bankAccount: body.bankAccount || '',
        bankAccountName: body.bankAccountName || '',
        items: {
          create: body.items?.map((item: any) => ({
            description: item.description || '',
            quantity: item.quantity || 1,
            price: item.price || 0,
          })) || [],
        },
      },
      include: {
        items: true,
        client: true,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error('Invoice creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}