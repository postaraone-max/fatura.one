/**
 * Generate a WhatsApp share link with a pre‑filled message.
 * @param invoiceNumber - e.g. "INV-20260708-0001"
 * @param total - total amount (number)
 * @param viewLink - full URL to the public invoice view
 * @param currency - currency code (default "SEK")
 * @param language - user language code (for localized message)
 * @returns WhatsApp share URL
 */
export function generateWhatsAppLink(
  invoiceNumber: string,
  total: number,
  viewLink: string,
  currency: string = 'SEK',
  language: string = 'en'
): string {
  // Simple message templates by language (you can expand later)
  const messages: Record<string, string> = {
    en: `Hi! Here is your invoice ${invoiceNumber} for ${total} ${currency}. View it here: ${viewLink}`,
    sv: `Hej! Här är din faktura ${invoiceNumber} på ${total} ${currency}. Se den här: ${viewLink}`,
    ku: `Slav! Li ser faktura ${invoiceNumber} ya ${total} ${currency} ye. Li vir bibîne: ${viewLink}`,
    ar: `مرحباً! هذه فاتورتك ${invoiceNumber} بمبلغ ${total} ${currency}. شاهدها هنا: ${viewLink}`,
  };
  const message = messages[language] || messages.en;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/?text=${encoded}`;
}