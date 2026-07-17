'use client';

import { useFormContext } from 'react-hook-form';
import { InvoiceFormData } from '@/lib/validations/invoice.schema';

const documentTypes = [
  { value: 'invoice', icon: '📄', label: 'Invoice', description: 'Standard invoice for goods or services.' },
  { value: 'receipt', icon: '🧾', label: 'Receipt', description: 'Proof of payment received.' },
  { value: 'quote', icon: '💬', label: 'Quote', description: 'Estimate before work begins.' },
  { value: 'proforma', icon: '📋', label: 'Proforma Invoice', description: 'Preliminary invoice before delivery.' },
  { value: 'credit_note', icon: '↩️', label: 'Credit Note', description: 'Adjust or refund an existing invoice.' },
] as const;

interface Step1_TypeProps {
  onSelect: (type: string) => void;
  onNext: () => void;
  selected: string;
}

export default function Step1_Type({ onSelect, onNext, selected }: Step1_TypeProps) {
  const { setValue } = useFormContext<InvoiceFormData>();

  const handleSelect = (type: string) => {
    setValue('documentType', type);
    onSelect(type);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Choose Document Type</h2>
      <p className="text-sm text-gray-500">Select the type of document you want to create</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {documentTypes.map((doc) => (
          <button
            key={doc.value}
            onClick={() => handleSelect(doc.value)}
            className={`p-4 border rounded-lg text-left transition-all ${
              selected === doc.value
                ? 'border-blue-600 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
            }`}
          >
            <div className="text-3xl mb-2">{doc.icon}</div>
            <div className="text-sm font-medium">{doc.label}</div>
            <div className="text-xs text-gray-500 mt-1">{doc.description}</div>
            {selected === doc.value && (
              <div className="mt-2 text-xs text-blue-600 font-medium">✓ Selected</div>
            )}
          </button>
        ))}
      </div>
      <div className="flex justify-end pt-4 border-t">
        <button
          onClick={onNext}
          disabled={!selected}
          className={`px-4 py-2 rounded ${
            selected
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}