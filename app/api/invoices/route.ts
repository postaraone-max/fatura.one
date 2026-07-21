import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ✅ GET: Fetch all invoices for the logged-in user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invoices = await prisma.invoice.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        client: true,
        items: true,
      },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

// ✅ POST: Create a new invoice
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // Generate invoice number
    const date = new Date();
    const dateStr = date.getFullYear() +
      String(date.getMonth() + 1).padStart(2, '0') +
      String(date.getDate()).padStart(2, '0');
    
    const count = await prisma.invoice.count({
      where: {
        createdAt: {
          gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        },
      },
    });
    
    const invoiceNumber = `INV-${dateStr}-${String(count + 1).padStart(4, '0')}`;

    // Calculate total from items
    const total = body.items?.reduce((sum: number, item: any) => {
      return sum + (Number(item.price) * Number(item.quantity));
    }, 0) || 0;

    // Create invoice with items
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        customerName: body.customerName || 'Guest',
        customerEmail: body.customerEmail || '',
        customerPhone: body.customerPhone || '',
        customerAddress: body.customerAddress || '',
        bankName: body.bankName || '',
        bankAccount: body.bankAccount || '',
        bankAccountName: body.bankAccountName || '',
        currency: body.currency || 'SEK',
        total: total,
        status: 'DRAFT',
        userId: session.user.id,
        items: {
          create: body.items?.filter((item: any) => item.description?.trim())?.map((item: any) => ({
            description: item.description,
            quantity: Number(item.quantity) || 0,
            price: Number(item.price) || 0,
          })) || [],
        },
      },
      include: {
        items: true,
        client: true,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
    
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Failed to create invoice: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 }
    );
  }
}