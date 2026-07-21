import { NextRequest, NextResponse } from 'next/server';
import { generatePDF } from '@/lib/pdf-generator';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('PDF generation requested for ID:', id);

    // Fetch real invoice from database
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!invoice) {
      return new NextResponse('Invoice not found', { status: 404 });
    }

    // Map database data to PDF format
    const pdfData = {
      invoiceNumber: invoice.invoiceNumber,
      createdAt: invoice.createdAt,
      customerName: invoice.customerName,
      customerPhone: invoice.customerPhone,
      customerEmail: invoice.customerEmail,
      items: invoice.items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        price: item.price,
      })),
      total: invoice.total,
      currency: invoice.currency,
      bankName: invoice.bankName,
      bankAccount: invoice.bankAccount,
      bankAccountName: invoice.bankAccountName,
    };

    console.log('Generating PDF for invoice:', invoice.invoiceNumber);
    const pdfBuffer = await generatePDF(pdfData);
    console.log('PDF generated successfully, size:', pdfBuffer.length);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return new NextResponse(
      `Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 }
    );
  }
}