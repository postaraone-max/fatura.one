import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma/client";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "fallback-secret-change-me");

async function getUserId(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("authjs.session-token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.userId as string;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      logoUrl: true,
      plan: true,
      preferredLanguage: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}