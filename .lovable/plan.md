

## পরিকল্পনা: RichTextEditor-এ টেবিল ও জাস্টিফাই অপশন যোগ

### ফাইল: `src/components/ui/rich-text-editor.tsx`

**নতুন TipTap এক্সটেনশন ইনস্টল ও যোগ:**
- `@tiptap/extension-table`, `@tiptap/extension-table-row`, `@tiptap/extension-table-cell`, `@tiptap/extension-table-header` — টেবিল সাপোর্টের জন্য

**পরিবর্তনসমূহ:**
1. **TextAlign কনফিগারেশনে `'justify'` যোগ** — বর্তমানে শুধু left/center/right আছে
2. **টুলবারে Justify বাটন যোগ** — AlignRight এর পরে `AlignJustify` আইকন সহ
3. **Table এক্সটেনশন রেজিস্টার** — editor extensions এ Table, TableRow, TableCell, TableHeader যোগ
4. **টুলবারে Table বাটন গ্রুপ যোগ** — Insert Table (3x3), Add Row, Add Column, Delete Row, Delete Column, Delete Table, Merge/Split Cells
5. **টেবিলের জন্য CSS স্টাইল যোগ** — bordered table styling যাতে editor-এ টেবিল সুন্দরভাবে দেখায়

যেহেতু RichTextEditor একটি শেয়ার্ড কম্পোনেন্ট, এই পরিবর্তন স্বয়ংক্রিয়ভাবে Proposals সহ সব জায়গায় কাজ করবে।

