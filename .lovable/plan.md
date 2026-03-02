

## Proposal PDF Typography & Rich Text Table Rendering Upgrade

### Changes to `src/utils/proposalPdfGenerator.ts`

**1. Font Size & Line Spacing Updates**
- Base body font: `9pt` → `12pt`
- Line spacing: `4.5mm` → `~5.5mm` (matching single line spacing at 12pt)
- Section heading: `11pt` → `14pt` (standard heading proportion)
- All other text elements scaled proportionally

**2. Rich Text HTML Table Rendering**
Currently `htmlToPlainText()` strips all HTML including tables. The new approach:
- Before converting to plain text, **detect `<table>` blocks** in the HTML
- Extract each table and render it using `autoTable` with parsed rows/columns
- For non-table content, continue using the existing plain text conversion
- This means `addSection` will process content in chunks: text chunk → table → text chunk → etc.

**Implementation approach:**
- Split HTML content by `<table>...</table>` boundaries
- For text segments: use existing `htmlToPlainText()` + line-by-line rendering
- For table segments: parse `<tr>`, `<th>`, `<td>` elements from the HTML and feed them to `autoTable` with matching styles
- Create a helper `parseHtmlTable(html: string)` that returns `{ head: string[][], body: string[][] }`

**3. Specific font size mapping:**
| Element | Current | New |
|---|---|---|
| Body text | 9pt | 12pt |
| Section heading | 11pt | 14pt |
| "To," block | 9-10pt | 12pt |
| Subject line | 10pt | 12pt |
| PROPOSAL title | 18pt | 18pt (keep) |
| Meta info (date, #) | 9pt | 10pt |
| Budget table body | 8.5pt | 10pt |
| Budget table head | 9pt | 10pt |
| Totals | 9-11pt | 11-13pt |
| Amount in words | 8pt | 9pt |
| Validity note | 8pt | 9pt |

**4. Line spacing constant:**
- New constant `LINE_HEIGHT = 5.5` (for 12pt base, single spacing)
- Paragraph gap: `3mm`

### File: `src/utils/proposalPdfGenerator.ts`
- Update all font sizes per mapping above
- Refactor `addSection` to handle mixed text+table content
- Add `parseHtmlTable()` helper
- Update line height constants

