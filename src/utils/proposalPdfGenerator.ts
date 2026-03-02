import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ProposalItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
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

function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function formatCurrency(amount: number): string {
  return `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}`;
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

function addSection(doc: jsPDF, title: string, content: string, y: number, pageWidth: number): number {
  const maxY = doc.internal.pageSize.getHeight() - 20;
  
  if (y > maxY - 20) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 55, 94);
  doc.text(title, 14, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  const stripped = stripHtml(content);
  const lines = doc.splitTextToSize(stripped, pageWidth - 28);
  
  for (const line of lines) {
    if (y > maxY) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, 14, y);
    y += 4.5;
  }

  return y + 4;
}

export function generateProposalPDF(data: ProposalData, action: 'download' | 'print' = 'download'): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 55, 94);
  doc.text('PROPOSAL', 14, 25);

  // Proposal info (right)
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`Proposal #: ${data.proposal_number}`, pageWidth - 14, 18, { align: 'right' });
  doc.text(`Date: ${formatDate(data.created_at)}`, pageWidth - 14, 24, { align: 'right' });
  if (data.valid_until) {
    doc.text(`Valid Until: ${formatDate(data.valid_until)}`, pageWidth - 14, 30, { align: 'right' });
  }

  // Status badge
  const statusY = data.valid_until ? 36 : 30;
  const statusColor = getStatusColor(data.status);
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(pageWidth - 45, statusY - 4, 31, 7, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(data.status.toUpperCase(), pageWidth - 29.5, statusY, { align: 'center' });
  doc.setTextColor(0, 0, 0);

  // Title
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 55, 94);
  const titleLines = doc.splitTextToSize(data.title, pageWidth - 28);
  doc.text(titleLines, 14, 40);
  
  // Separator
  const sepY = 40 + titleLines.length * 6 + 4;
  doc.setDrawColor(200, 200, 200);
  doc.line(14, sepY, pageWidth - 14, sepY);

  // Client info
  let y = sepY + 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('CLIENT:', 14, y);
  doc.setFont('helvetica', 'normal');
  y += 6;
  doc.text(data.client_name, 14, y);
  if (data.client_company) { y += 5; doc.text(data.client_company, 14, y); }
  if (data.client_email) { y += 5; doc.text(data.client_email, 14, y); }
  if (data.client_phone) { y += 5; doc.text(data.client_phone, 14, y); }
  y += 10;

  // Rich text sections
  if (data.offer_letter) y = addSection(doc, 'Offer Letter', data.offer_letter, y, pageWidth);
  if (data.scope_of_work) y = addSection(doc, 'Project Overview', data.scope_of_work, y, pageWidth);
  if (data.timeline) y = addSection(doc, 'Timeline', data.timeline, y, pageWidth);
  if (data.deliverables) y = addSection(doc, 'Key Deliverables', data.deliverables, y, pageWidth);
  if (data.expected_outcome) y = addSection(doc, 'Expected Outcome', data.expected_outcome, y, pageWidth);

  // Budget items table
  if (data.items.length > 0) {
    if (y > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 55, 94);
    doc.text('Budget Details', 14, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [['#', 'Description', 'Qty', 'Unit Price', 'Amount']],
      body: data.items.map((item, i) => [
        (i + 1).toString(),
        item.description,
        item.quantity.toString(),
        formatCurrency(item.unit_price),
        formatCurrency(item.amount),
      ]),
      theme: 'striped',
      headStyles: { fillColor: [34, 55, 94], textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 20, halign: 'center' },
        3: { cellWidth: 35, halign: 'right' },
        4: { cellWidth: 35, halign: 'right' },
      },
      margin: { left: 14, right: 14 },
    });

    y = (doc as any).lastAutoTable.finalY + 8;

    // Totals
    const totalsX = pageWidth - 70;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    if (data.subtotal != null) {
      doc.text('Subtotal:', totalsX, y);
      doc.text(formatCurrency(data.subtotal), pageWidth - 14, y, { align: 'right' });
      y += 6;
    }
    if (data.tax_rate && data.tax_amount) {
      doc.text(`Tax (${data.tax_rate}%):`, totalsX, y);
      doc.text(formatCurrency(data.tax_amount), pageWidth - 14, y, { align: 'right' });
      y += 6;
    }
    if (data.discount_amount && data.discount_amount > 0) {
      doc.text('Discount:', totalsX, y);
      doc.text(`-${formatCurrency(data.discount_amount)}`, pageWidth - 14, y, { align: 'right' });
      y += 6;
    }

    doc.setDrawColor(200, 200, 200);
    doc.line(totalsX - 5, y, pageWidth - 14, y);
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Total:', totalsX, y);
    doc.text(formatCurrency(data.total_amount || 0), pageWidth - 14, y, { align: 'right' });
    y += 12;
  }

  // Offer Letter End
  if (data.offer_letter_end) y = addSection(doc, 'Closing', data.offer_letter_end, y, pageWidth);

  // Notes & Terms
  if (data.notes) y = addSection(doc, 'Notes', data.notes, y, pageWidth);
  if (data.terms) y = addSection(doc, 'Terms & Conditions', data.terms, y, pageWidth);

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Thank you for considering our proposal!', pageWidth / 2, pageHeight - 15, { align: 'center' });
  doc.text(`Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

  if (action === 'print') {
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  } else {
    doc.save(`proposal-${data.proposal_number}.pdf`);
  }
}

export type { ProposalData, ProposalItem };
