import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxP.ttf' },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    borderBottomWidth: 4,
    borderBottomColor: '#1a56db',
    paddingBottom: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a56db',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontSize: 10,
    color: '#6b7280',
  },
  value: {
    fontSize: 10,
    color: '#111827',
  },
  table: {
    display: 'flex',
    width: 'auto',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1a56db',
    padding: 8,
    marginTop: 10,
    marginBottom: 5,
  },
  tableHeaderText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  col1: { width: '50%' },
  col2: { width: '20%' },
  col3: { width: '15%' },
  col4: { width: '15%', textAlign: 'right' },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'right',
    color: '#1a56db',
  },
  bankSection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
});

interface ExecutiveTemplateProps {
  data: {
    invoiceNumber: string;
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    total: number;
    currency: string;
    status: string;
    createdAt: string;
    dueDate?: string;
    items: Array<{
      description: string;
      quantity: number;
      price: number;
    }>;
    bankName?: string;
    bankAccount?: string;
    bankAccountName?: string;
  };
}

export default function ExecutiveTemplate({ data }: ExecutiveTemplateProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={styles.subtitle}>Executive Template</Text>
        </View>

        <View style={styles.section}>
          <Text>Invoice #: {data.invoiceNumber}</Text>
          <Text>Date: {data.createdAt}</Text>
          {data.dueDate && <Text>Due: {data.dueDate}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold' }}>Bill To:</Text>
          <Text>{data.customerName}</Text>
          {data.customerEmail && <Text>{data.customerEmail}</Text>}
          {data.customerPhone && <Text>{data.customerPhone}</Text>}
        </View>

        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.col1]}>Description</Text>
          <Text style={[styles.tableHeaderText, styles.col2]}>Qty</Text>
          <Text style={[styles.tableHeaderText, styles.col3]}>Price</Text>
          <Text style={[styles.tableHeaderText, styles.col4]}>Total</Text>
        </View>

        {data.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.col1}>{item.description}</Text>
            <Text style={styles.col2}>{item.quantity}</Text>
            <Text style={styles.col3}>{data.currency} {item.price.toFixed(2)}</Text>
            <Text style={styles.col4}>{data.currency} {(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}

        <Text style={styles.total}>
          Total: {data.currency} {data.total.toFixed(2)}
        </Text>

        {(data.bankName || data.bankAccount || data.bankAccountName) && (
          <View style={styles.bankSection}>
            <Text style={{ fontWeight: 'bold' }}>Bank Details</Text>
            {data.bankName && <Text>Bank: {data.bankName}</Text>}
            {data.bankAccount && <Text>Account: {data.bankAccount}</Text>}
            {data.bankAccountName && <Text>Beneficiary: {data.bankAccountName}</Text>}
          </View>
        )}

        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  );
}