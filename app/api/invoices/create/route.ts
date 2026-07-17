import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { z } from 'zod';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { checkInvoiceLimit, incrementInvoiceCount } from '@/lib/invoice-limits';

const requestSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  items: z.array(
    z.object({
      description: z.string().min(1),
      quantity: z.number().positive(),
      price: z.number().positive(),
    })
  ),
  currency: z.string().default('SEK'),
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  bankAccountName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    console.log('📥 Received body:', body);

    const validated = requestSchema.parse(body);
    console.log('✅ Validation passed');

    const itemsData = validated.items.map(item => ({
      description: item.description,
      quantity: item.quantity,
      price: item.price,
    }));

    const total = itemsData.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    
    // Generate invoice number (handle guest and user)
    const userId = session?.user?.id || 'guest';
    const lastInvoice = await prisma.invoice.findFirst({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      select: { invoiceNumber: true },
    });
    let sequence = 1;
    if (lastInvoice?.invoiceNumber) {
      const parts = lastInvoice.invoiceNumber.split('-');
      const lastSeq = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(lastSeq)) sequence = lastSeq + 1;
    }
    const invoiceNumber = `INV-${dateStr}-${String(sequence).padStart(4, '0')}`;

    // Check invoice limit for authenticated users only
    if (session?.user) {
      const limitCheck = await checkInvoiceLimit(session.user.id);
      if (!limitCheck.allowed) {
        return NextResponse.json(
          { 
            error: limitCheck.reason || 'Monthly limit reached. Upgrade to continue.',
            remaining: 0,
            upgradeRequired: true,
          },
          { status: 403 }
        );
      }
    }

    console.log('📝 About to create invoice with data:', {
      invoiceNumber,
      userId: userId,
      customerName: validated.customerName,
      total,
      itemsCount: itemsData.length,
    });

    // 🔥 CREATE THE INVOICE
    const newInvoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        userId: userId,
        customerName: validated.customerName,
        customerEmail: validated.customerEmail || null,
        customerPhone: validated.customerPhone || null,
        currency: validated.currency,
        bankName: validated.bankName || null,
        bankAccount: validated.bankAccount || null,
        bankAccountName: validated.bankAccountName || null,
        total,
        status: session?.user ? 'DRAFT' : 'PENDING',
        items: {
          create: itemsData,
        },
      },
      include: { items: true },
    });

    // Increment invoice count for authenticated users
    if (session?.user) {
      await incrementInvoiceCount(session.user.id);
    }

    console.log('✅ Invoice created in DB:', newInvoice.id);

    // 🔍 DOUBLE‑CHECK: fetch it back to confirm
    const check = await prisma.invoice.findUnique({
      where: { id: newInvoice.id },
    });
    console.log('🔍 Re‑fetch check: invoice found?', check ? 'YES' : 'NO');

    if (!check) {
      console.error('❌ Invoice created but not found on re‑fetch! Database might be rolling back.');
      return NextResponse.json(
        { error: 'Invoice could not be persisted' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: newInvoice.id,
      invoiceNumber: newInvoice.invoiceNumber,
      isGuest: !session?.user,
    });
  } catch (error) {
    console.error('❌ Create invoice error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}