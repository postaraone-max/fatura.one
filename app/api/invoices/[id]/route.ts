import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ✅ GET: Fetch a single invoice by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invoice = await prisma.invoice.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        items: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}

// ✅ PUT: Update an invoice by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Check if invoice exists and belongs to user
    const existingInvoice = await prisma.invoice.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        items: true,
      },
    });

    if (!existingInvoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Calculate total
    const total = body.items?.reduce((sum: number, item: any) => {
      return sum + (Number(item.price) * Number(item.quantity));
    }, 0) || 0;

    // ✅ Update invoice
    const updatedInvoice = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        bankName: body.bankName,
        bankAccount: body.bankAccount,
        bankAccountName: body.bankAccountName,
        currency: body.currency,
        total: total,
        // Delete old items and create new ones
        items: {
          deleteMany: {},
          create: body.items?.filter((item: any) => item.description?.trim())?.map((item: any) => ({
            description: item.description,
            quantity: Number(item.quantity) || 0,
            price: Number(item.price) || 0,
          })) || [],
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { error: "Failed to update invoice" },
      { status: 500 }
    );
  }
}

// ✅ DELETE: Delete an invoice by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if invoice exists and belongs to user
    const existingInvoice = await prisma.invoice.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingInvoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Delete invoice (items will be deleted automatically via cascade)
    await prisma.invoice.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      { error: "Failed to delete invoice" },
      { status: 500 }
    );
  }
}