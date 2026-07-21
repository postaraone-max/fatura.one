import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#6366F1',
  },
  leftHeader: {
    flex: 1,
  },
  rightHeader: {
    alignItems: 'flex-end',
  },
  companyName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366F1',
    letterSpacing: 2,
  },
  docType: {
    fontSize: 18,
    color: '#4B5563',
    fontWeight: 'light',
  },
  badge: {
    backgroundColor: '#6366F1',
    padding: 8,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  infoSection: {
    flexDirection: 'row',
    marginBottom: 30,
    backgroundColor: '#F8F9FC',
    padding: 20,
    borderRadius: 8,
  },
  infoBlock: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: '#6366F1',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 4,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 10,
  },
  tableHeader: {
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    borderRadius: 4,
  },
  tableHeaderText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 11,
  },
  tableCol1: { width: '45%', paddingLeft: 12 },
  tableCol2: { width: '15%', textAlign: 'center' },
  tableCol3: { width: '20%', textAlign: 'right' },
  tableCol4: { width: '20%', textAlign: 'right', paddingRight: 12 },
  totals: {
    marginTop: 20,
    alignItems: 'flex-end',
    paddingRight: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 12,
    color: '#4B5563',
    width: 100,
    textAlign: 'right',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    width: 120,
    textAlign: 'right',
  },
  grandTotal: {
    borderTopWidth: 2,
    borderTopColor: '#6366F1',
    paddingTop: 10,
    marginTop: 4,
  },
  grandTotalValue: {
    fontSize: 18,
    color: '#6366F1',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#6B7280',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
});

interface InvoiceData {
  invoiceNumber: string;
  createdAt: Date;
  customerName: string;
  customerPhone?: string | null;
  customerEmail?: string | null;
  items: Array<{ description: string; quantity: number; price: number }>;
  total: number;
  currency: string;
  bankName?: string | null;
  bankAccount?: string | null;
  bankAccountName?: string | null;
}

export const ModernTemplate = ({ data }: { data: InvoiceData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          <Text style={styles.companyName}>FATURA</Text>
          <Text style={styles.docType}>Modern Invoice</Text>
        </View>
        <View style={styles.rightHeader}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>#{data.invoiceNumber}</Text>
          </View>
          <Text style={{ fontSize: 10, color: '#4B5563', marginTop: 8 }}>
            {new Date(data.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Bill To</Text>
          <Text style={styles.value}>{data.customerName}</Text>
          {data.customerEmail && <Text style={styles.value}>{data.customerEmail}</Text>}
          {data.customerPhone && <Text style={styles.value}>{data.customerPhone}</Text>}
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Invoice Details</Text>
          <Text style={styles.value}>Status: Active</Text>
          <Text style={styles.value}>Due: On Receipt</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCol1, styles.tableHeaderText]}>Description</Text>
          <Text style={[styles.tableCol2, styles.tableHeaderText]}>Qty</Text>
          <Text style={[styles.tableCol3, styles.tableHeaderText]}>Price</Text>
          <Text style={[styles.tableCol4, styles.tableHeaderText]}>Total</Text>
        </View>
        {data.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCol1}>{item.description}</Text>
            <Text style={styles.tableCol2}>{item.quantity}</Text>
            <Text style={styles.tableCol3}>{data.currency} {item.price.toFixed(2)}</Text>
            <Text style={styles.tableCol4}>{data.currency} {(item.quantity * item.price).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>{data.currency} {data.total.toFixed(2)}</Text>
        </View>
        <View style={[styles.totalRow, styles.grandTotal]}>
          <Text style={[styles.totalLabel, { fontWeight: 'bold' }]}>Total:</Text>
          <Text style={[styles.totalValue, styles.grandTotalValue]}>{data.currency} {data.total.toFixed(2)}</Text>
        </View>
      </View>

      {data.bankName && (
        <View style={{ marginTop: 20, padding: 15, backgroundColor: '#F8F9FC', borderRadius: 8 }}>
          <Text style={{ fontSize: 10, color: '#6366F1', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 }}>
            Bank Details
          </Text>
          <Text style={{ fontSize: 10, color: '#111827', marginBottom: 2 }}>{data.bankName}</Text>
          {data.bankAccountName && <Text style={{ fontSize: 10, color: '#111827', marginBottom: 2 }}>{data.bankAccountName}</Text>}
          {data.bankAccount && <Text style={{ fontSize: 10, color: '#111827' }}>Account: {data.bankAccount}</Text>}
        </View>
      )}

      <View style={styles.footer}>
        <Text>Thank you for your business!</Text>
        <Text>Generated by Fatura.one</Text>
      </View>
    </Page>
  </Document>
);