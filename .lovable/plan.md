

## পরিকল্পনা: Expected Outcome ফিল্ড যোগ

### ডাটাবেজ মাইগ্রেশন
- `proposals` টেবিলে `expected_outcome TEXT` কলাম যোগ

### ফাইল: `src/components/admin/ProposalForm.tsx`
1. `formData` state-এ `expected_outcome: ''` যোগ
2. Edit মোডে `expected_outcome` লোড
3. Pricing Summary-এর **আগে** RichTextEditor সহ "Expected Outcome" ফিল্ড যোগ
4. `handleSave`-এ insert/update-এ `expected_outcome` যোগ

