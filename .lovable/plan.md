

## পরিকল্পনা: Offer Letter End ফিল্ড যোগ

### ডাটাবেজ মাইগ্রেশন
- `proposals` টেবিলে `offer_letter_end TEXT` কলাম যোগ

### ফাইল: `src/components/admin/ProposalForm.tsx`
1. `formData` state-এ `offer_letter_end: ''` যোগ
2. Edit মোডে `offer_letter_end` লোড
3. Budget Details কার্ডের **পরে** এবং Notes & Terms সেকশনের **আগে** একটি নতুন Card-এ RichTextEditor সহ "Offer Letter End" ফিল্ড যোগ
4. `handleSave`-এ `offer_letter_end` ফিল্ড insert/update-এ যোগ

