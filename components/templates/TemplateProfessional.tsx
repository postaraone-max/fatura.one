import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { InvoiceFormData } from "@/lib/validations/invoice.schema";

const styles = StyleSheet.create({
  page: { padding: 0, backgroundColor: "#ffffff" },
  headerBar: { backgroundColor: "#1e293b", padding: 30, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: "#ffffff" },
  headerSub: { fontSize: 12, color: "#94a3b8", marginTop: 4 },
  content: { padding: 30 },
  infoGrid: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  infoColumn: { flex: 1 },
  infoLabel: { fontSize: 10, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 },
  infoValue: { fontSize: 12, fontWeight: "medium", color: "#111827" },
  table: { marginBottom: 30 },
  tableHeader: { flexDirection: "row", backgroundColor: "#f1f5f9", padding: 10, borderBottom: "2px solid #1e293b" },
  tableHeaderText: { fontSize: 10, fontWeight: "bold", color: "#1e293b", textTransform: "uppercase" },
  tableRow: { flexDirection: "row", padding: 10, borderBottom: "1px solid #e5e7eb" },
  tableCell: { fontSize: 10, color: "#111827" },
  totalRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 20, borderTop: "2px solid #1e293b", paddingTop: 15 },
  totalLabel: { fontSize: 16, fontWeight: "bold", color: "#1e293b", marginRight: 20 },
  totalValue: { fontSize: 18, fontWeight: "bold", color: "#1e293b" },
  footer: { marginTop: 30, paddingTop: 20, borderTop: "1px solid #e5e7eb", textAlign: "center", fontSize: 10, color: "#6b7280" },
});

interface Props {
  data: InvoiceFormData;
  logoUrl?: string | null;
  invoiceNumber?: string;
}

export default function TemplateProfessional({ data, logoUrl, invoiceNumber }: Props) {
  const subtotal = data.items.reduce((sum, item) => sum + (item.quantity || 0) * (item.price || 0), 0);
  const total = subtotal;

  const docTypeMap: Record<string, string> = {
    invoice: "INVOICE",
    receipt: "RECEIPT",
    quote: "QUOTE",
    proforma: "PROFORMA INVOICE",
    credit_note: "CREDIT NOTE",
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBar}>
          <View>
            <Text style={styles.headerTitle}>{docTypeMap[data.documentType] || "INVOICE"}</Text>
            <Text style={styles.headerSub}>#{invoiceNumber || "DRAFT-001"}</Text>
          </View>
          {logoUrl && <Image src={logoUrl} style={{ width: 60, height: 60, backgroundColor: "#ffffff", padding: 4 }} />}
        </View>

        <View style={styles.content}>
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

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{data.currency} {total.toFixed(2)}</Text>
          </View>

          {data.notes && (
            <View style={{ marginTop: 20 }}>
              <Text style={styles.infoLabel}>Notes</Text>
              <Text style={styles.infoValue}>{data.notes}</Text>
            </View>
          )}

          {(data.bankName || data.bankAccount) && (
            <View style={{ marginTop: 20, paddingTop: 15, borderTop: "1px solid #e5e7eb" }}>
              <Text style={styles.infoLabel}>Bank Details</Text>
              {data.bankName && <Text style={styles.infoValue}>{data.bankName}</Text>}
              {data.bankAccount && <Text style={styles.infoValue}>Account: {data.bankAccount}</Text>}
              {data.bankAccountName && <Text style={styles.infoValue}>Name: {data.bankAccountName}</Text>}
            </View>
          )}

          <View style={styles.footer}>
            <Text>Thank you for your business.</Text>
            <Text style={{ fontSize: 8, color: "#9ca3af", marginTop: 4 }}>Generated by Fatura.one</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}