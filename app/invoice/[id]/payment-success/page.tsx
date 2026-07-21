import Link from 'next/link';
import { prisma } from '@/lib/prisma/client';

export default async function PaymentSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const invoice = await prisma.invoice.findUnique({
    where: { id },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-2">
          Invoice <strong>{invoice?.invoiceNumber}</strong> has been paid.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Thank you for your payment. You will receive a confirmation email shortly.
        </p>
        <Link
          href={`/invoice/${id}/view`}
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          View Invoice
        </Link>
      </div>
    </div>
  );
}