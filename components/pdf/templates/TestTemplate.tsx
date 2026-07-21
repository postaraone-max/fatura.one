import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export const TestTemplate = ({ data }: { data: any }) => (
  <Document>
    <Page style={styles.page}>
      <View>
        <Text style={styles.title}>Test Invoice PDF</Text>
        <Text>Invoice Number: {data.invoiceNumber}</Text>
        <Text>Customer: {data.customerName}</Text>
        <Text>Total: {data.currency} {data.total}</Text>
      </View>
    </Page>
  </Document>
);