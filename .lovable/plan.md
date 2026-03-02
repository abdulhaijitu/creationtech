

## PDF আউটপুট অডিট ও ফিক্স পরিকল্পনা

### PDF থেকে চিহ্নিত সমস্যাসমূহ

1. **Margin ভুল**: বর্তমানে 14mm (~0.55") — দরকার 25.4mm (1 inch) চারদিকে
2. **Expected Outcome / bullet points হারিয়ে যাচ্ছে**: `stripHtml()` সব structure (bullets, numbering, paragraphs) মুছে ফেলছে — ফলে "After completion, Labtex will have: A fast-loading..." একলাইনে মিশে যাচ্ছে। Bullet/list items আলাদা লাইনে আসা দরকার
3. **Budget table ও Total আলাদা পেজে**: Page 1-এ Subtotal দেখাচ্ছে, Page 2-তে Total — table ও totals একসাথে থাকা উচিত অথবা সঠিক page break
4. **Footer confidentiality text Budget table-র মাঝে**: Footer reserved area ঠিকমতো কাজ করছে না — `maxY` calculation ভুল

---

### ফিক্সসমূহ — `src/utils/proposalPdfGenerator.ts`

#### 1. Margin 1 inch (25.4mm)
- সব জায়গায় `14` → `25.4` (left/right margin)
- `pageWidth - 14` → `pageWidth - 25.4` (right margin)
- autoTable margin: `{ left: 25.4, right: 25.4 }`
- Content width: `pageWidth - 50.8` (দুই পাশে 1 inch)
- Top start Y: `25.4` থেকে শুরু

#### 2. `stripHtml()` উন্নত — list structure preserve
- নতুন `htmlToPlainText()` ফাংশন যা:
  - `<li>` → `"• "` (bullet) বা `"1. "` (ordered) prefix দেয়
  - `<br>`, `<p>`, `</p>` → newline
  - `<table>` → row-by-row text
  - Final strip of remaining tags

#### 3. `addSection()` — multiline aware
- `htmlToPlainText()` ব্যবহার করবে `stripHtml()` এর বদলে
- Split by `\n` করে প্রতিটি line আলাদাভাবে render

#### 4. Page break logic
- `maxY` = `pageHeight - 30` (footer এর জন্য 30mm reserve)
- Budget table-র পরে totals section-এ page break check

#### 5. Budget table margin fix
- autoTable-এও 1 inch margin

### Technical Details

```text
File to modify:
└── src/utils/proposalPdfGenerator.ts
    - MARGIN constant = 25.4 (1 inch)
    - Replace stripHtml() with htmlToPlainText() that preserves bullets/lists
    - Update all coordinate references from 14 → MARGIN
    - Fix maxY for proper footer spacing
```

