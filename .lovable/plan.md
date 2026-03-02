

## পরিকল্পনা: Offer Letter ফিল্ড যোগ

### পরিবর্তন

**ফাইল: `src/components/admin/ProposalForm.tsx`**

1. `formData` state-এ `offer_letter: ''` যোগ
2. Proposal Details সেকশনে Subject ও Valid Until/Total Amount-এর পরে, Scope of Work-এর **আগে** একটি নতুন RichTextEditor ফিল্ড যোগ — লেবেল **"Offer Letter"**
3. `handleSave` ফাংশনে `offer_letter` ফিল্ড insert/update-এ যোগ
4. Edit মোডে `proposal` থেকে `offer_letter` লোড

**ডাটাবেজ মাইগ্রেশন:**
- `proposals` টেবিলে `offer_letter TEXT` কলাম যোগ করতে হবে

