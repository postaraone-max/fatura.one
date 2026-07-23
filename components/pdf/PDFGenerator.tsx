import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import MinimalTestPDF from './MinimalTestPDF';  // ✅ FIXED: Default import

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
  const buffer = await renderToBuffer(
    <MinimalTestPDF data={data} />
  );
  return Buffer.from(buffer);
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  // This function is a wrapper for future expansion
  return generatePDF(data);
}

export default { generatePDF, generateInvoicePDF };