'use client';

import dynamic from 'next/dynamic';

// ✅ Dynamically import the PDF Viewer component (which is a React component)
const PDFViewer = dynamic(
  () => import('./PDFViewer'),
  { 
    ssr: false,
    loading: () => <div className="px-4 py-2 bg-gray-200 rounded-lg">Loading PDF...</div>
  }
);

export default PDFViewer;