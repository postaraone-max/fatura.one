"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  currency: string;
  bankName: string;
  bankAccount: string;
  bankAccountName: string;
  total: number;
  status: string;
  createdAt: string;
  items: { description: string; quantity: number; price: number }[];
}

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await fetch(`/api/invoice/${params.id}`);
        if (!res.ok) throw new Error("Invoice not found");
        const data = await res.json();
        setInvoice(data);
        const qrData = JSON.stringify({
          bankName: data.bankName,
          bankAccount: data.bankAccount,
          bankAccountName: data.bankAccountName,
        });
        const qr = await QRCode.toDataURL(qrData);
        setQrDataUrl(qr);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [params.id]);

  const handleMarkAsPaid = async () => {
    try {
      const res = await fetch(`/api/invoice/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAID" }),
      });
      if (res.ok) {
        setInvoice((prev) => prev ? { ...prev, status: "PAID" } : null);
      } else {
        alert("Failed to mark as paid");
      }
    } catch (err) {
      alert("Error updating status");
    }
  };

  const handleSendWhatsApp = () => {
    if (!invoice) return;
    const link = `https://wa.me/${invoice.customerPhone}?text=Here%20is%20your%20invoice%20${invoice.invoiceNumber}%3A%20https%3A%2F%2Ffatura.one%2Finvoice%2F${invoice.id}`;
    window.open(link, "_blank");
  };

  const handleDownloadPDF = async () => {
    if (!invoice) return;
    const printDiv = document.createElement("div");
    printDiv.style.position = "fixed";
    printDiv.style.left = "-9999px";
    printDiv.style.top = "0";
    printDiv.style.width = "800px";
    printDiv.style.backgroundColor = "white";
    printDiv.style.padding = "40px";
    printDiv.style.fontFamily = "Arial, sans-serif";

    const itemsHtml = invoice.items.map(item => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${item.description}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${item.quantity}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${item.price}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${(item.quantity * item.price).toFixed(2)}</td>
      </tr>
    `).join("");

    // Use absolute URL for the logo
    const logoUrl = "https://www.fatura.one/logo.png";

    printDiv.innerHTML = `
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
        <img src="${logoUrl}" alt="Fatura Logo" style="width: 50px; height: 50px; object-fit: contain;" />
        <div>
          <h1 style="font-size: 24px; margin: 0; color: #2563eb;">Fatura.one</h1>
          <p style="font-size: 12px; margin: 0; color: #6b7280;">فاترة.ون</p>
        </div>
      </div>
      <hr style="border: none; border-top: 2px solid #2563eb; margin-bottom: 20px;" />
      <h2 style="font-size: 20px; margin-bottom: 20px;">Invoice ${invoice.invoiceNumber}</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
        <div>
          <p><strong>Customer:</strong> ${invoice.customerName}</p>
          <p><strong>Email:</strong> ${invoice.customerEmail}</p>
          <p><strong>Phone:</strong> ${invoice.customerPhone}</p>
        </div>
        <div>
          <p><strong>Total:</strong> ${invoice.total} ${invoice.currency}</p>
          <p><strong>Status:</strong> ${invoice.status}</p>
          <p><strong>Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <h2 style="font-size: 18px; margin-top: 20px;">Items</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr style="border-bottom: 2px solid #333;">
            <th style="text-align: left; padding: 8px 0;">Description</th>
            <th style="text-align: right; padding: 8px 0;">Qty</th>
            <th style="text-align: right; padding: 8px 0;">Price</th>
            <th style="text-align: right; padding: 8px 0;">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      ${qrDataUrl ? `<div style="margin-top: 30px;"><h3>QR Code (Bank Details)</h3><img src="${qrDataUrl}" width="150" height="150" /></div>` : ""}
    `;

    document.body.appendChild(printDiv);

    try {
      const canvas = await html2canvas(printDiv, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
    } catch (err) {
      alert("Failed to generate PDF");
    } finally {
      document.body.removeChild(printDiv);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!invoice) return <div className="p-8">Invoice not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Logo section */}
      <div className="flex items-center gap-3 mb-6">
        <Image src="/logo.png" alt="Fatura Logo" width={50} height={50} className="rounded" />
        <div>
          <h1 className="text-2xl font-bold text-blue-600 leading-tight">Fatura.one</h1>
          <p className="text-sm text-gray-500" style={{ fontFamily: 'Arial, sans-serif' }}>فاترة.ون</p>
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-4">Invoice {invoice.invoiceNumber}</h2>
      <div id="invoice-content" className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Customer:</strong> {invoice.customerName}</p>
            <p><strong>Email:</strong> {invoice.customerEmail}</p>
            <p><strong>Phone:</strong> {invoice.customerPhone}</p>
          </div>
          <div>
            <p><strong>Total:</strong> {invoice.total} {invoice.currency}</p>
            <p><strong>Status:</strong> <span className={`inline-block px-2 py-1 rounded text-sm ${invoice.status === "PAID" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{invoice.status}</span></p>
            <p><strong>Date:</strong> {new Date(invoice.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="mt-4">
          <h2 className="font-semibold">Items</h2>
          <table className="w-full mt-2 border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1">Description</th>
                <th className="text-right py-1">Qty</th>
                <th className="text-right py-1">Price</th>
                <th className="text-right py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-1">{item.description}</td>
                  <td className="text-right">{item.quantity}</td>
                  <td className="text-right">{item.price}</td>
                  <td className="text-right">{(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          {invoice.status !== "PAID" && (
            <button onClick={handleMarkAsPaid} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Mark as Paid
            </button>
          )}
          <button onClick={handleSendWhatsApp} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Send via WhatsApp
          </button>
          <button onClick={handleDownloadPDF} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Download PDF
          </button>
          <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="font-semibold mb-2">QR Code (Bank Details)</h2>
        {qrDataUrl ? <img src={qrDataUrl} alt="QR Code" width={200} height={200} /> : <p>Loading QR...</p>}
      </div>
    </div>
  );
}