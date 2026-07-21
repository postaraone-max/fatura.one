import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { MinimalTestPDF } from './MinimalTestPDF';

export interface InvoiceData {
  invoiceNumber: string;
  createdAt: Date;
  customerName: string;
  customerPhone?: string | null;
  customerEmail?: string | null;
  items: Array<{
    description: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  currency: string;
  bankName?: string | null;
  bankAccount?: string | null;
  bankAccountName?: string | null;
}

export type TemplateType = 'minimal' | 'professional' | 'modern' | 'executive' | 'creative';

export class PDFGenerator {
  static async generatePDF(data: InvoiceData, template: TemplateType = 'professional'): Promise<Buffer> {
    try {
      console.log('Generating PDF with data:', { 
        invoiceNumber: data.invoiceNumber,
        customerName: data.customerName,
        total: data.total 
      });
      
      // Use MinimalTestPDF for testing
      const element = React.createElement(MinimalTestPDF, { data });
      const pdfBuffer = await renderToBuffer(element);
      
      console.log('PDF generated successfully, size:', pdfBuffer.length);
      return pdfBuffer;
    } catch (error) {
      console.error('Error in generatePDF:', error);
      throw error;
    }
  }

  static getTemplateNames(): TemplateType[] {
    return ['minimal', 'professional', 'modern', 'executive', 'creative'];
  }
}