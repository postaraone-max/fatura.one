import { prisma } from './prisma';

export async function checkInvoiceLimit(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
      monthlyInvoiceCount: true,
      monthlyInvoiceReset: true,
    },
  });

  if (!user) return { allowed: false, reason: 'User not found' };

  // Pro and Business plans have unlimited invoices
  if (user.plan === 'pro' || user.plan === 'business') {
    return { allowed: true };
  }

  // Free plan: 2 invoices per month
  const now = new Date();
  const resetDate = user.monthlyInvoiceReset || new Date(now.getFullYear(), now.getMonth(), 1);
  
  // Reset count if it's a new month
  if (resetDate.getMonth() !== now.getMonth() || resetDate.getFullYear() !== now.getFullYear()) {
    // Reset the counter
    await prisma.user.update({
      where: { id: userId },
      data: {
        monthlyInvoiceCount: 0,
        monthlyInvoiceReset: new Date(now.getFullYear(), now.getMonth(), 1),
      },
    });
    return { allowed: true, remaining: 2 };
  }

  const remaining = 2 - (user.monthlyInvoiceCount || 0);
  
  if (remaining <= 0) {
    return { 
      allowed: false, 
      reason: 'Monthly limit reached',
      remaining: 0,
    };
  }

  return { allowed: true, remaining };
}

export async function incrementInvoiceCount(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { monthlyInvoiceCount: true },
  });

  if (!user) return;

  await prisma.user.update({
    where: { id: userId },
    data: {
      monthlyInvoiceCount: { increment: 1 },
    },
  });
}