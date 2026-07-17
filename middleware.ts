import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow all requests - we'll handle auth on the client side
  return NextResponse.next();
}

export const config = {
  matcher: [],
};