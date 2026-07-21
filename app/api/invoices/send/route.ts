import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma/client';
import { generatePDF } from '@/lib/pdf-generator';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { invoiceId, email, subject, message } = await req.json();

    console.log('📧 Email request received:', { invoiceId, email });

    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY is missing');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    if (!invoiceId) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    // Fetch invoice with items
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { items: true },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    console.log('✅ Invoice found:', invoice.invoiceNumber);

    // Generate PDF
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

    console.log('📄 Generating PDF...');
    const pdfBuffer = await generatePDF(pdfData);
    console.log('✅ PDF generated, size:', pdfBuffer.length);

    // Send email - FIXED: Send to yourself for testing
    const sendTo = process.env.NODE_ENV === 'production' 
      ? (email || invoice.customerEmail || '') 
      : 'postaraone@gmail.com';  // Always send to yourself in development

    console.log('📧 Sending email to:', sendTo);

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: sendTo,
      subject: subject || `Invoice ${invoice.invoiceNumber}`,
      html: message || `
        <h1>Invoice ${invoice.invoiceNumber}</h1>
        <p>Dear ${invoice.customerName},</p>
        <p>Please find your invoice attached.</p>
        <br/>
        <p><strong>Total:</strong> ${invoice.total} ${invoice.currency}</p>
        <br/>
        <p>View online: <a href="${process.env.NEXTAUTH_URL}/invoice/${invoice.id}/view">Click here</a></p>
        <br/>
        <p>Thank you for your business!</p>
        <br/>
        <p style="color: #999; font-size: 12px;">🔧 This email was sent to you for testing. In production, it would go to the customer.</p>
      `,
      attachments: [
        {
          filename: `invoice-${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer.toString('base64'),
        },
      ],
    });

    console.log('📧 Email response:', { data, error });

    if (error) {
      console.error('❌ Resend error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to send email' },
        { status: 500 }
      );
    }

    // Update invoice status
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'SENT' },
    });

    return NextResponse.json({
      success: true,
      message: 'Email sent with PDF attachment',
      data,
    });
  } catch (error) {
    console.error('❌ Send email error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
}