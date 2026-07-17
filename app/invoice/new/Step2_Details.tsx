'use client';

import { UseFormReturn } from 'react-hook-form';
import { InvoiceFormData } from '@/lib/validations/invoice.schema';
import { useI18n } from '@/lib/i18n/provider';
import LogoUpload from './components/LogoUpload';

interface Step2_DetailsProps {
  methods: UseFormReturn<InvoiceFormData>;
  activeTab: 'customer' | 'items' | 'bank' | 'settings';
  setActiveTab: (tab: 'customer' | 'items' | 'bank' | 'settings') => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2_Details({
  methods,
  activeTab,
  setActiveTab,
  onNext,
  onBack,
}: Step2_DetailsProps) {
  const { t } = useI18n();
  const { register, formState: { errors } } = methods;

  return (
    <div className="space-y-4">
      <div className="flex border-b">
        {(['customer', 'items', 'bank', 'settings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t(`invoice.tabs.${tab}`) || tab}
          </button>
        ))}
      </div>

      <div className="py-4">
        {activeTab === 'customer' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">{t('invoice.customerName')}</label>
              <input
                {...register('customerName')}
                className="mt-1 w-full border rounded px-3 py-2"
                placeholder={t('invoice.customerNamePlaceholder') || 'Customer name'}
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">{t('invoice.customerEmail')}</label>
              <input
                {...register('customerEmail')}
                className="mt-1 w-full border rounded px-3 py-2"
                placeholder="Email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">{t('invoice.customerPhone')}</label>
              <input
                {...register('customerPhone')}
                className="mt-1 w-full border rounded px-3 py-2"
                placeholder="Phone"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">{t('invoice.customerAddress')}</label>
              <input
                {...register('customerAddress')}
                className="mt-1 w-full border rounded px-3 py-2"
                placeholder="Address"
              />
            </div>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium">Description</label>
                <input
                  {...register('items.0.description')}
                  className="mt-1 w-full border rounded px-3 py-2"
                  placeholder="Item description"
                />
              </div>
              <div className="w-20">
                <label className="block text-sm font-medium">Qty</label>
                <input
                  type="number"
                  {...register('items.0.quantity', { valueAsNumber: true })}
                  className="mt-1 w-full border rounded px-3 py-2"
                />
              </div>
              <div className="w-24">
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('items.0.price', { valueAsNumber: true })}
                  className="mt-1 w-full border rounded px-3 py-2"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bank' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Bank Name</label>
              <input {...register('bankName')} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Account Number</label>
              <input {...register('bankAccount')} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Account Name</label>
              <input {...register('bankAccountName')} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Currency</label>
              <select {...register('currency')} className="mt-1 w-full border rounded px-3 py-2">
                <option value="SEK">SEK</option>
                <option value="IQD">IQD</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Due Date</label>
              <input type="date" {...register('dueDate')} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Notes</label>
              <textarea {...register('notes')} rows={3} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Company Logo</h3>
              <LogoUpload />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4 border-t">
        <button onClick={onBack} className="px-4 py-2 border rounded hover:bg-gray-100">
          {t('common.back') || 'Back'}
        </button>
        <button onClick={onNext} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {t('common.next') || 'Next'}
        </button>
      </div>
    </div>
  );
}