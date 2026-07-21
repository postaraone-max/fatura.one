import { prisma } from './prisma';

export async function checkInvoiceLimit(userId: string) {
  // ✅ Validate userId before querying
  if (!userId) {
    console.error('checkInvoiceLimit: userId is required');
    return { 
      allowed: true,  // ✅ Allow by default if no userId
      reason: 'No user ID provided',
      remaining: 0,
    };
  }

  try {
    console.log('checkInvoiceLimit: Checking for user:', userId);
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        plan: true,
        monthlyInvoiceCount: true,
        monthlyInvoiceReset: true,
      },
    });

    if (!user) {
      console.error('checkInvoiceLimit: User not found:', userId);
      return { 
        allowed: false, 
        reason: 'User not found. Please log in again.',
        remaining: 0,
      };
    }

    // Pro and Business plans have unlimited invoices
    if (user.plan === 'pro' || user.plan === 'business') {
      console.log('checkInvoiceLimit: Pro/Business user, unlimited');
      return { 
        allowed: true, 
        remaining: Infinity,
        plan: user.plan,
      };
    }

    // Free plan: 2 invoices per month
    const now = new Date();
    const resetDate = user.monthlyInvoiceReset || new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Reset count if it's a new month
    if (resetDate.getMonth() !== now.getMonth() || resetDate.getFullYear() !== now.getFullYear()) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          monthlyInvoiceCount: 0,
          monthlyInvoiceReset: new Date(now.getFullYear(), now.getMonth(), 1),
        },
      });
      console.log('checkInvoiceLimit: Reset monthly count');
      return { 
        allowed: true, 
        remaining: 2,
        plan: user.plan,
      };
    }

    const currentCount = user.monthlyInvoiceCount || 0;
    const remaining = 2 - currentCount;
    
    if (remaining <= 0) {
      console.log('checkInvoiceLimit: Limit reached, current count:', currentCount);
      return { 
        allowed: false, 
        reason: 'Monthly limit reached (2 invoices). Upgrade to Pro for unlimited.',
        remaining: 0,
        plan: user.plan,
        currentCount,
      };
    }

    console.log('checkInvoiceLimit: Allowed, remaining:', remaining);
    return { 
      allowed: true, 
      remaining,
      plan: user.plan,
      currentCount,
    };
    
  } catch (error) {
    console.error('Error checking invoice limit:', error);
    // ✅ If there's an error, allow the invoice (fail open)
    return { 
      allowed: true, 
      reason: 'Error checking limit, allowing creation',
      remaining: 0,
    };
  }
}

export async function incrementInvoiceCount(userId: string) {
  if (!userId) {
    console.error('incrementInvoiceCount: userId is required');
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        monthlyInvoiceCount: true,
        plan: true,
      },
    });

    if (!user) {
      console.error('incrementInvoiceCount: User not found');
      return;
    }

    // Don't increment for Pro/Business users
    if (user.plan === 'pro' || user.plan === 'business') {
      return;
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        monthlyInvoiceCount: { increment: 1 },
      },
    });
    
    console.log('incrementInvoiceCount: Incremented to', (user.monthlyInvoiceCount || 0) + 1);
    
  } catch (error) {
    console.error('Error incrementing invoice count:', error);
  }
}