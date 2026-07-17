'use client';

import Link from 'next/link';

interface InvoiceActionsProps {
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail?: string | null;
  total: number;
  currency: string;
}

export default function InvoiceActions({
  invoiceId,
  invoiceNumber,
  customerName,
  customerEmail,
  total,
  currency,
}: InvoiceActionsProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=Here is your invoice ${invoiceNumber}: ${window.location.href}`;
    window.open(url, '_blank');
  };

  const handleEmail = () => {
    const subject = `Invoice ${invoiceNumber}`;
    const body = `Dear ${customerName},\n\nPlease find your invoice ${invoiceNumber} attached.\n\nTotal: ${total} ${currency}\n\nView: ${window.location.href}`;
    window.location.href = `mailto:${customerEmail || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={handlePrint}
        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        🖨️ Print / PDF
      </button>
      <button
        onClick={handleWhatsApp}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        💬 WhatsApp
      </button>
      <button
        onClick={handleEmail}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        ✉️ Email
      </button>
      <Link
        href={`/invoice/${invoiceId}/edit`}
        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
      >
        ✏️ Edit
      </Link>
    </div>
  );
}