import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#F8F9FA',
    fontFamily: 'Helvetica',
  },
  content: {
    backgroundColor: '#FFFFFF',
    padding: 40,
    borderRadius: 8,
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  header: {
    borderBottomWidth: 4,
    borderBottomColor: '#1A1A2E',
    paddingBottom: 20,
    marginBottom: 30,
  },
  companyName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1A1A2E',
    letterSpacing: 4,
  },
  docType: {
    fontSize: 20,
    color: '#4A4A6A',
    fontWeight: 'light',
    marginTop: 4,
  },
  metaGrid: {
    flexDirection: 'row',
    marginBottom: 30,
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 4,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 9,
    color: '#6B7280',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  metaValue: {
    fontSize: 13,
    color: '#1A1A2E',
    fontWeight: 'bold',
    marginTop: 2,
  },
  clientBox: {
    marginBottom: 30,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
  },
  clientLabel: {
    fontSize: 9,
    color: '#6B7280',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  clientName: {
    fontSize: 16,
    color: '#1A1A2E',
    fontWeight: 'bold',
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
    backgroundColor: '#1A1A2E',
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
    paddingRight: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 11,
    color: '#6B7280',
    width: 100,
    textAlign: 'right',
    textTransform: 'uppercase',
  },
  totalValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1A1A2E',
    width: 120,
    textAlign: 'right',
  },
  grandTotal: {
    borderTopWidth: 2,
    borderTopColor: '#1A1A2E',
    paddingTop: 10,
    marginTop: 4,
  },
  grandTotalValue: {
    fontSize: 20,
    color: '#1A1A2E',
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'center',
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

export const ExecutiveTemplate = ({ data }: { data: InvoiceData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.companyName}>FATURA</Text>
          <Text style={styles.docType}>Executive Invoice</Text>
        </View>

        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Invoice Number</Text>
            <Text style={styles.metaValue}>{data.invoiceNumber}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Date Issued</Text>
            <Text style={styles.metaValue}>{new Date(data.createdAt).toLocaleDateString()}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Currency</Text>
            <Text style={styles.metaValue}>{data.currency}</Text>
          </View>
        </View>

        <View style={styles.clientBox}>
          <Text style={styles.clientLabel}>Client</Text>
          <Text style={styles.clientName}>{data.customerName}</Text>
          {data.customerEmail && <Text style={{ marginTop: 4, fontSize: 11, color: '#4A4A6A' }}>{data.customerEmail}</Text>}
          {data.customerPhone && <Text style={{ fontSize: 11, color: '#4A4A6A' }}>{data.customerPhone}</Text>}
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCol1, styles.tableHeaderText]}>Description</Text>
            <Text style={[styles.tableCol2, styles.tableHeaderText]}>Quantity</Text>
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
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{data.currency} {data.total.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={[styles.totalLabel, { fontWeight: 'bold' }]}>Total Due</Text>
            <Text style={[styles.totalValue, styles.grandTotalValue]}>{data.currency} {data.total.toFixed(2)}</Text>
          </View>
        </View>

        {data.bankName && (
          <View style={{ marginTop: 20, padding: 15, backgroundColor: '#F8F9FA', borderRadius: 4 }}>
            <Text style={{ fontSize: 9, color: '#6B7280', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
              Payment Information
            </Text>
            <Text style={{ fontSize: 10, color: '#1A1A2E', marginBottom: 2 }}>{data.bankName}</Text>
            {data.bankAccountName && <Text style={{ fontSize: 10, color: '#1A1A2E', marginBottom: 2 }}>{data.bankAccountName}</Text>}
            {data.bankAccount && <Text style={{ fontSize: 10, color: '#1A1A2E' }}>Account: {data.bankAccount}</Text>}
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>This invoice is generated electronically and is valid without signature.</Text>
          <Text style={[styles.footerText, { marginTop: 4 }]}>© Fatura.one - Professional Invoicing Platform</Text>
        </View>
      </View>
    </Page>
  </Document>
);