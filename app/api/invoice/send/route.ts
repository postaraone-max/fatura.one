import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authjs.session-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    const { invoiceId, phone } = await req.json();

    if (!invoiceId || !phone) {
      return NextResponse.json({ error: "Missing invoiceId or phone" }, { status: 400 });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { items: true },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (invoice.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const itemsList = invoice.items
      .map(item => `${item.description} x${item.quantity} = ${item.price * item.quantity} ${invoice.currency}`)
      .join("\n");

    const message = `Invoice ${invoice.invoiceNumber}\n\nCustomer: ${invoice.customerName}\n\n${itemsList}\n\nTotal: ${invoice.total} ${invoice.currency}\n\nView: https://fatura.one/invoice/${invoice.id}`;

    const cleanPhone = phone.replace(/\s/g, "").replace(/^\+/, "");
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: "SENT" },
    });

    return NextResponse.json({ success: true, whatsappUrl });
  } catch (error) {
    console.error("Error sending invoice:", error);
    return NextResponse.json({ error: "Failed to send invoice" }, { status: 500 });
  }
}