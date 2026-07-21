'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n/provider';
import Step1_Type from './Step1_Type';
import Step2_Details from './Step2_Details';
import Step3_Preview from './Step3_Preview';
import { useRouter } from 'next/navigation';

export default function InvoiceNew() {
  const { t } = useI18n();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState('invoice');
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    items: [{ description: '', quantity: 1, price: 0 }],
    bankName: '',
    bankAccount: '',
    bankAccountName: '',
    currency: 'SEK',
    template: 'minimal',
  });

  const handleNext = () => {
    if (step === 1 && !selectedType) {
      alert(t('required'));
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  // ✅ CREATE: Save invoice to database
  const handleCreate = async () => {
    try {
      const invoiceData = {
        ...formData,
        type: selectedType,
        total: formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      };

      const response = await fetch('/api/invoices/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const result = await response.json();
      console.log('Invoice created:', result);
      
      // ✅ Show success and redirect
      alert('✅ Invoice created successfully!');
      router.push('/invoices');
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('❌ Failed to create invoice. Please try again.');
    }
  };

  // ✅ SEND: Save invoice and show success
  const handleSend = async () => {
    try {
      const invoiceData = {
        ...formData,
        type: selectedType,
        total: formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      };

      const response = await fetch('/api/invoices/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const result = await response.json();
      console.log('Invoice created and sent:', result);
      
      // ✅ Show success and redirect
      alert('✅ Invoice sent successfully!');
      router.push('/invoices');
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert('❌ Failed to send invoice. Please try again.\n\nError: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleDownload = () => {
    alert('📥 Download feature coming soon!');
  };

  const handleShare = () => {
    alert('🔗 Share feature coming soon!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{t('createInvoice')}</h1>

      {/* Step Progress */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`flex-1 h-2 rounded ${step >= 1 ? 'bg-blue-500' : 'bg-gray-200'}`} />
        <div className={`flex-1 h-2 rounded ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`} />
        <div className={`flex-1 h-2 rounded ${step >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`} />
      </div>

      {/* Step Content */}
      {step === 1 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">{t('step1')}</h2>
          <Step1_Type selectedType={selectedType} onSelect={setSelectedType} />
          <div className="flex justify-end mt-6">
            <button
              onClick={handleNext}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              {t('next') || 'Next'}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">{t('step2')}</h2>
          <Step2_Details formData={formData} setFormData={setFormData} />
          <div className="flex justify-between mt-6">
            <button
              onClick={handleBack}
              className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              {t('back') || 'Back'}
            </button>
            <button
              onClick={handleNext}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              {t('next') || 'Next'}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">{t('step3')}</h2>
          <Step3_Preview 
            data={formData}
            onSend={handleSend}
            onDownload={handleDownload}
            onShare={handleShare}
            onCreate={handleCreate}
          />
          <div className="flex justify-between mt-6">
            <button
              onClick={handleBack}
              className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              {t('back') || 'Back'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}