import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { nanoid } from "nanoid";

async function getUserId(req: NextRequest) {
  const cookie = req.cookies.get("authjs.session-token");
  if (!cookie) return null;
  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "");
    const { payload } = await jwtVerify(cookie.value, secret);
    return payload.userId as string;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { 
      customerName, customerPhone, customerEmail, currency, 
      bankName, bankAccount, bankAccountName, items, total, clientId 
    } = body;

    // Generate unique invoice number
    const invoiceNumber = `INV-${Date.now()}-${nanoid(6)}`;

    const invoice = await prisma.invoice.create({
      data: {
        userId,
        clientId: clientId || null,
        invoiceNumber,
        customerName,
        customerPhone,
        customerEmail,
        currency,
        bankName,
        bankAccount,
        bankAccountName,
        total,
        status: "DRAFT",
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Invoice creation error:", error);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}