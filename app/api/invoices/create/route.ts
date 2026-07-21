import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Function to generate invoice number (moved outside to avoid top-level await)
function generateInvoiceNumber() {
  const now = new Date();
  const date = now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  return `INV-${date}-${random}`;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log('📝 Creating invoice for user:', session.user.id);

    const {
      customerName,
      customerEmail,
      customerPhone,
      currency,
      bankName,
      bankAccount,
      bankAccountName,
      items,
      type,
      template,
    } = body;

    // Validate required fields
    if (!customerName || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Customer name and items are required' },
        { status: 400 }
      );
    }

    // Calculate total
    const total = items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Generate invoice number
    const invoiceNumber = generateInvoiceNumber();

    // Create invoice with items
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        userId: session.user.id,
        customerName,
        customerEmail: customerEmail || null,
        customerPhone: customerPhone || null,
        currency: currency || 'IQD',
        bankName: bankName || null,
        bankAccount: bankAccount || null,
        bankAccountName: bankAccountName || null,
        total,
        status: 'DRAFT',
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    console.log('✅ Invoice created:', invoice.invoiceNumber);

    return NextResponse.json({
      success: true,
      message: 'Invoice created successfully',
      invoice,
    });

  } catch (error) {
    console.error('❌ Create invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}