import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database using email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user.id;

    const invoices = await prisma.invoice.findMany({
      where: { userId },
      include: {
        client: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const stats = {
      totalInvoices: invoices.length,
      draftInvoices: invoices.filter(inv => inv.status === 'DRAFT').length,
      sentInvoices: invoices.filter(inv => inv.status === 'SENT' || inv.status === 'VIEWED').length,
      paidInvoices: invoices.filter(inv => inv.status === 'PAID').length,
      totalRevenue: invoices
        .filter(inv => inv.status === 'PAID')
        .reduce((sum, inv) => sum + inv.total, 0),
      uniqueClients: new Set(invoices.map(inv => inv.clientId).filter(Boolean)).size,
      viewCount: invoices.reduce((sum, inv) => sum + (inv.viewCount || 0), 0),
    };

    const monthlyRevenue = getMonthlyRevenue(invoices);
    const recentActivity = getRecentActivity(invoices);

    return NextResponse.json({
      stats,
      monthlyRevenue,
      recentActivity,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

function getMonthlyRevenue(invoices: any[]) {
  const months: { [key: string]: { revenue: number; invoices: number } } = {};
  
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = date.toISOString().slice(0, 7);
    months[key] = { revenue: 0, invoices: 0 };
  }

  invoices.forEach(invoice => {
    const date = new Date(invoice.createdAt);
    const key = date.toISOString().slice(0, 7);
    if (months[key]) {
      months[key].revenue += invoice.total;
      months[key].invoices += 1;
    }
  });

  return Object.entries(months).map(([month, data]) => ({
    month: formatMonth(month),
    revenue: data.revenue,
    invoices: data.invoices,
  }));
}

function getRecentActivity(invoices: any[]) {
  const activities: any[] = [];

  invoices.forEach(invoice => {
    activities.push({
      id: `${invoice.id}-created`,
      type: 'created',
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customerName || invoice.client?.name || 'Unknown',
      amount: invoice.total,
      timestamp: invoice.createdAt,
    });

    if (invoice.viewCount && invoice.viewCount > 0 && invoice.lastViewedAt) {
      activities.push({
        id: `${invoice.id}-viewed`,
        type: 'viewed',
        invoiceNumber: invoice.invoiceNumber,
        customerName: invoice.customerName || invoice.client?.name || 'Unknown',
        amount: invoice.total,
        timestamp: invoice.lastViewedAt,
      });
    }

    if (invoice.status === 'PAID') {
      activities.push({
        id: `${invoice.id}-paid`,
        type: 'paid',
        invoiceNumber: invoice.invoiceNumber,
        customerName: invoice.customerName || invoice.client?.name || 'Unknown',
        amount: invoice.total,
        timestamp: invoice.updatedAt,
      });
    }
  });

  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);
}

function formatMonth(monthStr: string) {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString('default', { month: 'short', year: 'numeric' });
}