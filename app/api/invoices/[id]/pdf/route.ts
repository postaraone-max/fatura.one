import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invoiceId = params.id;

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        client: true,
        user: true,
        items: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = height - 50;

    // Title
    page.drawText('INVOICE', {
      x: 50,
      y: y,
      size: 24,
      font: boldFont,
      color: rgb(0, 0, 0.8),
    });

    y -= 30;

    // Invoice Number
    page.drawText(`Invoice #: ${invoice.invoiceNumber}`, {
      x: 50,
      y: y,
      size: 12,
      font: font,
    });

    y -= 20;

    // Date
    page.drawText(`Date: ${invoice.createdAt.toLocaleDateString()}`, {
      x: 50,
      y: y,
      size: 12,
      font: font,
    });

    y -= 30;

    // Client Section
    page.drawText('Bill To:', {
      x: 50,
      y: y,
      size: 14,
      font: boldFont,
    });

    y -= 20;

    page.drawText(invoice.customerName || 'N/A', {
      x: 50,
      y: y,
      size: 12,
      font: font,
    });

    y -= 20;

    if (invoice.customerEmail) {
      page.drawText(invoice.customerEmail, {
        x: 50,
        y: y,
        size: 12,
        font: font,
      });
      y -= 20;
    }

    if (invoice.customerPhone) {
      page.drawText(invoice.customerPhone, {
        x: 50,
        y: y,
        size: 12,
        font: font,
      });
      y -= 20;
    }

    y -= 20;

    // Items Table Header
    page.drawText('Description', {
      x: 50,
      y: y,
      size: 12,
      font: boldFont,
    });
    page.drawText('Qty', {
      x: 350,
      y: y,
      size: 12,
      font: boldFont,
    });
    page.drawText('Price', {
      x: 420,
      y: y,
      size: 12,
      font: boldFont,
    });
    page.drawText('Total', {
      x: 500,
      y: y,
      size: 12,
      font: boldFont,
    });

    y -= 10;

    // Line
    page.drawLine({
      start: { x: 50, y: y },
      end: { x: 550, y: y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    y -= 20;

    // Items
    for (const item of invoice.items) {
      const total = item.price * item.quantity;
      page.drawText(item.description || 'N/A', {
        x: 50,
        y: y,
        size: 11,
        font: font,
      });
      page.drawText(item.quantity.toString(), {
        x: 350,
        y: y,
        size: 11,
        font: font,
      });
      page.drawText(`$${item.price.toFixed(2)}`, {
        x: 420,
        y: y,
        size: 11,
        font: font,
      });
      page.drawText(`$${total.toFixed(2)}`, {
        x: 500,
        y: y,
        size: 11,
        font: font,
      });
      y -= 18;
    }

    y -= 10;

    // Total
    page.drawLine({
      start: { x: 350, y: y },
      end: { x: 550, y: y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    y -= 20;

    page.drawText(`Total: $${invoice.total.toFixed(2)}`, {
      x: 420,
      y: y,
      size: 16,
      font: boldFont,
      color: rgb(0, 0, 0.8),
    });

    // Bank Details
    if (invoice.bankName || invoice.bankAccount) {
      y -= 40;
      page.drawText('Bank Details:', {
        x: 50,
        y: y,
        size: 14,
        font: boldFont,
      });

      y -= 20;
      if (invoice.bankName) {
        page.drawText(`Bank: ${invoice.bankName}`, {
          x: 50,
          y: y,
          size: 11,
          font: font,
        });
        y -= 16;
      }
      if (invoice.bankAccount) {
        page.drawText(`Account: ${invoice.bankAccount}`, {
          x: 50,
          y: y,
          size: 11,
          font: font,
        });
        y -= 16;
      }
      if (invoice.bankAccountName) {
        page.drawText(`Beneficiary: ${invoice.bankAccountName}`, {
          x: 50,
          y: y,
          size: 11,
          font: font,
        });
      }
    }

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes);

    // ✅ FIXED: Return the PDF with proper headers
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}