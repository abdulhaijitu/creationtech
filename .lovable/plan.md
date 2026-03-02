

## Proposal PDF Fixes

### File: `src/utils/proposalPdfGenerator.ts`

**1. Logo aspect ratio fix**
- Current: `doc.addImage(logoData, 'PNG', MARGIN, 6, 12, 12)` — forced square
- Fix: Load image into an `Image()` element to get `naturalWidth`/`naturalHeight`, calculate proper ratio, keep height at 12 and scale width proportionally
- Update `loadImageAsDataUrl` to also return dimensions, or calculate ratio separately in `addHeader`

**2. Remove separator line above PROPOSAL**
- Lines 238-245: Remove both horizontal lines (`doc.line(...)`) drawn at `lineY` and `lineY + 1.5`
- Just return `lineY + 2` (small gap after header info) without drawing any lines

**3. Bold text support in rich text rendering**
- Current `htmlToPlainText()` strips `<strong>` and `<b>` tags entirely
- New approach: Parse text chunks into segments with bold/normal style markers
- Create `htmlToStyledSegments()` that returns `Array<{ text: string, bold: boolean }>` per paragraph
- In `addSection` text rendering, iterate segments and switch `doc.setFont('helvetica', 'bold'/'normal')` per segment
- For each line, measure segment widths and render inline with proper font switching

**4. Fix bullet point letter spacing (Expected Outcome)**
- The `• ` bullet character may render with extra spacing in Helvetica
- Replace `\n• ` in `htmlToPlainText` with `\n- ` (dash) or use a simpler bullet marker
- Also ensure no `setCharSpace()` calls exist (already confirmed none)

**5. Fix font size reset on page 4+**
- After `autoTable` renders, it changes the document's font state
- After every `autoTable` call and after every `addNewPage`, explicitly reset: `doc.setFontSize(BODY_FONT)` and `doc.setFont('helvetica', 'normal')`
- Ensure `addSection` always sets font before rendering text (already does at line 364-366, but the offer_letter_end inline rendering at lines 579-606 also needs explicit font reset after tables)

### Implementation detail for bold support:

```text
Input HTML: "This is <strong>important</strong> text"
Parsed segments: [
  { text: "This is ", bold: false },
  { text: "important", bold: true },
  { text: " text", bold: false }
]
Rendering: measure each segment width, draw inline switching fonts
```

The key challenge is handling line wrapping with mixed bold/normal text. Approach:
- Flatten all segments into a single string for `splitTextToSize` to determine line breaks
- Then for each line, re-map which characters are bold vs normal
- Render each sub-segment at calculated X offsets

