'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n/provider';
import Step2_Details from '@/app/invoice/new/Step2_Details';
import Step3_Preview from '@/app/invoice/new/Step3_Preview';

export default function EditInvoicePage() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const invoiceId = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    items: [{ description: '', quantity: 1, price: 0 }],
    bankName: '',
    bankAccount: '',
    bankAccountName: '',
    currency: 'IQD',
    template: 'minimal',
  });

  // ✅ Fetch invoice data when page loads
  useEffect(() => {
    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`);
      if (!response.ok) throw new Error('Invoice not found');
      
      const invoice = await response.json();
      setFormData({
        customerName: invoice.customerName || '',
        customerEmail: invoice.customerEmail || '',
        customerPhone: invoice.customerPhone || '',
        customerAddress: invoice.customerAddress || '',
        items: invoice.items || [{ description: '', quantity: 1, price: 0 }],
        bankName: invoice.bankName || '',
        bankAccount: invoice.bankAccount || '',
        bankAccountName: invoice.bankAccountName || '',
        currency: invoice.currency || 'IQD',
        template: invoice.template || 'minimal',
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const invoiceData = {
        ...formData,
        total: formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      };

      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) throw new Error('Failed to update invoice');

      alert('✅ Invoice updated successfully!');
      router.push('/invoices');
    } catch (error) {
      console.error('Error updating invoice:', error);
      alert('❌ Failed to update invoice');
    }
  };

  if (loading) {
    return <div className="p-6">{t('loading')}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{t('editInvoice') || 'Edit Invoice'}</h1>
      
      <Step2_Details formData={formData} setFormData={setFormData} />
      
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => router.back()}
          className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300"
        >
          {t('cancel') || 'Cancel'}
        </button>
        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          {t('save') || 'Save Changes'}
        </button>
      </div>
    </div>
  );
}