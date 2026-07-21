import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    backgroundColor: '#1F2937',
    padding: 20,
    marginBottom: 30,
    marginLeft: -40,
    marginRight: -40,
    marginTop: -40,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  companyName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  docType: {
    fontSize: 14,
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  infoGrid: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  infoColumn: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: '#6B7280',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 6,
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
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#1F2937',
  },
  tableCol1: { width: '50%' },
  tableCol2: { width: '20%', textAlign: 'right' },
  tableCol3: { width: '15%', textAlign: 'right' },
  tableCol4: { width: '15%', textAlign: 'right' },
  totals: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 12,
    color: '#6B7280',
    width: 80,
    textAlign: 'right',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    width: 100,
    textAlign: 'right',
  },
  grandTotal: {
    borderTopWidth: 2,
    borderTopColor: '#1F2937',
    paddingTop: 8,
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
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

export const ProfessionalTemplate = ({ data }: { data: InvoiceData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.companyName}>FATURA.ONE</Text>
          <Text style={styles.docType}>Professional Invoice</Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoColumn}>
          <Text style={styles.label}>Invoice #</Text>
          <Text style={styles.value}>{data.invoiceNumber}</Text>
        </View>
        <View style={styles.infoColumn}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{new Date(data.createdAt).toLocaleDateString()}</Text>
        </View>
        <View style={styles.infoColumn}>
          <Text style={styles.label}>Bill To</Text>
          <Text style={styles.value}>{data.customerName}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCol1}>Description</Text>
          <Text style={styles.tableCol2}>Qty</Text>
          <Text style={styles.tableCol3}>Price</Text>
          <Text style={styles.tableCol4}>Total</Text>
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
          <Text style={[styles.totalValue, { fontSize: 16 }]}>{data.currency} {data.total.toFixed(2)}</Text>
        </View>
      </View>

      {data.bankName && (
        <View style={{ marginTop: 20, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
          <Text style={{ fontSize: 9, color: '#6B7280', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 }}>
            Payment Information
          </Text>
          <Text style={{ fontSize: 10, color: '#111827', marginBottom: 2 }}>Bank: {data.bankName}</Text>
          {data.bankAccountName && <Text style={{ fontSize: 10, color: '#111827', marginBottom: 2 }}>Account Name: {data.bankAccountName}</Text>}
          {data.bankAccount && <Text style={{ fontSize: 10, color: '#111827' }}>Account Number: {data.bankAccount}</Text>}
        </View>
      )}

      <Text style={styles.footer}>This is a computer-generated invoice. Thank you for your business!</Text>
    </Page>
  </Document>
);