import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authjs.session-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    if (!userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, email, address, taxId } = body;

    const existing = await prisma.client.findFirst({
      where: { id: params.id, userId },
    });
    if (!existing) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const client = await prisma.client.update({
      where: { id: params.id },
      data: { name, phone, email, address, taxId },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authjs.session-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    if (!userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const existing = await prisma.client.findFirst({
      where: { id: params.id, userId },
    });
    if (!existing) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    await prisma.client.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 });
  }
}
