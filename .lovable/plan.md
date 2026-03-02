

## Proposal PDF Output Adjustments + Print Preview

### Changes to `src/utils/proposalPdfGenerator.ts`

1. **Header — Logo only, no text name/tagline**: Remove `doc.text(company.name...)` and `doc.text(company.tagline...)` from `addHeader()`. Keep only the logo image on the left side.

2. **Remove horizontal line above PROPOSAL**: Delete the separator lines at lines 503-506 (between Subject and sections).

3. **Remove underline below Subject**: The line at y after subject (lines 502-506) will be removed entirely.

4. **Section title "Offer Letter"**: Currently renders as `'Offer Letter'` — already correct (line 509). No change needed.

5. **Remove letter spacing**: Check all `doc.text()` calls — jsPDF doesn't add letter spacing by default; however if `setCharSpace` is called anywhere, remove it. Currently none found, so no change needed.

6. **Timeline as table**: Currently `timeline` is rendered via `addSection` as rich text. Since the user enters timeline as an HTML table in the rich text editor, it should already render as a table via `splitContentByTables` + `parseHtmlTable`. No code change needed — this is handled by the existing table detection logic.

7. **Budget Details — Remove Subtotal row**: Remove the subtotal rendering block (lines 559-563) where `data.subtotal` is displayed.

8. **Remove "Closing" section title**: Change line 595 from `'Closing'` to render the `offer_letter_end` content without a section heading, or simply remove the "Closing" label. Will render `offer_letter_end` content inline without a heading.

9. **Add PDF/Print Preview**: Add a preview mode that opens the PDF in a new browser tab (using `doc.output('bloburl')`) without auto-print or download. Update `AdminProposals.tsx` to add a "Preview" dropdown option.

### Changes to `src/pages/admin/AdminProposals.tsx`
- Add "Preview PDF" option in the dropdown menu
- Pass `'preview'` action to `generateProposalPDF`

### Specific code changes in `proposalPdfGenerator.ts`:

| Line(s) | Change |
|---|---|
| 228-237 | Remove company name text and tagline text from header |
| 400 | Update action type to include `'preview'` |
| 502-506 | Remove separator line after Subject |
| 559-563 | Remove Subtotal display in Budget Details |
| 595 | Remove "Closing" heading — render `offer_letter_end` without section title |
| 636-641 | Add `'preview'` case that opens bloburl in new tab without autoPrint |

