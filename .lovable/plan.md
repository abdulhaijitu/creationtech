

## Proposal PDF Professional Redesign Plan

### Reference Design Analysis
The uploaded design shows a significantly different layout from current:

1. **Header**: Logo on left, company contact info **right-aligned** (with icon labels like "Location Icon", "Phone Icon", "Email Icon", "Website Icon")
2. **Header repeats on every page** (currently only page 1)
3. **Watermark**: Faded logo image (`jolchap.png`) on bottom-right of every page
4. **"To," block**: Client info listed as Company, Address, Email, Contact
5. **"Subject:" line**: Bold subject/title line
6. **Validity note**: Italic text under PROPOSAL title ("This proposal is valid for X days...")
7. **Section headings**: Bold with clean paragraph text, bullet points preserved
8. **Blue accent gradient** decorative element on right side (from the reference)

### Files to Modify

**1. Copy watermark asset**
- Copy `user-uploads://jolchap.png` → `src/assets/jolchap.png`

**2. `src/utils/proposalPdfGenerator.ts` — Full redesign**
- **Repeating header on every page**: Extract header rendering into a reusable function; call it on page 1 and via `addPage` wrapper
- **Header layout change**: Logo left, company info right-aligned with text labels (Address, Phone, Email, Website)
- **Watermark on every page**: Load `jolchap.png` as data URL, draw it semi-transparent on bottom-right of each page in the final footer pass
- **"To," client block**: Format as "To, \n Company/Client Name \n Address \n Email \n Contact"
- **"Subject:" line**: Bold prefix "Subject:" followed by proposal title
- **addPage wrapper**: Custom function that adds a new page and draws the header + watermark automatically
- **Content start Y**: After header (~45mm) on every page

**3. `src/utils/pdfGenerator.ts` — Same treatment for Invoice/Quotation**
- Apply identical header, watermark, and per-page header logic
- Same layout changes (logo left, info right, repeating header, watermark)

**4. `src/pages/admin/AdminProposals.tsx`** — Pass watermark image
- Import `jolchap.png` and pass it to `generateProposalPDF` as part of CompanyInfo or separate param

**5. `src/pages/admin/AdminInvoices.tsx` & `AdminQuotations.tsx`** — Same watermark pass

### Technical Details

```text
Header layout (per page):
┌──────────────────────────────────────────────────┐
│ [LOGO] CREATION TECH     House #71, Road #27... │
│        -PRIME TECH PARTNER-    +880 1777656517  │
│                              info@creation...   │
│                              www.creation...    │
├──────────────────────────────────────────────────┤
│ PROPOSAL              Proposal #: PRO-00001     │
│ Valid for 12 days...       Date: Mar 3, 2026    │
│                       Valid Until: Mar 14, 2026  │
│                                                  │
│ To,                                              │
│ Company / Client Name                            │
│ Address                                          │
│ Email                                            │
│ Contact                                          │
│                                                  │
│ Subject: Proposal for High-Performance...        │
│                                                  │
│ [Content sections...]                            │
│                                                  │
│                              ┌─────────────┐     │
│                              │  WATERMARK   │     │
│                              │  (jolchap)   │     │
│                              └─────────────┘     │
│ CONFIDENTIAL...           Page 1 of N            │
└──────────────────────────────────────────────────┘

Key changes:
- addHeader(doc, company, logoData) → reusable, returns startY
- addWatermark(doc, watermarkData) → bottom-right, low opacity
- addPageFooters() → also adds watermark to each page
- CompanyInfo interface gets watermark_url field
- Import jolchap.png statically as fallback watermark
```

### Scope
- Proposal PDF: Full redesign matching reference
- Invoice & Quotation PDF: Same header/watermark/footer treatment
- All three document types get consistent professional look

