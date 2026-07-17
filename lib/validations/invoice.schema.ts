import { z } from 'zod';

// Schema for the API (matches the request body)
export const invoiceSchema = z.object({
  documentType: z.enum(['invoice', 'receipt', 'quote', 'proforma', 'credit_note']).optional(),
  template: z.string().optional(),
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  customerAddress: z.string().optional(),
  taxId: z.string().optional(),
  items: z.array(
    z.object({
      description: z.string().min(1),
      quantity: z.number().positive(),
      price: z.number().positive(),
    })
  ),
  currency: z.string().default('SEK'),
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  bankAccountName: z.string().optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  total: z.number().optional(),
});

// Form schema (same shape)
export const invoiceFormSchema = invoiceSchema;

// Default values for the form – MUST BE EXPORTED
export const defaultInvoiceValues = {
  documentType: 'invoice',
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  customerAddress: '',
  taxId: '',
  items: [{ description: 'Item 1', quantity: 1, price: 10 }],
  currency: 'SEK',
  bankName: '',
  bankAccount: '',
  bankAccountName: '',
  dueDate: '',
  notes: '',
  template: 'Minimal',
};

// Types
export type InvoiceFormData = z.infer<typeof invoiceFormSchema>;
export type InvoiceData = z.infer<typeof invoiceSchema>;