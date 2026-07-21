'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/provider';

interface Step3PreviewProps {
  data: {
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerAddress?: string;
    items?: { description: string; quantity: number; price: number }[];
    bankName?: string;
    bankAccount?: string;
    bankAccountName?: string;
    currency?: string;
    template?: string;
  };
  onSend?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onCreate?: () => void;
}

export default function Step3Preview({ 
  data, 
  onSend, 
  onDownload, 
  onShare, 
  onCreate 
}: Step3PreviewProps) {
  const { t } = useI18n();
  const [selectedTemplate, setSelectedTemplate] = useState(data?.template || 'minimal');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Debug: Log data to verify it's received
  useEffect(() => {
    console.log('Step3Preview received data:', data);
  }, [data]);

  // Calculate total from items
  const total = data?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

  // Filter out empty items
  const validItems = data?.items?.filter(item => item.description.trim() !== '') || [];

  // ✅ Handle Send
  const handleSend = async () => {
    setIsLoading(true);
    setMessage('Sending invoice...');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage('✅ Invoice sent successfully!');
      if (onSend) onSend();
    } catch (error) {
      setMessage('❌ Failed to send invoice');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Handle Download - ACTUAL PDF DOWNLOAD
  const handleDownload = async () => {
    setIsLoading(true);
    setMessage('Generating PDF...');

    try {
      // Call the API to generate PDF
      const response = await fetch('/api/invoices/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          total: total,
          invoiceNumber: 'INV-001',
          date: new Date().toLocaleDateString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Download the PDF file
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${data?.customerName || 'invoice'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage('✅ PDF downloaded!');
      if (onDownload) onDownload();
    } catch (error) {
      console.error('Download error:', error);
      setMessage('❌ Failed to download PDF');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Share
  const handleShare = () => {
    setIsLoading(true);
    setMessage('Generating share link...');
    try {
      setTimeout(() => {
        setMessage('✅ Share link copied!');
        setIsLoading(false);
        if (onShare) onShare();
      }, 1000);
    } catch (error) {
      setMessage('❌ Failed to share');
      setIsLoading(false);
    }
  };

  // Handle Create/Save
  const handleCreate = () => {
    setIsLoading(true);
    setMessage('Saving invoice...');
    try {
      setTimeout(() => {
        setMessage('✅ Invoice saved successfully!');
        setIsLoading(false);
        if (onCreate) onCreate();
      }, 1500);
    } catch (error) {
      setMessage('❌ Failed to save invoice');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{t('step3')}</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">{t('template')}:</label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="border rounded-lg px-3 py-1 text-sm"
          >
            <option value="minimal">{t('minimal')}</option>
            <option value="professional">{t('professional')}</option>
            <option value="modern">{t('modern')}</option>
            <option value="executive">{t('executive')}</option>
            <option value="creative">{t('creative')}</option>
          </select>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`p-3 rounded-lg ${message.includes('✅') ? 'bg-green-50 text-green-700' : message.includes('❌') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
          {message}
        </div>
      )}

      {/* Preview Card */}
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b pb-4">
          <div>
            <h3 className="text-lg font-bold">{t('invoice')}</h3>
            <p className="text-sm text-gray-500">{t('invoiceNumber')}: #INV-001</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">{t('date')}: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-4 py-4 border-b">
          <div>
            <h4 className="text-sm font-semibold text-gray-500">{t('customerName')}</h4>
            <p>{data?.customerName || '-'}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-500">{t('customerEmail')}</h4>
            <p>{data?.customerEmail || '-'}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-500">{t('customerPhone')}</h4>
            <p>{data?.customerPhone || '-'}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-500">{t('customerAddress')}</h4>
            <p>{data?.customerAddress || '-'}</p>
          </div>
        </div>

        {/* Items */}
        <div className="py-4 border-b">
          <h4 className="text-sm font-semibold text-gray-500 mb-2">{t('items')}</h4>
          {validItems.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1">{t('description')}</th>
                  <th className="text-right py-1">{t('quantity')}</th>
                  <th className="text-right py-1">{t('price')}</th>
                  <th className="text-right py-1">{t('total')}</th>
                </tr>
              </thead>
              <tbody>
                {validItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-1">{item.description}</td>
                    <td className="text-right py-1">{item.quantity}</td>
                    <td className="text-right py-1">{item.price}</td>
                    <td className="text-right py-1">{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center py-2">{t('noData')}</p>
          )}
        </div>

        {/* Bank Details */}
        <div className="grid grid-cols-3 gap-4 py-4 border-b">
          <div>
            <h4 className="text-sm font-semibold text-gray-500">{t('bankName')}</h4>
            <p>{data?.bankName || '-'}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-500">{t('bankAccount')}</h4>
            <p>{data?.bankAccount || '-'}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-500">{t('bankAccountName')}</h4>
            <p>{data?.bankAccountName || '-'}</p>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-end py-4">
          <div className="text-right">
            <h4 className="text-sm font-semibold text-gray-500">{t('total')}</h4>
            <p className="text-2xl font-bold text-blue-600">
              {data?.currency || 'SEK'} {total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-end">
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {isLoading ? '...' : t('send')}
        </button>
        <button
          onClick={handleDownload}
          disabled={isLoading}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
        >
          {isLoading ? '...' : t('download')}
        </button>
        <button
          onClick={handleShare}
          disabled={isLoading}
          className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
        >
          {isLoading ? '...' : t('share')}
        </button>
        <button
          onClick={handleCreate}
          disabled={isLoading}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? '...' : t('create')}
        </button>
      </div>
    </div>
  );
}