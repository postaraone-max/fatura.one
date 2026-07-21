import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const match = await bcrypt.compare('password123', user.password || '');
    
    return NextResponse.json({
      userExists: true,
      passwordMatch: match,
      hasPassword: !!user.password,
      userId: user.id,
      userEmail: user.email,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}