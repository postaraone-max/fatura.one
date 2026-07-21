import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    RESEND_API_KEY: process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing',
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || '❌ Missing',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || '❌ Missing',
  });
}