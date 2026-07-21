import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await req.json();

    // ✅ Generate a simple text invoice (PDF format)
    const pdfContent = `
Invoice
====================================
Invoice Number: ${data.invoiceNumber || 'INV-001'}
Date: ${data.date || new Date().toLocaleDateString()}
------------------------------------
Customer: ${data.customerName || 'Guest'}
Email: ${data.customerEmail || ''}
Phone: ${data.customerPhone || ''}
Address: ${data.customerAddress || ''}
------------------------------------
Items:
${data.items?.map((item: any) => 
  `  ${item.description} x ${item.quantity} = ${(item.price * item.quantity).toFixed(2)} ${data.currency || 'IQD'}`
).join('\n') || '  No items'}
------------------------------------
Bank Name: ${data.bankName || '-'}
Bank Account: ${data.bankAccount || '-'}
Account Name: ${data.bankAccountName || '-'}
------------------------------------
Total: ${data.total?.toFixed(2) || '0.00'} ${data.currency || 'IQD'}
====================================
Thank you for your business!
    `;

    // Convert to PDF-like blob
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const buffer = await blob.arrayBuffer();

    // Return as PDF download
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${data.customerName || 'invoice'}.pdf"`,
      },
    });
    
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}