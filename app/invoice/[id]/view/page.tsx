import { prisma } from '@/lib/prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import InvoiceActions from './InvoiceActions';

interface ViewPageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoiceViewPage({ params }: ViewPageProps) {
  const { id } = await params;

  if (!id) {
    return (
      <div className="p-8 bg-red-50 text-red-800">
        <h1>Error: No invoice ID provided</h1>
        <p>Please check the link.</p>
      </div>
    );
  }

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        items: true,
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!invoice) {
      return (
        <div className="p-8 bg-yellow-50 text-yellow-800">
          <h1>⚠️ Invoice not found</h1>
          <p>We could not find an invoice with ID: <strong>{id}</strong></p>
          <Link href="/" className="text-blue-600 underline">Go home</Link>
        </div>
      );
    }

    // TRACK VIEW - Update view count
    try {
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          viewCount: { increment: 1 },
          viewedAt: new Date(),
          lastViewedAt: new Date(),
        },
      });
    } catch (error) {
      // Don't fail if tracking fails
      console.error('View tracking failed:', error);
    }

    const formatDate = (date: Date | null) => {
      if (!date) return '—';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    };

    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b pb-4">
            <div>
              {invoice.user?.image ? (
                <img src={invoice.user.image} alt="Logo" className="h-12 object-contain" />
              ) : (
                <div className="text-2xl font-bold text-gray-700">FATURA.ONE</div>
              )}
              <p className="text-sm text-gray-500 mt-1">Invoice #{invoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Issue date: {formatDate(invoice.createdAt)}</p>
              {invoice.viewCount > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  👁️ Viewed {invoice.viewCount} time{invoice.viewCount > 1 ? 's' : ''}
                  {invoice.lastViewedAt && ` (last: ${formatDate(invoice.lastViewedAt)})`}
                </p>
              )}
              <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                invoice.status === 'PAID' ? 'bg-green-100 text-green-800' :
                invoice.status === 'SENT' ? 'bg-blue-100 text-blue-800' :
                invoice.viewCount > 0 ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {invoice.status || (invoice.viewCount > 0 ? 'VIEWED' : 'DRAFT')}
              </span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">Bill to</h3>
            <p className="text-lg font-medium">{invoice.customerName}</p>
            {invoice.customerEmail && <p className="text-sm">{invoice.customerEmail}</p>}
            {invoice.customerPhone && <p className="text-sm">{invoice.customerPhone}</p>}
          </div>

          {/* Items Table */}
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="py-2">Description</th>
                  <th className="py-2 text-right">Qty</th>
                  <th className="py-2 text-right">Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-2">{item.description}</td>
                    <td className="py-2 text-right">{item.quantity}</td>
                    <td className="py-2 text-right">{item.price.toFixed(2)}</td>
                    <td className="py-2 text-right">{(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="pt-4 text-right font-semibold">Total</td>
                  <td className="pt-4 text-right font-bold">{invoice.total.toFixed(2)} {invoice.currency}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Bank Details */}
          {(invoice.bankName || invoice.bankAccount) && (
            <div className="mt-6 text-sm border-t pt-4">
              <p className="font-semibold">Bank Details</p>
              {invoice.bankName && <p>Bank: {invoice.bankName}</p>}
              {invoice.bankAccount && <p>Account: {invoice.bankAccount}</p>}
              {invoice.bankAccountName && <p>Account Name: {invoice.bankAccountName}</p>}
            </div>
          )}

          {/* Action Buttons - Using Client Component */}
          <div className="mt-8 pt-6 border-t">
            <InvoiceActions
              invoiceId={invoice.id}
              invoiceNumber={invoice.invoiceNumber}
              customerName={invoice.customerName}
              customerEmail={invoice.customerEmail}
              total={invoice.total}
              currency={invoice.currency}
            />
          </div>

          <div className="mt-8 text-center text-xs text-gray-400">
            This invoice is generated by <Link href="/" className="underline">FATURA.ONE</Link>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('❌ Prisma error:', error);
    return (
      <div className="p-8 bg-red-50 text-red-800">
        <h1>Database Error</h1>
        <pre>{String(error)}</pre>
      </div>
    );
  }
}