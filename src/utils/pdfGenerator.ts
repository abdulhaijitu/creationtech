 import jsPDF from 'jspdf';
 import autoTable from 'jspdf-autotable';
 
 interface LineItem {
   description: string;
   quantity: number;
   unit_price: number;
   amount: number;
 }
 
 interface DocumentData {
   documentNumber: string;
   documentType: 'Invoice' | 'Quotation';
   clientName: string;
   clientEmail?: string | null;
   clientPhone?: string | null;
   clientAddress?: string | null;
   issueDate: string;
   dueDate?: string | null;
   validUntil?: string | null;
   items: LineItem[];
   subtotal: number;
   taxRate: number;
   taxAmount: number;
   discountAmount: number;
   total: number;
   notes?: string | null;
   terms?: string | null;
   status: string;
 }
 
 export const generatePDF = (data: DocumentData): void => {
   const doc = new jsPDF();
   const pageWidth = doc.internal.pageSize.getWidth();
   
   // Header
   doc.setFontSize(24);
   doc.setFont('helvetica', 'bold');
   doc.text(data.documentType.toUpperCase(), 14, 25);
   
   // Document info (right side)
   doc.setFontSize(10);
   doc.setFont('helvetica', 'normal');
   doc.text(`${data.documentType} #: ${data.documentNumber}`, pageWidth - 14, 20, { align: 'right' });
   doc.text(`Date: ${formatDate(data.issueDate)}`, pageWidth - 14, 26, { align: 'right' });
   
   if (data.documentType === 'Invoice' && data.dueDate) {
     doc.text(`Due Date: ${formatDate(data.dueDate)}`, pageWidth - 14, 32, { align: 'right' });
   }
   if (data.documentType === 'Quotation' && data.validUntil) {
     doc.text(`Valid Until: ${formatDate(data.validUntil)}`, pageWidth - 14, 32, { align: 'right' });
   }
   
   // Status badge
   const statusY = data.dueDate || data.validUntil ? 38 : 32;
  const statusColor = getStatusColor(data.status);
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
   doc.roundedRect(pageWidth - 45, statusY - 4, 31, 7, 2, 2, 'F');
   doc.setFontSize(8);
   doc.setTextColor(255, 255, 255);
   doc.text(data.status.toUpperCase(), pageWidth - 29.5, statusY, { align: 'center' });
   doc.setTextColor(0, 0, 0);
   
   // Separator line
   doc.setDrawColor(200, 200, 200);
   doc.line(14, 50, pageWidth - 14, 50);
   
   // Bill To section
   doc.setFontSize(10);
   doc.setFont('helvetica', 'bold');
   doc.text('BILL TO:', 14, 60);
   doc.setFont('helvetica', 'normal');
   doc.text(data.clientName, 14, 67);
   
   let clientY = 73;
   if (data.clientEmail) {
     doc.text(data.clientEmail, 14, clientY);
     clientY += 6;
   }
   if (data.clientPhone) {
     doc.text(data.clientPhone, 14, clientY);
     clientY += 6;
   }
   if (data.clientAddress) {
     const addressLines = doc.splitTextToSize(data.clientAddress, 80);
     doc.text(addressLines, 14, clientY);
   }
   
   // Items table
   const tableStartY = 100;
   
   autoTable(doc, {
     startY: tableStartY,
     head: [['#', 'Description', 'Qty', 'Unit Price', 'Amount']],
     body: data.items.map((item, index) => [
       (index + 1).toString(),
       item.description,
       item.quantity.toString(),
       `৳${item.unit_price.toLocaleString('en-BD', { minimumFractionDigits: 2 })}`,
       `৳${item.amount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}`,
     ]),
     theme: 'striped',
     headStyles: {
       fillColor: [59, 130, 246],
       textColor: [255, 255, 255],
       fontStyle: 'bold',
     },
     columnStyles: {
       0: { cellWidth: 15, halign: 'center' },
       1: { cellWidth: 'auto' },
       2: { cellWidth: 20, halign: 'center' },
       3: { cellWidth: 35, halign: 'right' },
       4: { cellWidth: 35, halign: 'right' },
     },
     margin: { left: 14, right: 14 },
   });
   
   // Get the Y position after the table
   const finalY = (doc as any).lastAutoTable.finalY + 10;
   
   // Totals section (right aligned)
   const totalsX = pageWidth - 70;
   let totalsY = finalY;
   
   doc.setFontSize(10);
   doc.text('Subtotal:', totalsX, totalsY);
   doc.text(`৳${data.subtotal.toLocaleString('en-BD', { minimumFractionDigits: 2 })}`, pageWidth - 14, totalsY, { align: 'right' });
   totalsY += 7;
   
   if (data.taxRate > 0) {
     doc.text(`Tax (${data.taxRate}%):`, totalsX, totalsY);
     doc.text(`৳${data.taxAmount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}`, pageWidth - 14, totalsY, { align: 'right' });
     totalsY += 7;
   }
   
   if (data.discountAmount > 0) {
     doc.text('Discount:', totalsX, totalsY);
     doc.text(`-৳${data.discountAmount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}`, pageWidth - 14, totalsY, { align: 'right' });
     totalsY += 7;
   }
   
   // Total line
   doc.setDrawColor(200, 200, 200);
   doc.line(totalsX - 5, totalsY, pageWidth - 14, totalsY);
   totalsY += 7;
   
   doc.setFont('helvetica', 'bold');
   doc.setFontSize(12);
   doc.text('Total:', totalsX, totalsY);
   doc.text(`৳${data.total.toLocaleString('en-BD', { minimumFractionDigits: 2 })}`, pageWidth - 14, totalsY, { align: 'right' });
   
   // Notes and Terms
   let footerY = totalsY + 20;
   doc.setFont('helvetica', 'normal');
   doc.setFontSize(9);
   
   if (data.notes) {
     doc.setFont('helvetica', 'bold');
     doc.text('Notes:', 14, footerY);
     doc.setFont('helvetica', 'normal');
     const notesLines = doc.splitTextToSize(data.notes, pageWidth - 28);
     doc.text(notesLines, 14, footerY + 5);
     footerY += 5 + (notesLines.length * 4);
   }
   
   if (data.terms) {
     footerY += 5;
     doc.setFont('helvetica', 'bold');
     doc.text('Terms & Conditions:', 14, footerY);
     doc.setFont('helvetica', 'normal');
     const termsLines = doc.splitTextToSize(data.terms, pageWidth - 28);
     doc.text(termsLines, 14, footerY + 5);
   }
   
   // Footer
   const pageHeight = doc.internal.pageSize.getHeight();
   doc.setFontSize(8);
   doc.setTextColor(128, 128, 128);
   doc.text('Thank you for your business!', pageWidth / 2, pageHeight - 15, { align: 'center' });
   doc.text(`Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
   
   // Save the PDF
   doc.save(`${data.documentType.toLowerCase()}-${data.documentNumber}.pdf`);
 };
 
 function formatDate(dateStr: string): string {
   return new Date(dateStr).toLocaleDateString('en-US', {
     year: 'numeric',
     month: 'short',
     day: 'numeric',
   });
 }
 
 function getStatusColor(status: string): [number, number, number] {
   const colors: Record<string, [number, number, number]> = {
     draft: [156, 163, 175],
     sent: [59, 130, 246],
     paid: [34, 197, 94],
     overdue: [239, 68, 68],
     cancelled: [107, 114, 128],
     pending: [234, 179, 8],
     approved: [34, 197, 94],
     rejected: [239, 68, 68],
     converted: [59, 130, 246],
   };
   return colors[status] || [156, 163, 175];
 }
 
 export type { DocumentData, LineItem };