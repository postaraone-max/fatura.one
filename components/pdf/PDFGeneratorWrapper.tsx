import dynamic from 'next/dynamic';

// Dynamically import PDFGenerator to avoid SSR issues
export const PDFGenerator = dynamic(
  () => import('./PDFGenerator').then((mod) => mod.PDFGenerator),
  { ssr: false }
);

export type { InvoiceData, TemplateType } from './PDFGenerator';