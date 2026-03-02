import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ProposalItem {
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
}

interface ProposalData {
  proposal_number: string;
  title: string;
  status: string;
  created_at: string;
  valid_until?: string | null;
  client_name: string;
  client_email?: string | null;
  client_phone?: string | null;
  client_company?: string | null;
  offer_letter?: string | null;
  scope_of_work?: string | null;
  timeline?: string | null;
  deliverables?: string | null;
  expected_outcome?: string | null;
  offer_letter_end?: string | null;
  items: ProposalItem[];
  subtotal?: number | null;
  tax_rate?: number | null;
  tax_amount?: number | null;
  discount_amount?: number | null;
  total_amount?: number | null;
  notes?: string | null;
  terms?: string | null;
}

// ── Constants ──
const MARGIN = 25.4; // 1 inch in mm
const FOOTER_RESERVE = 30; // mm reserved for footer

// ── Helpers ──

function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function htmlToPlainText(html: string): string {
  if (!html) return '';
  let text = html;

  // Handle ordered list items with numbering
  let olCounter = 0;
  text = text.replace(/<ol[^>]*>/gi, () => { olCounter = 0; return ''; });
  text = text.replace(/<\/ol>/gi, '');
  
  // Handle unordered lists
  text = text.replace(/<ul[^>]*>/gi, '');
  text = text.replace(/<\/ul>/gi, '');

  // Handle <li> — detect if inside <ol> by checking preceding context
  // Simple approach: replace all <li> with bullet, then fix ordered ones
  text = text.replace(/<li[^>]*>/gi, '\n• ');
  text = text.replace(/<\/li>/gi, '');

  // Paragraphs and line breaks
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<\/p>/gi, '\n');
  text = text.replace(/<p[^>]*>/gi, '');

  // Headings
  text = text.replace(/<\/h[1-6]>/gi, '\n');
  text = text.replace(/<h[1-6][^>]*>/gi, '\n');

  // Table handling — row by row
  text = text.replace(/<\/td>/gi, '  ');
  text = text.replace(/<\/th>/gi, '  ');
  text = text.replace(/<tr[^>]*>/gi, '\n');
  text = text.replace(/<\/tr>/gi, '');

  // Strip all remaining HTML tags
  text = text.replace(/<[^>]+>/gi, '');

  // Decode HTML entities
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  text = text.replace(/&nbsp;/g, ' ');

  // Clean up multiple blank lines
  text = text.replace(/\n{3,}/g, '\n\n');
  return text.trim();
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
    accepted: [34, 197, 94],
    approved: [34, 197, 94],
    rejected: [239, 68, 68],
    revised: [234, 179, 8],
    negotiation: [234, 179, 8],
    cancelled: [107, 114, 128],
  };
  return colors[status] || [156, 163, 175];
}

// ── Section renderer (with htmlToPlainText) ──

function addSection(doc: jsPDF, title: string, content: string, y: number, pageWidth: number): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxY = pageHeight - FOOTER_RESERVE;
  const contentWidth = pageWidth - MARGIN * 2;

  if (y > maxY - 20) { doc.addPage(); y = MARGIN; }

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 55, 94);
  doc.text(title, MARGIN, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);

  const plainText = htmlToPlainText(content);
  const paragraphs = plainText.split('\n');

  for (const paragraph of paragraphs) {
    if (paragraph.trim() === '') {
      y += 2; // small gap for empty lines
      continue;
    }
    const lines = doc.splitTextToSize(paragraph, contentWidth);
    for (const line of lines) {
      if (y > maxY) { doc.addPage(); y = MARGIN; }
      doc.text(line, MARGIN, y);
      y += 4.5;
    }
  }
  return y + 4;
}

// ── Page footer (called after all content) ──

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

export function generateProposalPDF(
  data: ProposalData,
  action: 'download' | 'print' = 'download',
  companyInfo?: CompanyInfo
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxY = pageHeight - FOOTER_RESERVE;
  const contentWidth = pageWidth - MARGIN * 2;

  // ── Company header / letterhead ──
  const company = companyInfo || {
    name: 'Creation Tech',
    address: 'Dhaka, Bangladesh',
    phone: '+880 1XXX-XXXXXX',
    email: 'info@creationtech.com',
    website: 'www.creationtech.com',
  };

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 55, 94);
  doc.text(company.name || '', MARGIN, MARGIN);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  let headerY = MARGIN + 6;
  if (company.address) { doc.text(company.address, MARGIN, headerY); headerY += 4; }
  if (company.phone) { doc.text(`Phone: ${company.phone}`, MARGIN, headerY); headerY += 4; }
  if (company.email) { doc.text(`Email: ${company.email}`, MARGIN, headerY); headerY += 4; }
  if (company.website) { doc.text(company.website, MARGIN, headerY); headerY += 4; }

  // Separator line
  doc.setDrawColor(34, 55, 94);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, headerY + 1, pageWidth - MARGIN, headerY + 1);

  // ── PROPOSAL title ──
  let y = headerY + 8;
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 55, 94);
  doc.text('PROPOSAL', MARGIN, y);

  // Proposal info (right side)
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`Proposal #: ${data.proposal_number}`, pageWidth - MARGIN, y - 6, { align: 'right' });
  doc.text(`Date: ${formatDate(data.created_at)}`, pageWidth - MARGIN, y, { align: 'right' });
  if (data.valid_until) {
    doc.text(`Valid Until: ${formatDate(data.valid_until)}`, pageWidth - MARGIN, y + 6, { align: 'right' });
  }

  // Status badge
  const statusY = y + (data.valid_until ? 12 : 6);
  const statusColor = getStatusColor(data.status);
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(pageWidth - MARGIN - 31, statusY - 4, 31, 7, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(data.status.toUpperCase(), pageWidth - MARGIN - 15.5, statusY, { align: 'center' });
  doc.setTextColor(0, 0, 0);

  // Title
  y += 8;
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 55, 94);
  const titleLines = doc.splitTextToSize(data.title, contentWidth);
  doc.text(titleLines, MARGIN, y);

  // Validity period note
  if (data.valid_until) {
    const validFrom = new Date(data.created_at);
    const validTo = new Date(data.valid_until);
    const diffDays = Math.ceil((validTo.getTime() - validFrom.getTime()) / (1000 * 60 * 60 * 24));
    y += titleLines.length * 6 + 2;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(120, 120, 120);
    doc.text(`This proposal is valid for ${diffDays} days from the date of issue.`, MARGIN, y);
  }

  // Separator
  const sepY = y + 6;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(MARGIN, sepY, pageWidth - MARGIN, sepY);

  // ── Client info ──
  y = sepY + 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('CLIENT:', MARGIN, y);
  doc.setFont('helvetica', 'normal');
  y += 6;
  doc.text(data.client_name, MARGIN, y);
  if (data.client_company) { y += 5; doc.text(data.client_company, MARGIN, y); }
  if (data.client_email) { y += 5; doc.text(data.client_email, MARGIN, y); }
  if (data.client_phone) { y += 5; doc.text(data.client_phone, MARGIN, y); }
  y += 10;

  // ── Rich text sections ──
  if (data.offer_letter) y = addSection(doc, 'Offer Letter', data.offer_letter, y, pageWidth);
  if (data.scope_of_work) y = addSection(doc, 'Project Overview', data.scope_of_work, y, pageWidth);
  if (data.timeline) y = addSection(doc, 'Timeline', data.timeline, y, pageWidth);
  if (data.deliverables) y = addSection(doc, 'Key Deliverables', data.deliverables, y, pageWidth);
  if (data.expected_outcome) y = addSection(doc, 'Expected Outcome', data.expected_outcome, y, pageWidth);

  // ── Budget items table ──
  if (data.items.length > 0) {
    if (y > maxY - 40) { doc.addPage(); y = MARGIN; }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 55, 94);
    doc.text('Budget Details', MARGIN, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [['#', 'Description', 'Qty', 'Unit Price', 'Amount']],
      body: data.items.map((item, i) => [
        (i + 1).toString(),
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

    // Check if totals section needs a new page
    const totalsHeight = 40; // approximate height needed for totals
    if (y + totalsHeight > maxY) { doc.addPage(); y = MARGIN; }

    // Totals
    const totalsX = pageWidth - 70;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    if (data.subtotal != null) {
      doc.text('Subtotal:', totalsX, y);
      doc.text(formatCurrency(data.subtotal), pageWidth - MARGIN, y, { align: 'right' });
      y += 6;
    }
    if (data.tax_rate && data.tax_amount) {
      doc.text(`VAT/Tax (${data.tax_rate}%):`, totalsX, y);
      doc.text(formatCurrency(data.tax_amount), pageWidth - MARGIN, y, { align: 'right' });
      y += 6;
    }
    if (data.discount_amount && data.discount_amount > 0) {
      doc.text('Discount:', totalsX, y);
      doc.text(`-${formatCurrency(data.discount_amount)}`, pageWidth - MARGIN, y, { align: 'right' });
      y += 6;
    }

    doc.setDrawColor(200, 200, 200);
    doc.line(totalsX - 5, y, pageWidth - MARGIN, y);
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Total:', totalsX, y);
    doc.text(formatCurrency(data.total_amount || 0), pageWidth - MARGIN, y, { align: 'right' });
    y += 8;

    // Amount in Words
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(80, 80, 80);
    doc.text(`Amount in Words: ${numberToWords(data.total_amount || 0)}`, MARGIN, y);
    y += 12;
  }

  // ── Offer Letter End ──
  if (data.offer_letter_end) y = addSection(doc, 'Closing', data.offer_letter_end, y, pageWidth);

  // ── Notes & Terms ──
  if (data.notes) y = addSection(doc, 'Notes', data.notes, y, pageWidth);
  if (data.terms) y = addSection(doc, 'Terms & Conditions', data.terms, y, pageWidth);

  // ── Signature section ──
  if (y > maxY - 35) { doc.addPage(); y = MARGIN; }
  y += 10;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);

  // Authorized Signature (left)
  doc.line(MARGIN, y + 15, MARGIN + 71, y + 15);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('Authorized Signature', MARGIN, y + 20);
  doc.setFontSize(8);
  doc.text(company.name || '', MARGIN, y + 25);
  doc.text('Date: ____________________', MARGIN, y + 30);

  // Client Acceptance (right)
  const rightSigX = pageWidth - MARGIN - 71;
  doc.line(rightSigX, y + 15, pageWidth - MARGIN, y + 15);
  doc.setFontSize(9);
  doc.text('Client Acceptance', rightSigX, y + 20);
  doc.setFontSize(8);
  doc.text(data.client_name, rightSigX, y + 25);
  doc.text('Date: ____________________', rightSigX, y + 30);

  // ── Page footers ──
  addPageFooters(doc);

  // ── Output ──
  if (action === 'print') {
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  } else {
    doc.save(`proposal-${data.proposal_number}.pdf`);
  }
}

export type { ProposalData, ProposalItem, CompanyInfo };
