

## পরিকল্পনা: Pricing Summary → Budget Details (ব্রেকডাউন ফরম্যাট)

### ডাটাবেজ পরিবর্তন
1. নতুন `proposal_items` টেবিল তৈরি (invoice_items/quotation_items এর মতো):
   - `id`, `proposal_id` (FK), `description`, `quantity`, `unit_price`, `amount`, `display_order`
   - RLS: Admin can manage/view (proposals টেবিলের মাধ্যমে)

2. `proposals` টেবিলে নতুন কলাম যোগ:
   - `subtotal NUMERIC DEFAULT 0`
   - `tax_rate NUMERIC DEFAULT 0`
   - `tax_amount NUMERIC DEFAULT 0`
   - `discount_amount NUMERIC DEFAULT 0`
   
   বিদ্যমান `total_amount` ও `pricing_summary` থাকবে (total_amount ব্যবহৃত হবে, pricing_summary অব্যবহৃত হবে)

### ফাইল: `src/components/admin/ProposalForm.tsx`
1. Pricing Summary এর RichTextEditor সরিয়ে **Budget Details** সেকশন যোগ
2. InvoiceForm এর মতো line items UI:
   - Description (RichTextEditor), Quantity, Unit Price, Amount
   - Add Item / Remove Item বাটন
   - Subtotal, Tax %, Tax Amount, Discount, Total সামারি
3. `total_amount` ইনপুট ফিল্ড সরিয়ে calculated total ব্যবহার
4. Save এ `proposal_items` insert/update এবং proposals টেবিলে subtotal/tax/discount/total আপডেট

### ফাইল: `src/pages/admin/AdminProposals.tsx`
- `createNewVersion` এ proposal_items কপি করার লজিক যোগ

### টেকনিক্যাল নোট
- InvoiceForm এর line items প্যাটার্ন হুবহু অনুসরণ করা হবে (mobile + desktop layout)
- Budget Details সেকশন Expected Outcome এর পরে থাকবে
- Pricing Summary RichTextEditor এবং Total Amount ইনপুট দুটোই সরিয়ে Budget Details ব্রেকডাউনে রিপ্লেস হবে

