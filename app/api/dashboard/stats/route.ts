import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get total invoices
    const totalInvoices = await prisma.invoice.count();

    // Get invoices by status
    const paidInvoices = await prisma.invoice.count({
      where: { status: 'paid' },
    });
    const pendingInvoices = await prisma.invoice.count({
      where: { status: 'pending' },
    });
    const draftInvoices = await prisma.invoice.count({
      where: { status: 'draft' },
    });

    // Get total amount
    const totalAmount = await prisma.invoice.aggregate({
      _sum: {
        amount: true,
      },
    });

    return NextResponse.json({
      totalInvoices,
      paid: paidInvoices,
      pending: pendingInvoices,
      draft: draftInvoices,
      totalAmount: totalAmount._sum.amount || 0,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}