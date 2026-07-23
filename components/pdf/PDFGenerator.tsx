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
  // ... your PDF generation logic
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  return generatePDF(data);
}