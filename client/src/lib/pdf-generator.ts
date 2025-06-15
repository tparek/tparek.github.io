import jsPDF from 'jspdf';
import type { InvoiceData } from '@/pages/invoice-generator';

export function generateInvoicePDF(invoiceData: InvoiceData) {
  const pdf = new jsPDF();
  
  // Set font
  pdf.setFont('helvetica');
  
  // Invoice Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Invoice nr ${invoiceData.invoiceNumber}`, 105, 30, { align: 'center' });
  
  // Date Information
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const invoiceDate = formatDate(invoiceData.invoiceDate);
  const paymentTerm = formatDate(invoiceData.paymentTerm);
  
  pdf.text(`Date: ${invoiceDate}`, 150, 50);
  pdf.text(`Payment term: ${paymentTerm}`, 150, 57);
  
  // Company Information
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TETON PRODUCTIONS OÜ', 20, 80);
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('Kullerkupu 20, Verijärve küla,', 20, 87);
  pdf.text('Võrumaa, Võru vald 65541', 20, 94);
  pdf.text('Reg. nr.: 14695419', 20, 101);
  pdf.text('KMKR nr: EE102643996', 20, 108);
  
  // Recipient Information
  pdf.setFont('helvetica', 'bold');
  pdf.text('INVOICE RECIPIENT', 120, 80);
  
  pdf.setFont('helvetica', 'normal');
  pdf.text(invoiceData.recipientCompanyName || 'Company Name', 120, 87);
  
  // Handle multi-line address
  const addressLines = (invoiceData.recipientAddress || 'Address').split('\n');
  let yPos = 94;
  addressLines.forEach(line => {
    pdf.text(line, 120, yPos);
    yPos += 7;
  });
  
  pdf.text(`Reg. nr.: ${invoiceData.recipientRegNumber || 'Registration Number'}`, 120, yPos);
  if (invoiceData.recipientVatNumber) {
    pdf.text(`KMKR nr.: ${invoiceData.recipientVatNumber}`, 120, yPos + 7);
  }
  
  // Service Items Table
  const tableY = 140;
  pdf.setFont('helvetica', 'bold');
  pdf.text('DESCRIPTION', 20, tableY);
  pdf.text('AMOUNT', 100, tableY, { align: 'center' });
  pdf.text('PRICE', 140, tableY, { align: 'right' });
  pdf.text('SUM', 180, tableY, { align: 'right' });
  
  // Table line
  pdf.line(20, tableY + 3, 180, tableY + 3);
  
  // Service items
  pdf.setFont('helvetica', 'normal');
  let currentY = tableY + 15;
  
  invoiceData.serviceItems.forEach((item) => {
    pdf.text(item.description || 'Service description', 20, currentY);
    pdf.text(item.amount.toString(), 100, currentY, { align: 'center' });
    pdf.text(`${item.price.toFixed(2)} €`, 140, currentY, { align: 'right' });
    pdf.text(`${(item.amount * item.price).toFixed(2)} €`, 180, currentY, { align: 'right' });
    currentY += 10;
  });
  
  // Totals
  const totalsY = currentY + 20;
  pdf.text('SUM', 140, totalsY, { align: 'right' });
  pdf.text(`${invoiceData.subtotal} €`, 180, totalsY, { align: 'right' });
  
  pdf.text('VAT 22%', 140, totalsY + 7, { align: 'right' });
  pdf.text(`${invoiceData.vat} €`, 180, totalsY + 7, { align: 'right' });
  
  // Total line
  pdf.line(140, totalsY + 12, 180, totalsY + 12);
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('TOTAL', 140, totalsY + 20, { align: 'right' });
  pdf.text(`${invoiceData.total} €`, 180, totalsY + 20, { align: 'right' });
  
  // Bank Details
  const bankY = totalsY + 40;
  pdf.setFont('helvetica', 'bold');
  pdf.text('AS LHV PANK', 20, bankY);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Bank account number: EE437700771003739128', 20, bankY + 7);
  
  // Save the PDF
  pdf.save(`Invoice_${invoiceData.invoiceNumber}.pdf`);
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('et-EE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}
