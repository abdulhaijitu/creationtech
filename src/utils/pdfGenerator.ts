import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

interface CompanyInfo {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
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

// ── Constants ──
const MARGIN = 25.4; // 1 inch
const FOOTER_RESERVE = 30;

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
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
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

function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function addPageFooters(doc: jsPDF) {
  const totalPages = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text('CONFIDENTIAL — This document contains proprietary information intended solely for the recipient.', pageWidth / 2, pageHeight - 12, { align: 'center' });
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 7, { align: 'center' });
  }
}

// ── Main generator ──

export const generatePDF = async (data: DocumentData, companyInfo?: CompanyInfo): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxY = pageHeight - FOOTER_RESERVE;

  const company = companyInfo || {
    name: 'Creation Tech',
    address: 'Dhaka, Bangladesh',
    phone: '+880 1XXX-XXXXXX',
    email: 'info@creationtech.com',
    website: 'www.creationtech.com',
  };

  // ── Company header with logo ──
  let logoTextStartX = MARGIN;
  if (company.logo_url) {
    try {
      const logoData = await loadImageAsDataUrl(company.logo_url);
      if (logoData) {
        const logoH = 14;
        const logoW = logoH;
        doc.addImage(logoData, 'PNG', MARGIN, MARGIN - 4, logoW, logoH);
        logoTextStartX = MARGIN + logoW + 4;
      }
    } catch { /* no logo fallback */ }
  }

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 55, 94);
  doc.text(company.name || '', logoTextStartX, MARGIN);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  let headerY = MARGIN + 6;
  if (company.address) { doc.text(company.address, logoTextStartX, headerY); headerY += 4; }
  if (company.phone) { doc.text(`Phone: ${company.phone}`, logoTextStartX, headerY); headerY += 4; }
  if (company.email) { doc.text(`Email: ${company.email}`, logoTextStartX, headerY); headerY += 4; }
  if (company.website) { doc.text(company.website, logoTextStartX, headerY); headerY += 4; }

  // Separator
  doc.setDrawColor(34, 55, 94);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, headerY + 1, pageWidth - MARGIN, headerY + 1);

  // ── Document title ──
  let y = headerY + 8;
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 55, 94);
  doc.text(data.documentType.toUpperCase(), MARGIN, y);

  // Document info (right side)
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`${data.documentType} #: ${data.documentNumber}`, pageWidth - MARGIN, y - 6, { align: 'right' });
  doc.text(`Date: ${formatDate(data.issueDate)}`, pageWidth - MARGIN, y, { align: 'right' });

  if (data.documentType === 'Invoice' && data.dueDate) {
    doc.text(`Due Date: ${formatDate(data.dueDate)}`, pageWidth - MARGIN, y + 6, { align: 'right' });
  }
  if (data.documentType === 'Quotation' && data.validUntil) {
    doc.text(`Valid Until: ${formatDate(data.validUntil)}`, pageWidth - MARGIN, y + 6, { align: 'right' });
  }

  // Status badge
  const hasExtra = (data.documentType === 'Invoice' && data.dueDate) || (data.documentType === 'Quotation' && data.validUntil);
  const statusY = y + (hasExtra ? 12 : 6);
  const statusColor = getStatusColor(data.status);
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(pageWidth - MARGIN - 31, statusY - 4, 31, 7, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(data.status.toUpperCase(), pageWidth - MARGIN - 15.5, statusY, { align: 'center' });
  doc.setTextColor(0, 0, 0);

  // Separator
  const sepY = y + 6 + (hasExtra ? 14 : 8);
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(MARGIN, sepY, pageWidth - MARGIN, sepY);

  // ── Bill To ──
  y = sepY + 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('BILL TO:', MARGIN, y);
  doc.setFont('helvetica', 'normal');
  y += 6;
  doc.text(data.clientName, MARGIN, y);
  if (data.clientEmail) { y += 5; doc.text(data.clientEmail, MARGIN, y); }
  if (data.clientPhone) { y += 5; doc.text(data.clientPhone, MARGIN, y); }
  if (data.clientAddress) {
    y += 5;
    const addressLines = doc.splitTextToSize(data.clientAddress, 80);
    doc.text(addressLines, MARGIN, y);
    y += (addressLines.length - 1) * 5;
  }
  y += 10;

  // ── Items table ──
  if (y > maxY - 40) { doc.addPage(); y = MARGIN; }

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
    headStyles: { fillColor: [34, 55, 94], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 18, halign: 'center' },
      3: { cellWidth: 32, halign: 'right' },
      4: { cellWidth: 32, halign: 'right' },
    },
    margin: { left: MARGIN, right: MARGIN },
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  // Check page break for totals
  if (y + 40 > maxY) { doc.addPage(); y = MARGIN; }

  // ── Totals ──
  const totalsX = pageWidth - 70;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

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

  doc.setDrawColor(200, 200, 200);
  doc.line(totalsX - 5, y, pageWidth - MARGIN, y);
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Total:', totalsX, y);
  doc.text(formatCurrency(data.total), pageWidth - MARGIN, y, { align: 'right' });
  y += 8;

  // Amount in Words
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(80, 80, 80);
  doc.text(`Amount in Words: ${numberToWords(data.total)}`, MARGIN, y);
  y += 12;

  // ── Notes & Terms ──
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);

  if (data.notes) {
    if (y > maxY - 20) { doc.addPage(); y = MARGIN; }
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 55, 94);
    doc.text('Notes:', MARGIN, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const notesLines = doc.splitTextToSize(stripHtml(data.notes), pageWidth - MARGIN * 2);
    for (const line of notesLines) {
      if (y > maxY) { doc.addPage(); y = MARGIN; }
      doc.text(line, MARGIN, y);
      y += 4.5;
    }
    y += 4;
  }

  if (data.terms) {
    if (y > maxY - 20) { doc.addPage(); y = MARGIN; }
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 55, 94);
    doc.text('Terms & Conditions:', MARGIN, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const termsLines = doc.splitTextToSize(stripHtml(data.terms), pageWidth - MARGIN * 2);
    for (const line of termsLines) {
      if (y > maxY) { doc.addPage(); y = MARGIN; }
      doc.text(line, MARGIN, y);
      y += 4.5;
    }
    y += 4;
  }

  // ── Signature section ──
  if (y > maxY - 35) { doc.addPage(); y = MARGIN; }
  y += 10;

  doc.setDrawColor(0, 0, 0);
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

  // ── Page footers ──
  addPageFooters(doc);

  // ── Output ──
  doc.save(`${data.documentType.toLowerCase()}-${data.documentNumber}.pdf`);
};

export type { DocumentData, LineItem, CompanyInfo };
