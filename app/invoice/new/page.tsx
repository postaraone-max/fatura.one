'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useI18n } from '@/lib/i18n/provider';
import Step1_Type from './Step1_Type';
import Step2_Details from './Step2_Details';
import Step3_Preview from './Step3_Preview';
import { invoiceFormSchema, defaultInvoiceValues, InvoiceFormData } from '@/lib/validations/invoice.schema';

export default function NewInvoicePage() {
  const { t } = useI18n();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<'invoice' | 'receipt' | 'quote' | 'proforma' | 'credit_note'>('invoice');
  const [activeTab, setActiveTab] = useState<'customer' | 'items' | 'bank' | 'settings'>('customer');
  const [template, setTemplate] = useState('Minimal');
  const [createdInvoice, setCreatedInvoice] = useState<{ id: string; invoiceNumber: string } | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const methods = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: defaultInvoiceValues,
    mode: 'onChange',
  });

  const { getValues, setValue } = methods;

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleTypeSelect = (type: string) => {
    setSelectedType(type as any);
    setValue('documentType', type);
  };

  const handleTemplateChange = (tpl: string) => {
    setTemplate(tpl);
    setValue('template', tpl);
  };

  const handleCreateInvoice = async () => {
    const data = getValues();
    setIsCreating(true);
    setError(null);
    try {
      if (!data.customerName?.trim()) {
        throw new Error('Customer name is required');
      }
      const payload = {
        ...data,
        template: template,
        items: data.items || [],
      };

      const response = await fetch('/api/invoices/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('📦 API response:', result);

      if (result.id && result.invoiceNumber) {
        setCreatedInvoice({ id: result.id, invoiceNumber: result.invoiceNumber });
        setShowEmailModal(true);
      } else {
        throw new Error(`Unexpected response: ${JSON.stringify(result)}`);
      }
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSendGuestInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const emailInput = form.querySelector('#guest-email') as HTMLInputElement;
    const email = emailInput?.value;

    if (!email || !createdInvoice) return;

    setIsCreating(true);
    try {
      const res = await fetch('/api/invoices/send-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId: createdInvoice.id, email }),
      });

      const data = await res.json();
      if (data.success) {
        alert('✅ Invoice sent to your email! Check your inbox.');
        setShowEmailModal(false);
      } else {
        alert('❌ ' + (data.error || 'Failed to send invoice'));
      }
    } catch (error) {
      alert('❌ An error occurred. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t('invoice.newTitle') || 'Create Invoice'}</h1>

        <div className="flex items-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s
                    ? 'bg-blue-600 text-white'
                    : step > s
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
              {s < 3 && <div className="w-12 h-0.5 bg-gray-200 mx-2" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <Step1_Type
            onSelect={handleTypeSelect}
            onNext={nextStep}
            selected={selectedType}
          />
        )}

        {step === 2 && (
          <Step2_Details
            methods={methods}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {step === 3 && (
          <Step3_Preview
            data={getValues()}
            onBack={prevStep}
            onTemplateChange={handleTemplateChange}
            onCreateInvoice={handleCreateInvoice}
            isCreating={isCreating}
            error={error}
            createdInvoice={createdInvoice}
          />
        )}

        {/* Email Capture Modal */}
        {showEmailModal && createdInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-2">🎉 Invoice Created!</h2>
              <p className="text-gray-600 mb-4">
                Your invoice <strong>{createdInvoice.invoiceNumber}</strong> is ready.
              </p>
              <p className="text-gray-600 mb-6">
                Enter your email to get the PDF and save your invoice.
              </p>
              <form id="email-form" onSubmit={handleSendGuestInvoice} className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  id="guest-email"
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Get My Invoice
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEmailModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </FormProvider>
  );
}