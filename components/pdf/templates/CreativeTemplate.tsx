import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  sidebar: {
    backgroundColor: '#7C3AED',
    padding: 30,
    paddingTop: 40,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 200,
  },
  sidebarText: {
    color: '#FFFFFF',
  },
  sidebarTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    letterSpacing: 4,
  },
  sidebarLabel: {
    fontSize: 10,
    color: '#C4B5FD',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 16,
    marginBottom: 4,
  },
  sidebarValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  content: {
    marginLeft: 200,
    padding: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#7C3AED',
    borderBottomStyle: 'dashed',
  },
  docType: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7C3AED',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  tagline: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  clientSection: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#F5F3FF',
    borderRadius: 8,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  clientDetail: {
    fontSize: 11,
    color: '#4B5563',
    marginTop: 2,
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
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    borderRadius: 4,
  },
  tableHeaderText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tableCol1: { width: '50%', paddingLeft: 12 },
  tableCol2: { width: '15%', textAlign: 'center' },
  tableCol3: { width: '17%', textAlign: 'right' },
  tableCol4: { width: '18%', textAlign: 'right', paddingRight: 12 },
  totals: {
    marginTop: 20,
    alignItems: 'flex-end',
    padding: 20,
    backgroundColor: '#F5F3FF',
    borderRadius: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 12,
    color: '#6B7280',
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
    borderTopColor: '#7C3AED',
    paddingTop: 10,
    marginTop: 4,
  },
  grandTotalValue: {
    fontSize: 20,
    color: '#7C3AED',
  },
  bankSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7C3AED',
    borderStyle: 'dashed',
  },
  bankLabel: {
    fontSize: 10,
    color: '#7C3AED',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  footer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#6B7280',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
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

export const CreativeTemplate = ({ data }: { data: InvoiceData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.sidebar}>
        <Text style={styles.sidebarTitle}>FATURA</Text>
        <Text style={[styles.sidebarText, { fontSize: 12, marginBottom: 30 }]}>Creative Invoicing</Text>

        <Text style={styles.sidebarLabel}>Invoice Number</Text>
        <Text style={styles.sidebarValue}>{data.invoiceNumber}</Text>

        <Text style={styles.sidebarLabel}>Date</Text>
        <Text style={styles.sidebarValue}>{new Date(data.createdAt).toLocaleDateString()}</Text>

        <Text style={styles.sidebarLabel}>Currency</Text>
        <Text style={styles.sidebarValue}>{data.currency}</Text>

        {data.bankName && (
          <>
            <Text style={styles.sidebarLabel}>Payment Details</Text>
            <Text style={[styles.sidebarText, { fontSize: 10, marginTop: 2 }]}>{data.bankName}</Text>
            {data.bankAccountName && <Text style={[styles.sidebarText, { fontSize: 10 }]}>{data.bankAccountName}</Text>}
            {data.bankAccount && <Text style={[styles.sidebarText, { fontSize: 10 }]}>#{data.bankAccount}</Text>}
          </>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.docType}>Invoice</Text>
            <Text style={styles.tagline}>Designed with care</Text>
          </View>
          <Text style={{ fontSize: 10, color: '#7C3AED', fontWeight: 'bold' }}>✨ Creative</Text>
        </View>

        <View style={styles.clientSection}>
          <Text style={styles.clientName}>{data.customerName}</Text>
          {data.customerEmail && <Text style={styles.clientDetail}>📧 {data.customerEmail}</Text>}
          {data.customerPhone && <Text style={styles.clientDetail}>📱 {data.customerPhone}</Text>}
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
              <Text style={styles.tableCol1}>✨ {item.description}</Text>
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
          <View style={styles.bankSection}>
            <Text style={styles.bankLabel}>💳 Bank Transfer</Text>
            <Text style={{ fontSize: 10, color: '#111827', marginTop: 4 }}>{data.bankName}</Text>
            {data.bankAccountName && <Text style={{ fontSize: 10, color: '#111827' }}>{data.bankAccountName}</Text>}
            {data.bankAccount && <Text style={{ fontSize: 10, color: '#111827' }}>Account: {data.bankAccount}</Text>}
          </View>
        )}

        <View style={styles.footer}>
          <Text>✨ Thank you for choosing Fatura.one</Text>
          <Text>Generated with ❤️</Text>
        </View>
      </View>
    </Page>
  </Document>
);