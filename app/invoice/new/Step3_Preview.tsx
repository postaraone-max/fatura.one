'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/provider';
import { generateWhatsAppLink } from '@/lib/utils/whatsapp';

interface Step3PreviewProps {
  data: any;
  onBack: () => void;
  onTemplateChange: (template: string) => void;
  onCreateInvoice: () => void;
  isCreating: boolean;
  error: string | null;
  createdInvoice: { id: string; invoiceNumber: string } | null;
}

const TEMPLATES = ['Minimal', 'Professional', 'Modern', 'Executive', 'Creative'];

export default function Step3Preview({
  data,
  onBack,
  onTemplateChange,
  onCreateInvoice,
  isCreating,
  error,
  createdInvoice,
}: Step3PreviewProps) {
  const { t, locale } = useI18n();
  const [selectedTemplate, setSelectedTemplate] = useState(data.template || 'Minimal');

  // Debug – log when createdInvoice changes
  useEffect(() => {
    console.log('🔍 Step3 received createdInvoice:', createdInvoice);
  }, [createdInvoice]);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedTemplate(val);
    onTemplateChange(val);
  };

  const handleShareWhatsApp = () => {
    if (!createdInvoice) {
      alert('Please create an invoice first.');
      return;
    }
    const baseUrl = window.location.origin;
    const viewLink = `${baseUrl}/invoice/${createdInvoice.id}/view`;
    const total = data.total || 0;
    const currency = data.currency || 'SEK';
    const waLink = generateWhatsAppLink(
      createdInvoice.invoiceNumber,
      total,
      viewLink,
      currency,
      locale
    );
    window.open(waLink, '_blank');
  };

  const handleViewInvoice = () => {
    if (!createdInvoice) return;
    const baseUrl = window.location.origin;
    window.open(`${baseUrl}/invoice/${createdInvoice.id}/view`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Title – hardcoded for clarity */}
      <h2 className="text-2xl font-bold">Preview &amp; Send</h2>

      {/* Template selector */}
      <div className="flex items-center space-x-4">
        <label htmlFor="template" className="font-medium">
          Template:
        </label>
        <select
          id="template"
          value={selectedTemplate}
          onChange={handleTemplateChange}
          className="border rounded p-2"
        >
          {TEMPLATES.map((tpl) => (
            <option key={tpl} value={tpl}>{tpl}</option>
          ))}
        </select>
      </div>

      {/* PDF Preview placeholder */}
      <div className="border rounded-lg p-4 bg-gray-50 min-h-[400px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">PDF Preview</p>
          <p className="text-sm">Template: {selectedTemplate}</p>
          <p className="text-xs mt-2">(The actual PDF will appear here once the invoice is created)</p>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 items-center">
        <button
          onClick={onBack}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Back
        </button>

        <button
          onClick={onCreateInvoice}
          disabled={isCreating}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isCreating ? 'Creating...' : 'Create Invoice'}
        </button>

        {/* WhatsApp button – always visible, enabled when invoice exists */}
        <button
          onClick={handleShareWhatsApp}
          disabled={!createdInvoice}
          className={`px-6 py-2 rounded text-white ${
            createdInvoice
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          📱 Share via WhatsApp
        </button>

        {/* View Invoice button – appears only after creation */}
        {createdInvoice && (
          <button
            onClick={handleViewInvoice}
            className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            👁️ View Invoice
          </button>
        )}
      </div>

      {/* Success message after creation */}
      {createdInvoice && (
        <div className="text-sm text-green-600 mt-2">
          ✅ Invoice <strong>{createdInvoice.invoiceNumber}</strong> created!
          Use the buttons above to share or view it.
        </div>
      )}
    </div>
  );
}