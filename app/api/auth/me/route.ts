import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authjs.session-token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json({
      authenticated: true,
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}