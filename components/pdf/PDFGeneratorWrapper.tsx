'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the PDF generator functions
const PDFGenerator = dynamic(
  () => import('./PDFGenerator').then((mod) => mod.default || mod),
  { ssr: false }
);

// Export the component with the functions
export default function PDFGeneratorWrapper({ 
  data, 
  onSuccess, 
  onError 
}: { 
  data: any, 
  onSuccess?: (buffer: Buffer) => void, 
  onError?: (error: Error) => void 
}) {
  // This component is a wrapper to use the PDFGenerator functions
  // You can use the imported functions directly
  const handleGeneratePDF = async () => {
    try {
      const { generatePDF } = await import('./PDFGenerator');
      const buffer = await generatePDF(data);
      onSuccess?.(buffer);
    } catch (error) {
      onError?.(error as Error);
    }
  };

  return (
    <div>
      <button
        onClick={handleGeneratePDF}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
      >
        Generate PDF
      </button>
    </div>
  );
}

// Re-export functions for direct use
export { generatePDF, generateInvoicePDF } from './PDFGenerator';