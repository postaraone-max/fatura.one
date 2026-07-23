import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import MinimalTestPDF from './MinimalTestPDF';

export interface InvoiceData {
  invoiceNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  total: number;
  currency: string;
  status: string;
  createdAt: string;
  dueDate?: string;
  items: Array<{
    description: string;
    quantity: number;
    price: number;
  }>;
  bankName?: string;
  bankAccount?: string;
  bankAccountName?: string;
}

export async function generatePDF(data: InvoiceData): Promise<Buffer> {
  // ✅ FIXED: Render the PDF component and return the buffer
  const buffer = await renderToBuffer(
    React.createElement(MinimalTestPDF, { data })
  );
  return Buffer.from(buffer);
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  return generatePDF(data);
}

export default { generatePDF, generateInvoicePDF };