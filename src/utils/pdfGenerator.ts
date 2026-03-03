import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  billing_type?: string;
  billing_period?: string;
}

interface CompanyInfo {
  name?: string;
  tagline?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  watermark_url?: string;
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
  isRecurring?: boolean;
  billingPeriodStart?: string | null;
  billingPeriodEnd?: string | null;
}

// ── Constants ──
const MARGIN = 20;
const FOOTER_RESERVE = 22;
const ACCENT_COLOR: [number, number, number] = [34, 55, 94];

// ── Helpers ──

function loadImageAsDataUrl(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(null); return; }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatCurrency(amount: number): string {
  return `BDT ${amount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}`;
}

function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const convert = (n: number): string => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
  };
  const intPart = Math.floor(Math.abs(num));
  const decPart = Math.round((Math.abs(num) - intPart) * 100);
  let result = convert(intPart) + ' Taka';
  if (decPart > 0) result += ' and ' + convert(decPart) + ' Paisa';
  return result + ' Only';
}

function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

// ── Reusable header ──

function addHeader(doc: jsPDF, company: CompanyInfo, logoData: string | null): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  const rightX = pageWidth - MARGIN;

  doc.setFillColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2]);
  doc.rect(0, 0, pageWidth, 3, 'F');

  let nameX = MARGIN;
  if (logoData) {
    doc.addImage(logoData, 'PNG', MARGIN, 6, 12, 12);
    nameX = MARGIN + 14;
  }

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2]);
  doc.text(company.name || 'Creation Tech', nameX, 13);

  if (company.tagline) {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(120, 120, 120);
    doc.text(company.tagline, nameX, 17);
  }

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  let infoY = 8;
  if (company.address) { doc.text(company.address, rightX, infoY, { align: 'right' }); infoY += 3.5; }
  if (company.phone) { doc.text(`Phone: ${company.phone}`, rightX, infoY, { align: 'right' }); infoY += 3.5; }
  if (company.email) { doc.text(`Email: ${company.email}`, rightX, infoY, { align: 'right' }); infoY += 3.5; }
  if (company.website) { doc.text(`Web: ${company.website}`, rightX, infoY, { align: 'right' }); infoY += 3.5; }

  const lineY = Math.max(infoY + 2, 22);
  doc.setDrawColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2]);
  doc.setLineWidth(0.6);
  doc.line(MARGIN, lineY, rightX, lineY);
  doc.setDrawColor(200, 210, 230);
  doc.setLineWidth(0.2);
  doc.line(MARGIN, lineY + 1.5, rightX, lineY + 1.5);

  return lineY + 5;
}

// ── Watermark ──

function addWatermark(doc: jsPDF, watermarkData: string | null) {
  if (!watermarkData) return;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const gState = new (doc as any).GState({ opacity: 0.06 });
  doc.saveGraphicsState();
  doc.setGState(gState);
  doc.addImage(watermarkData, 'PNG', pageWidth - 75, pageHeight - 75, 55, 55);
  doc.restoreGraphicsState();
}

function addAccentStrip(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  for (let i = 0; i < 3; i++) {
    const opacity = 0.08 - i * 0.025;
    const gState = new (doc as any).GState({ opacity });
    doc.saveGraphicsState();
    doc.setGState(gState);
    doc.setFillColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2]);
    doc.rect(pageWidth - 4 + i, 3, 1.5, pageHeight - 3, 'F');
    doc.restoreGraphicsState();
  }
}

function addPageFooters(doc: jsPDF, watermarkData: string | null) {
  const totalPages = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addWatermark(doc, watermarkData);
    addAccentStrip(doc);

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, pageHeight - 16, pageWidth - MARGIN, pageHeight - 16);

    doc.setFontSize(6.5);
    doc.setTextColor(150, 150, 150);
    doc.text('CONFIDENTIAL — This document contains proprietary information intended solely for the recipient.', MARGIN, pageHeight - 12);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - MARGIN, pageHeight - 12, { align: 'right' });
  }
}

function addNewPage(doc: jsPDF, company: CompanyInfo, logoData: string | null): number {
  doc.addPage();
  return addHeader(doc, company, logoData);
}

// ── Main generator ──

export const buildPDFDoc = async (data: DocumentData, companyInfo?: CompanyInfo): Promise<jsPDF> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxY = pageHeight - FOOTER_RESERVE;

  const company: CompanyInfo = {
    name: 'Creation Tech',
    tagline: '-PRIME TECH PARTNER-',
    address: 'Dhaka, Bangladesh',
    phone: '+880 1XXX-XXXXXX',
    email: 'info@creationtech.com',
    website: 'www.creationtech.com',
    ...companyInfo,
  };

  let logoData: string | null = null;
  let watermarkData: string | null = null;

  const loadPromises: Promise<void>[] = [];
  if (company.logo_url) {
    loadPromises.push(loadImageAsDataUrl(company.logo_url).then(d => { logoData = d; }));
  }
  if (company.watermark_url) {
    loadPromises.push(loadImageAsDataUrl(company.watermark_url).then(d => { watermarkData = d; }));
  }
  await Promise.all(loadPromises);

  // ── Page 1 Header ──
  let y = addHeader(doc, company, logoData);

  // ── Document title + meta ──
  const rightX = pageWidth - MARGIN;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2]);
  doc.text(data.documentType.toUpperCase(), MARGIN, y);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 70, 70);
  doc.text(`${data.documentType} #: ${data.documentNumber}`, rightX, y - 4, { align: 'right' });
  doc.text(`Date: ${formatDate(data.issueDate)}`, rightX, y + 1, { align: 'right' });

  if (data.documentType === 'Invoice' && data.dueDate) {
    doc.text(`Due Date: ${formatDate(data.dueDate)}`, rightX, y + 6, { align: 'right' });
  }
  if (data.documentType === 'Quotation' && data.validUntil) {
    doc.text(`Valid Until: ${formatDate(data.validUntil)}`, rightX, y + 6, { align: 'right' });
  }

  y += 10;

  // ── Billing Period info (for recurring invoices) ──
  if (data.isRecurring && (data.billingPeriodStart || data.billingPeriodEnd)) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2]);
    doc.text('Billing Period:', MARGIN, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 55, 55);
    const periodText = [
      data.billingPeriodStart ? formatDate(data.billingPeriodStart) : '',
      data.billingPeriodEnd ? formatDate(data.billingPeriodEnd) : '',
    ].filter(Boolean).join(' — ');
    doc.text(periodText, MARGIN + 30, y);
    y += 6;
  }

  // ── "To," client block ──
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2]);
  doc.text('To,', MARGIN, y);
  y += 5;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 55, 55);
  doc.text(data.clientName, MARGIN, y); y += 4.5;
  if (data.clientEmail) { doc.text(data.clientEmail, MARGIN, y); y += 4.5; }
  if (data.clientPhone) { doc.text(`Mobile: ${data.clientPhone}`, MARGIN, y); y += 4.5; }
  if (data.clientAddress) {
    const addressLines = doc.splitTextToSize(data.clientAddress, 80);
    doc.text(addressLines, MARGIN, y);
    y += addressLines.length * 4.5;
  }

  y += 6;

  // Separator
  doc.setDrawColor(200, 210, 230);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, pageWidth - MARGIN, y);
  y += 6;

  // ── Items table ──
  if (y > maxY - 40) { y = addNewPage(doc, company, logoData); }

  // Check if we have mixed billing types
  const hasBillingTypes = data.items.some(i => i.billing_type && i.billing_type !== 'one_time');

  if (hasBillingTypes) {
    autoTable(doc, {
      startY: y,
      head: [['#', 'Type', 'Description', 'Qty', 'Unit Price', 'Amount']],
      body: data.items.map((item, index) => [
        (index + 1).toString(),
        item.billing_type === 'recurring' ? 'Monthly' : 'One-time',
        stripHtml(item.description),
        item.quantity.toString(),
        formatCurrency(item.unit_price),
        formatCurrency(item.amount),
      ]),
      theme: 'striped',
      headStyles: { fillColor: ACCENT_COLOR, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 8.5 },
      alternateRowStyles: { fillColor: [245, 247, 252] },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 22 },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 14, halign: 'center' },
        4: { cellWidth: 30, halign: 'right' },
        5: { cellWidth: 30, halign: 'right' },
      },
      margin: { left: MARGIN, right: MARGIN },
    });
  } else {
    autoTable(doc, {
      startY: y,
      head: [['#', 'Description', 'Qty', 'Unit Price', 'Amount']],
      body: data.items.map((item, index) => [
        (index + 1).toString(),
        stripHtml(item.description),
        item.quantity.toString(),
        formatCurrency(item.unit_price),
        formatCurrency(item.amount),
      ]),
      theme: 'striped',
      headStyles: { fillColor: ACCENT_COLOR, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 8.5 },
      alternateRowStyles: { fillColor: [245, 247, 252] },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 18, halign: 'center' },
        3: { cellWidth: 32, halign: 'right' },
        4: { cellWidth: 32, halign: 'right' },
      },
      margin: { left: MARGIN, right: MARGIN },
    });
  }

  y = (doc as any).lastAutoTable.finalY + 8;

  if (y + 40 > maxY) { y = addNewPage(doc, company, logoData); }

  // ── Totals ──
  const totalsX = pageWidth - 70;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 55, 55);

  if (hasBillingTypes) {
    const recurringTotal = data.items.filter(i => i.billing_type === 'recurring').reduce((s, i) => s + i.amount, 0);
    const oneTimeTotal = data.items.filter(i => i.billing_type !== 'recurring').reduce((s, i) => s + i.amount, 0);

    if (recurringTotal > 0) {
      doc.text('Monthly Recurring:', totalsX, y);
      doc.text(formatCurrency(recurringTotal) + '/mo', pageWidth - MARGIN, y, { align: 'right' });
      y += 6;
    }
    if (oneTimeTotal > 0) {
      doc.text('One-time Charges:', totalsX, y);
      doc.text(formatCurrency(oneTimeTotal), pageWidth - MARGIN, y, { align: 'right' });
      y += 6;
    }

    doc.setDrawColor(200, 210, 230);
    doc.setLineWidth(0.2);
    doc.line(totalsX - 5, y, pageWidth - MARGIN, y);
    y += 4;
  }

  doc.text('Subtotal:', totalsX, y);
  doc.text(formatCurrency(data.subtotal), pageWidth - MARGIN, y, { align: 'right' });
  y += 6;

  if (data.taxRate > 0) {
    doc.text(`VAT/Tax (${data.taxRate}%):`, totalsX, y);
    doc.text(formatCurrency(data.taxAmount), pageWidth - MARGIN, y, { align: 'right' });
    y += 6;
  }

  if (data.discountAmount > 0) {
    doc.text('Discount:', totalsX, y);
    doc.text(`-${formatCurrency(data.discountAmount)}`, pageWidth - MARGIN, y, { align: 'right' });
    y += 6;
  }

  doc.setDrawColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2]);
  doc.setLineWidth(0.4);
  doc.line(totalsX - 5, y, pageWidth - MARGIN, y);
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2]);
  doc.text('Total:', totalsX, y);
  doc.text(formatCurrency(data.total), pageWidth - MARGIN, y, { align: 'right' });
  y += 8;

  // Amount in Words
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(80, 80, 80);
  doc.text(`Amount in Words: ${numberToWords(data.total)}`, MARGIN, y);
  y += 10;

  // ── Notes & Terms ──
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  if (data.notes) {
    if (y > maxY - 20) { y = addNewPage(doc, company, logoData); }
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2]);
    doc.text('Notes:', MARGIN, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 55, 55);
    const notesLines = doc.splitTextToSize(stripHtml(data.notes), pageWidth - MARGIN * 2);
    for (const line of notesLines) {
      if (y > maxY) { y = addNewPage(doc, company, logoData); }
      doc.text(line, MARGIN, y);
      y += 4.5;
    }
    y += 4;
  }

  if (data.terms) {
    if (y > maxY - 20) { y = addNewPage(doc, company, logoData); }
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2]);
    doc.text('Terms & Conditions:', MARGIN, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 55, 55);
    const termsLines = doc.splitTextToSize(stripHtml(data.terms), pageWidth - MARGIN * 2);
    for (const line of termsLines) {
      if (y > maxY) { y = addNewPage(doc, company, logoData); }
      doc.text(line, MARGIN, y);
      y += 4.5;
    }
    y += 4;
  }

  // ── Signature section ──
  if (y > maxY - 35) { y = addNewPage(doc, company, logoData); }
  y += 10;

  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.3);

  doc.line(MARGIN, y + 15, MARGIN + 71, y + 15);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('Authorized Signature', MARGIN, y + 20);
  doc.setFontSize(8);
  doc.text(company.name || '', MARGIN, y + 25);
  doc.text('Date: ____________________', MARGIN, y + 30);

  const rightSigX = pageWidth - MARGIN - 71;
  doc.line(rightSigX, y + 15, pageWidth - MARGIN, y + 15);
  doc.setFontSize(9);
  doc.text('Client Acceptance', rightSigX, y + 20);
  doc.setFontSize(8);
  doc.text(data.clientName, rightSigX, y + 25);
  doc.text('Date: ____________________', rightSigX, y + 30);

  // Add headers to subsequent pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 2; i <= totalPages; i++) {
    doc.setPage(i);
    addHeader(doc, company, logoData);
  }

  // ── Page footers + watermarks ──
  addPageFooters(doc, watermarkData);

  return doc;
};

/** Backward-compatible: generates and saves PDF */
export const generatePDF = async (data: DocumentData, companyInfo?: CompanyInfo): Promise<void> => {
  const doc = await buildPDFDoc(data, companyInfo);
  doc.save(`${data.documentType.toLowerCase()}-${data.documentNumber}.pdf`);
};

/** Download PDF (alias for generatePDF) */
export const downloadPDF = generatePDF;

/** Open PDF in new tab and trigger print dialog */
export const printPDF = async (data: DocumentData, companyInfo?: CompanyInfo): Promise<void> => {
  const doc = await buildPDFDoc(data, companyInfo);
  const blobUrl = doc.output('bloburl');
  const printWindow = window.open(blobUrl as unknown as string, '_blank');
  if (printWindow) {
    printWindow.addEventListener('load', () => {
      printWindow.print();
    });
  }
};

/** Get PDF as Blob (for email attachment etc.) */
export const getInvoicePDFBlob = async (data: DocumentData, companyInfo?: CompanyInfo): Promise<Blob> => {
  const doc = await buildPDFDoc(data, companyInfo);
  return doc.output('blob');
};

export type { DocumentData, LineItem, CompanyInfo };
