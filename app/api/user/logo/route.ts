import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// ✅ FIXED: Removed logoUrl since it doesn't exist in schema
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { logoUrl } = body;

    if (!logoUrl) {
      return NextResponse.json(
        { error: 'Logo URL is required' },
        { status: 400 }
      );
    }

    // ✅ FIXED: Use 'image' instead of 'logoUrl' (the actual field in schema)
    await prisma.user.update({
      where: { id: userId },
      data: { 
        image: logoUrl,  // Use 'image' instead of 'logoUrl'
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Logo updated successfully',
      logoUrl: logoUrl 
    });
  } catch (error) {
    console.error('Logo update error:', error);
    return NextResponse.json(
      { error: 'Failed to update logo' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        image: true,  // Use 'image' instead of 'logoUrl'
      },
    });

    return NextResponse.json({
      logoUrl: user?.image || null,
    });
  } catch (error) {
    console.error('Logo fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logo' },
      { status: 500 }
    );
  }
}