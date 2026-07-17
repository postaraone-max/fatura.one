import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "fallback-secret-change-me");

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin?error=missing_token", request.url));
  }

  try {
    // For demo: create a user ID (in production, verify token against database)
    const userId = "user_" + Date.now();

    // Create JWT session cookie
    const jwt = await new SignJWT({ userId, email: "user@example.com" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    // Redirect to the NEW wizard (not dashboard)
    const response = NextResponse.redirect(new URL("/invoice/new", request.url));

    // Set the cookie with correct settings for localhost
    response.cookies.set("authjs.session-token", jwt, {
      httpOnly: true,
      secure: false, // false for localhost
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    console.log("✅ Session cookie set, redirecting to /invoice/new");
    return response;
  } catch (error) {
    console.error("Magic verify error:", error);
    return NextResponse.redirect(new URL("/auth/signin?error=invalid_token", request.url));
  }
}