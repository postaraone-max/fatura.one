import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { InvoiceFormData } from "@/lib/validations/invoice.schema";

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: "#ffffff" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30, borderBottom: "1px solid #e5e7eb", paddingBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#111827" },
  subtitle: { fontSize: 10, color: "#6b7280", marginTop: 4 },
  infoGrid: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  infoColumn: { flex: 1 },
  infoLabel: { fontSize: 10, color: "#6b7280", marginBottom: 4 },
  infoValue: { fontSize: 12, fontWeight: "medium", color: "#111827" },
  table: { marginBottom: 30 },
  tableHeader: { flexDirection: "row", backgroundColor: "#f3f4f6", padding: 8, borderBottom: "1px solid #d1d5db" },
  tableHeaderText: { fontSize: 10, fontWeight: "bold", color: "#374151" },
  tableRow: { flexDirection: "row", padding: 8, borderBottom: "1px solid #e5e7eb" },
  tableCell: { fontSize: 10, color: "#111827" },
  totalRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 20, borderTop: "2px solid #111827", paddingTop: 10 },
  totalLabel: { fontSize: 14, fontWeight: "bold", color: "#111827", marginRight: 20 },
  totalValue: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  footer: { position: "absolute", bottom: 40, left: 40, right: 40, textAlign: "center", fontSize: 10, color: "#6b7280", borderTop: "1px solid #e5e7eb", paddingTop: 20 },
});

interface Props {
  data: InvoiceFormData;
  logoUrl?: string | null;
  invoiceNumber?: string;
}

export default function TemplateMinimal({ data, logoUrl, invoiceNumber }: Props) {
  const subtotal = data.items.reduce((sum, item) => sum + (item.quantity || 0) * (item.price || 0), 0);
  const total = subtotal;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              {data.documentType === "invoice" && "INVOICE"}
              {data.documentType === "receipt" && "RECEIPT"}
              {data.documentType === "quote" && "QUOTE"}
              {data.documentType === "proforma" && "PROFORMA INVOICE"}
              {data.documentType === "credit_note" && "CREDIT NOTE"}
            </Text>
            <Text style={styles.subtitle}>#{invoiceNumber || "DRAFT-001"}</Text>
          </View>
          {logoUrl && <Image src={logoUrl} style={{ width: 80, height: 80 }} />}
        </View>

        {/* Client & Details */}
        <View style={styles.infoGrid}>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Bill To</Text>
            <Text style={styles.infoValue}>{data.customerName}</Text>
            {data.customerEmail && <Text style={styles.infoValue}>{data.customerEmail}</Text>}
            {data.customerPhone && <Text style={styles.infoValue}>{data.customerPhone}</Text>}
            {data.customerAddress && <Text style={styles.infoValue}>{data.customerAddress}</Text>}
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{data.dueDate ? new Date(data.dueDate).toLocaleDateString() : "N/A"}</Text>
            <Text style={[styles.infoLabel, { marginTop: 8 }]}>Currency</Text>
            <Text style={styles.infoValue}>{data.currency}</Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 3 }]}>Description</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: "right" }]}>Qty</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: "right" }]}>Price</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: "right" }]}>Total</Text>
          </View>
          {data.items.map((item, i) => (
            <View style={styles.tableRow} key={i}>
              <Text style={[styles.tableCell, { flex: 3 }]}>{item.description}</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>
                {data.currency} {item.price.toFixed(2)}
              </Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>
                {data.currency} {(item.quantity * item.price).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            {data.currency} {total.toFixed(2)}
          </Text>
        </View>

        {/* Notes */}
        {data.notes && (
          <View style={{ marginTop: 30 }}>
            <Text style={[styles.infoLabel, { marginBottom: 4 }]}>Notes</Text>
            <Text style={styles.infoValue}>{data.notes}</Text>
          </View>
        )}

        {/* Bank Details */}
        {(data.bankName || data.bankAccount) && (
          <View style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #e5e7eb" }}>
            <Text style={styles.infoLabel}>Bank Details</Text>
            {data.bankName && <Text style={styles.infoValue}>{data.bankName}</Text>}
            {data.bankAccount && <Text style={styles.infoValue}>Account: {data.bankAccount}</Text>}
            {data.bankAccountName && <Text style={styles.infoValue}>Name: {data.bankAccountName}</Text>}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your business. Payment due within 30 days.</Text>
          <Text style={{ marginTop: 4, fontSize: 8, color: "#9ca3af" }}>Generated by Fatura.one</Text>
        </View>
      </Page>
    </Document>
  );
}