'use client';

import Link from 'next/link';
import { useState } from 'react';
import DownloadPDFButton from '@/components/DownloadPDFButton';

interface InvoiceActionsProps {
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail?: string | null;
  total: number;
  currency: string;
  status?: string | null;  // ← This must exist
}

export default function InvoiceActions({
  invoiceId,
  invoiceNumber,
  customerName,
  customerEmail,
  total,
  currency,
  status,  // ← This must exist
}: InvoiceActionsProps) {
  const [isPaying, setIsPaying] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=Here is your invoice ${invoiceNumber}: ${window.location.href}`;
    window.open(url, '_blank');
  };

  const handleEmail = async () => {
    if (!customerEmail) {
      alert('No email address found for this customer.');
      return;
    }

    try {
      const response = await fetch('/api/invoices/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invoiceId,
          email: customerEmail,
          subject: `Invoice ${invoiceNumber}`,
          message: `
            <h1>Invoice ${invoiceNumber}</h1>
            <p>Dear ${customerName},</p>
            <p>Please find your invoice attached.</p>
            <br/>
            <p><strong>Total:</strong> ${total} ${currency}</p>
            <br/>
            <p>View online: <a href="${window.location.href}">Click here</a></p>
            <br/>
            <p>Thank you for your business!</p>
          `,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('✅ Email sent successfully with PDF attachment!');
      } else {
        alert(`❌ Failed to send email: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Email error:', error);
      alert('❌ Failed to send email. Please try again.');
    }
  };

  const handlePayNow = async () => {
    setIsPaying(true);
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/payment-link`);
      const data = await response.json();
      
      if (data.url) {
        window.open(data.url, '_blank');
      } else {
        alert('Failed to create payment link. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <DownloadPDFButton 
        invoiceId={invoiceId} 
        invoiceNumber={invoiceNumber} 
      />
      
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
      
      {status !== 'PAID' && (
        <button
          onClick={handlePayNow}
          disabled={isPaying}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {isPaying ? '⏳ Processing...' : '💳 Pay Now'}
        </button>
      )}
      
      <Link
        href={`/invoice/${invoiceId}/edit`}
        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
      >
        ✏️ Edit
      </Link>
    </div>
  );
}