'use client';

import { useI18n } from '@/lib/i18n/provider';

const documentTypes = [
  { id: 'invoice', icon: '📄' },
  { id: 'receipt', icon: '🧾' },
  { id: 'quote', icon: '📋' },
  { id: 'proforma', icon: '📑' },
  { id: 'creditNote', icon: '↩️' },
];

export default function Step1_Type({ selectedType, onSelect }: any) {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {documentTypes.map((type) => (
        <button
          key={type.id}
          onClick={() => onSelect(type.id)}
          className={`p-4 border rounded-lg text-center transition-colors ${
            selectedType === type.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-2xl mb-2">{type.icon}</div>
          <div className="text-sm font-medium">{t(type.id)}</div>
        </button>
      ))}
    </div>
  );
}