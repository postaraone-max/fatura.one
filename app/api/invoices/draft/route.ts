import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma/client";

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user ID from session (adjust based on your NextAuth config)
  const userId = session.user.id || session.user.sub;
  if (!userId) {
    return NextResponse.json({ error: "Invalid user" }, { status: 401 });
  }

  const draft = await prisma.invoiceDraft.findUnique({
    where: { userId: userId as string },
  });

  return NextResponse.json({ data: draft?.data || null });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id || session.user.sub;
  if (!userId) {
    return NextResponse.json({ error: "Invalid user" }, { status: 401 });
  }

  const body = await request.json();
  const { data } = body;

  if (!data) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const draft = await prisma.invoiceDraft.upsert({
    where: { userId: userId as string },
    update: { data: data as any, updatedAt: new Date() },
    create: { id: userId as string, userId: userId as string, data: data as any },
  });

  return NextResponse.json({ success: true, id: draft.id });
}