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
  tagline?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  watermark_url?: string;
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
const MARGIN = 20;
const HEADER_HEIGHT = 38;
const FOOTER_RESERVE = 22;
const ACCENT_COLOR: [number, number, number] = [34, 55, 94];
const LINE_HEIGHT = 5.5;
const PARAGRAPH_GAP = 3;
const BODY_FONT = 12;
const HEADING_FONT = 14;

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

function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function htmlToPlainText(html: string): string {
  if (!html) return '';
  let text = html;
  text = text.replace(/<ol[^>]*>/gi, '');
  text = text.replace(/<\/ol>/gi, '');
  text = text.replace(/<ul[^>]*>/gi, '');
  text = text.replace(/<\/ul>/gi, '');
  text = text.replace(/<li[^>]*>/gi, '\n• ');
  text = text.replace(/<\/li>/gi, '');
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<\/p>/gi, '\n');
  text = text.replace(/<p[^>]*>/gi, '');
  text = text.replace(/<\/h[1-6]>/gi, '\n');
  text = text.replace(/<h[1-6][^>]*>/gi, '\n');
  text = text.replace(/<\/td>/gi, '  ');
  text = text.replace(/<\/th>/gi, '  ');
  text = text.replace(/<tr[^>]*>/gi, '\n');
  text = text.replace(/<\/tr>/gi, '');
  text = text.replace(/<[^>]+>/gi, '');
  text = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
  text = text.replace(/\n{3,}/g, '\n\n');
  return text.trim();
}

/** Parse an HTML <table> string into head and body arrays for autoTable */
function parseHtmlTable(tableHtml: string): { head: string[][]; body: string[][] } {
  const div = document.createElement('div');
  div.innerHTML = tableHtml;
  const table = div.querySelector('table');
  if (!table) return { head: [], body: [] };

  const head: string[][] = [];
  const body: string[][] = [];

  // Process thead rows
  const theadRows = table.querySelectorAll('thead tr');
  theadRows.forEach(tr => {
    const cells: string[] = [];
    tr.querySelectorAll('th, td').forEach(cell => {
      cells.push((cell.textContent || '').trim());
    });
    if (cells.length) head.push(cells);
  });

  // Process tbody rows
  const tbodyRows = table.querySelectorAll('tbody tr');
  if (tbodyRows.length) {
    tbodyRows.forEach(tr => {
      const cells: string[] = [];
      tr.querySelectorAll('td, th').forEach(cell => {
        cells.push((cell.textContent || '').trim());
      });
      if (cells.length) body.push(cells);
    });
  } else {
    // No explicit thead/tbody — first row with <th> is head, rest is body
    const allRows = table.querySelectorAll('tr');
    let headDone = head.length > 0;
    allRows.forEach(tr => {
      const ths = tr.querySelectorAll('th');
      const tds = tr.querySelectorAll('td');
      if (!headDone && ths.length > 0 && tds.length === 0) {
        const cells: string[] = [];
        ths.forEach(cell => cells.push((cell.textContent || '').trim()));
        head.push(cells);
      } else {
        headDone = true;
        const cells: string[] = [];
        tr.querySelectorAll('td, th').forEach(cell => {
          cells.push((cell.textContent || '').trim());
        });
        if (cells.length) body.push(cells);
      }
    });
  }

  return { head, body };
}

/** Split HTML content into chunks of text and table segments */
function splitContentByTables(html: string): Array<{ type: 'text' | 'table'; content: string }> {
  const chunks: Array<{ type: 'text' | 'table'; content: string }> = [];
  const tableRegex = /<table[\s\S]*?<\/table>/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tableRegex.exec(html)) !== null) {
    const before = html.substring(lastIndex, match.index);
    if (before.trim()) chunks.push({ type: 'text', content: before });
    chunks.push({ type: 'table', content: match[0] });
    lastIndex = match.index + match[0].length;
  }

  const remaining = html.substring(lastIndex);
  if (remaining.trim()) chunks.push({ type: 'text', content: remaining });

  return chunks;
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

// ── Reusable header (every page) ──

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

  // Logo only — no text company name or tagline

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

// ── Watermark (every page) ──

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

// ── Right-side accent strip ──

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

// ── Page footers + watermark ──

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

// ── Custom addPage wrapper ──

function addNewPage(doc: jsPDF, company: CompanyInfo, logoData: string | null): number {
  doc.addPage();
  return addHeader(doc, company, logoData);
}

// ── Section renderer with rich text table support ──

function addSection(
  doc: jsPDF, title: string, content: string, y: number,
  pageWidth: number, company: CompanyInfo, logoData: string | null
): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxY = pageHeight - FOOTER_RESERVE;
  const contentWidth = pageWidth - MARGIN * 2;

  if (y > maxY - 25) { y = addNewPage(doc, company, logoData); }

  // Section heading
  doc.setFontSize(HEADING_FONT);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2]);
  doc.text(title, MARGIN, y);
  y += 7;

  // Split content into text and table chunks
  const chunks = splitContentByTables(content);

  for (const chunk of chunks) {
    if (chunk.type === 'table') {
      // Render HTML table using autoTable
      const tableData = parseHtmlTable(chunk.content);
      if (tableData.body.length > 0 || tableData.head.length > 0) {
        if (y > maxY - 30) { y = addNewPage(doc, company, logoData); }

        autoTable(doc, {
          startY: y,
          head: tableData.head.length > 0 ? tableData.head : undefined,
          body: tableData.body,
          theme: 'grid',
          headStyles: {
            fillColor: ACCENT_COLOR,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10,
            cellPadding: 3,
          },
          bodyStyles: {
            fontSize: 10,
            cellPadding: 3,
            textColor: [55, 55, 55],
          },
          alternateRowStyles: { fillColor: [245, 247, 252] },
          margin: { left: MARGIN, right: MARGIN },
          tableWidth: contentWidth,
        });

        y = (doc as any).lastAutoTable.finalY + PARAGRAPH_GAP + 2;
      }
    } else {
      // Render as plain text
      doc.setFontSize(BODY_FONT);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(55, 55, 55);

      const plainText = htmlToPlainText(chunk.content);
      const paragraphs = plainText.split('\n');

      for (const paragraph of paragraphs) {
        if (paragraph.trim() === '') { y += PARAGRAPH_GAP; continue; }
        const lines = doc.splitTextToSize(paragraph, contentWidth);
        for (const line of lines) {
          if (y > maxY) { y = addNewPage(doc, company, logoData); }
          doc.text(line, MARGIN, y);
          y += LINE_HEIGHT;
        }
      }
    }
  }

  return y + PARAGRAPH_GAP + 1;
}

// ── Main generator ──

export async function generateProposalPDF(
  data: ProposalData,
  action: 'download' | 'print' | 'preview' = 'download',
  companyInfo?: CompanyInfo
): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxY = pageHeight - FOOTER_RESERVE;
  const contentWidth = pageWidth - MARGIN * 2;

  const company: CompanyInfo = {
    name: 'Creation Tech',
    tagline: '-PRIME TECH PARTNER-',
    address: 'Dhaka, Bangladesh',
    phone: '+880 1XXX-XXXXXX',
    email: 'info@creationtech.com',
    website: 'www.creationtech.com',
    ...companyInfo,
  };

  // Load images
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

  // ── PROPOSAL title + meta info ──
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2]);
  doc.text('PROPOSAL', MARGIN, y);

  const rightX = pageWidth - MARGIN;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 70, 70);
  doc.text(`Proposal #: ${data.proposal_number}`, rightX, y - 4, { align: 'right' });
  doc.text(`Date: ${formatDate(data.created_at)}`, rightX, y + 1, { align: 'right' });
  if (data.valid_until) {
    doc.text(`Valid Until: ${formatDate(data.valid_until)}`, rightX, y + 6, { align: 'right' });
  }

  // Validity note
  if (data.valid_until) {
    const validFrom = new Date(data.created_at);
    const validTo = new Date(data.valid_until);
    const diffDays = Math.ceil((validTo.getTime() - validFrom.getTime()) / (1000 * 60 * 60 * 24));
    y += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(120, 120, 120);
    doc.text(`This proposal is valid for ${diffDays} days from the date of issue.`, MARGIN, y);
  }

  y += 10;

  // ── "To," client block ──
  doc.setFontSize(BODY_FONT);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2]);
  doc.text('To,', MARGIN, y);
  y += LINE_HEIGHT;

  doc.setFontSize(BODY_FONT);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 55, 55);

  if (data.client_company) { doc.text(data.client_company, MARGIN, y); y += LINE_HEIGHT; }
  doc.text(data.client_name, MARGIN, y); y += LINE_HEIGHT;
  if (data.client_email) { doc.text(data.client_email, MARGIN, y); y += LINE_HEIGHT; }
  if (data.client_phone) { doc.text(`Mobile: ${data.client_phone}`, MARGIN, y); y += LINE_HEIGHT; }

  y += PARAGRAPH_GAP + 1;

  // ── Subject line ──
  doc.setFontSize(BODY_FONT);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2]);
  doc.text('Subject: ', MARGIN, y);
  const subjectX = MARGIN + doc.getTextWidth('Subject: ');
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 55, 55);
  const subjectLines = doc.splitTextToSize(data.title, contentWidth - doc.getTextWidth('Subject: '));
  doc.text(subjectLines[0], subjectX, y);
  if (subjectLines.length > 1) {
    for (let i = 1; i < subjectLines.length; i++) {
      y += LINE_HEIGHT;
      doc.text(subjectLines[i], MARGIN, y);
    }
  }

  y += 10;

  y += 4;

  // ── Rich text sections ──
  if (data.offer_letter) y = addSection(doc, 'Offer Letter', data.offer_letter, y, pageWidth, company, logoData);
  if (data.scope_of_work) y = addSection(doc, 'Project Overview', data.scope_of_work, y, pageWidth, company, logoData);
  if (data.timeline) y = addSection(doc, 'Timeline', data.timeline, y, pageWidth, company, logoData);
  if (data.deliverables) y = addSection(doc, 'Key Deliverables', data.deliverables, y, pageWidth, company, logoData);
  if (data.expected_outcome) y = addSection(doc, 'Expected Outcome', data.expected_outcome, y, pageWidth, company, logoData);

  // ── Budget items table ──
  if (data.items.length > 0) {
    if (y > maxY - 40) { y = addNewPage(doc, company, logoData); }

    doc.setFontSize(HEADING_FONT);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2]);
    doc.text('Budget Details', MARGIN, y);
    y += 5;

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
      headStyles: { fillColor: ACCENT_COLOR, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 10 },
      bodyStyles: { fontSize: 10 },
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

    y = (doc as any).lastAutoTable.finalY + 8;

    if (y + 40 > maxY) { y = addNewPage(doc, company, logoData); }

    // Totals
    const totalsX = pageWidth - 70;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 55, 55);

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

    doc.setDrawColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2]);
    doc.setLineWidth(0.4);
    doc.line(totalsX - 5, y, pageWidth - MARGIN, y);
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2]);
    doc.text('Total:', totalsX, y);
    doc.text(formatCurrency(data.total_amount || 0), pageWidth - MARGIN, y, { align: 'right' });
    y += 8;

    // Amount in Words
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(80, 80, 80);
    doc.text(`Amount in Words: ${numberToWords(data.total_amount || 0)}`, MARGIN, y);
    y += 10;
  }

  // ── Offer Letter End ──
  // Offer Letter End — rendered without section heading
  if (data.offer_letter_end) {
    const chunks = splitContentByTables(data.offer_letter_end);
    doc.setFontSize(BODY_FONT);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 55, 55);
    for (const chunk of chunks) {
      if (chunk.type === 'table') {
        const tableData = parseHtmlTable(chunk.content);
        if (tableData.body.length > 0 || tableData.head.length > 0) {
          if (y > maxY - 30) { y = addNewPage(doc, company, logoData); }
          autoTable(doc, {
            startY: y, head: tableData.head.length > 0 ? tableData.head : undefined, body: tableData.body,
            theme: 'grid', headStyles: { fillColor: ACCENT_COLOR, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 10, cellPadding: 3 },
            bodyStyles: { fontSize: 10, cellPadding: 3, textColor: [55, 55, 55] }, alternateRowStyles: { fillColor: [245, 247, 252] },
            margin: { left: MARGIN, right: MARGIN }, tableWidth: contentWidth,
          });
          y = (doc as any).lastAutoTable.finalY + PARAGRAPH_GAP + 2;
        }
      } else {
        const plainText = htmlToPlainText(chunk.content);
        const paragraphs = plainText.split('\n');
        for (const paragraph of paragraphs) {
          if (paragraph.trim() === '') { y += PARAGRAPH_GAP; continue; }
          const lines = doc.splitTextToSize(paragraph, contentWidth);
          for (const line of lines) {
            if (y > maxY) { y = addNewPage(doc, company, logoData); }
            doc.text(line, MARGIN, y);
            y += LINE_HEIGHT;
          }
        }
      }
    }
    y += PARAGRAPH_GAP + 1;
  }

  // ── Notes & Terms ──
  if (data.notes) y = addSection(doc, 'Notes', data.notes, y, pageWidth, company, logoData);
  if (data.terms) y = addSection(doc, 'Terms & Conditions', data.terms, y, pageWidth, company, logoData);

  // ── Signature section ──
  if (y > maxY - 35) { y = addNewPage(doc, company, logoData); }
  y += 10;

  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.3);

  doc.line(MARGIN, y + 15, MARGIN + 71, y + 15);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('Authorized Signature', MARGIN, y + 20);
  doc.setFontSize(9);
  doc.text(company.name || '', MARGIN, y + 25);
  doc.text('Date: ____________________', MARGIN, y + 30);

  const rightSigX = pageWidth - MARGIN - 71;
  doc.line(rightSigX, y + 15, pageWidth - MARGIN, y + 15);
  doc.setFontSize(10);
  doc.text('Client Acceptance', rightSigX, y + 20);
  doc.setFontSize(9);
  doc.text(data.client_name, rightSigX, y + 25);
  doc.text('Date: ____________________', rightSigX, y + 30);

  // ── Add headers to autoTable-created pages ──
  const totalPages = doc.getNumberOfPages();
  for (let i = 2; i <= totalPages; i++) {
    doc.setPage(i);
    addHeader(doc, company, logoData);
  }

  // ── Page footers + watermarks ──
  addPageFooters(doc, watermarkData);

  // ── Output ──
  if (action === 'preview') {
    window.open(doc.output('bloburl') as unknown as string, '_blank');
  } else if (action === 'print') {
    doc.autoPrint();
    window.open(doc.output('bloburl') as unknown as string, '_blank');
  } else {
    doc.save(`proposal-${data.proposal_number}.pdf`);
  }
}

export type { ProposalData, ProposalItem, CompanyInfo };
