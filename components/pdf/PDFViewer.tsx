'use client';

import React, { useState } from 'react';
import { generatePDF } from './PDFGenerator';
import { InvoiceData } from './PDFGenerator';

interface PDFViewerProps {
  data: InvoiceData;
  buttonText?: string;
  onSuccess?: (buffer: Buffer) => void;
  onError?: (error: Error) => void;
}

export default function PDFViewer({ 
  data, 
  buttonText = 'Download PDF',
  onSuccess,
  onError 
}: PDFViewerProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const buffer = await generatePDF(data);
      onSuccess?.(buffer);
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition flex items-center gap-2"
    >
      {loading ? '⏳ Generating...' : `📄 ${buttonText}`}
    </button>
  );
}