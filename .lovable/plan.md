

## প্রপোজাল সিস্টেম পূর্ণ অডিট ও ফিক্স পরিকল্পনা

### সমস্যা চিহ্নিত

1. **Duplicate Link extension warning**: Console-এ `Duplicate extension names found: ['link']` — StarterKit-এ Link আছে, আবার আলাদা `Link.configure()` যোগ করা হয়েছে
2. **PDF-এ Budget item description HTML strip হচ্ছে না**: `item.description` rich text (HTML) কিন্তু autoTable-এ raw HTML যাচ্ছে
3. **PDF footer শুধু শেষ পেজে** — মাল্টি-পেজ প্রপোজালে প্রতি পেজে footer/page number নেই
4. **Terms & Conditions দুই কলামে** আছে (Notes এর সাথে) — এক কলাম করতে হবে
5. **Duplicate supabase import**: `AdminProposals.tsx`-এ `supabase` এবং `supabaseClient` দুটোই একই import
6. **PDF-তে কোম্পানি তথ্য নেই** — বাংলাদেশ স্ট্যান্ডার্ডে কোম্পানি header/letterhead থাকা উচিত
7. **PDF-তে Bangla currency** সঠিক আছে (৳) কিন্তু "Amount in Words" নেই

---

### পরিবর্তনসমূহ

#### 1. `src/components/ui/rich-text-editor.tsx` — Duplicate Link fix
- StarterKit থেকে `link: false` করে আলাদা Link extension রাখা (কারণ আলাদা configure দরকার)

#### 2. `src/utils/proposalPdfGenerator.ts` — PDF অডিট ও ফিক্স
- **Budget item description**: `stripHtml()` দিয়ে HTML strip করা
- **মাল্টি-পেজ footer**: প্রতি পেজে page number যোগ (`Page X of Y`)
- **কোম্পানি header**: PDF-র টপে কোম্পানি নাম, ঠিকানা, ফোন, ইমেইল (business_info থেকে parameter হিসেবে নেওয়া, অথবা static fallback)
- **Amount in Words**: Total amount-এর পরে "Amount in Words" (English) যোগ
- **Signature section**: PDF শেষে "Authorized Signature" ও "Client Acceptance" লাইন যোগ — বাংলাদেশ স্ট্যান্ডার্ড
- **Reference number format**: Proposal নম্বরের ফরম্যাট ঠিক রাখা

#### 3. `src/components/admin/ProposalForm.tsx` — Terms একক কলাম
- Notes & Terms সেকশনকে `lg:grid-cols-2` থেকে বের করে Terms আলাদা full-width Card-এ রাখা
- Notes Budget Summary-র সাথে থাকবে, Terms আলাদা full-width

#### 4. `src/pages/admin/AdminProposals.tsx` — Cleanup
- Duplicate `supabaseClient` import সরানো, শুধু `supabase` ব্যবহার

#### 5. বাংলাদেশ স্ট্যান্ডার্ড অতিরিক্ত ফিচার (PDF)
- **VAT/Tax**: "VAT/Tax" লেবেল (বাংলাদেশে VAT 15% standard)
- **Payment Terms**: PDF-তে payment terms section
- **Validity Period**: "This proposal is valid for X days" স্পষ্টভাবে
- **Confidentiality Notice**: PDF footer-এ confidentiality disclaimer

### Technical Details

```text
Files to modify:
├── src/components/ui/rich-text-editor.tsx      (fix duplicate Link extension)
├── src/utils/proposalPdfGenerator.ts           (PDF audit: HTML strip, pagination, company header, signature, amount in words)
├── src/components/admin/ProposalForm.tsx        (Terms full-width layout)
└── src/pages/admin/AdminProposals.tsx           (remove duplicate import)
```

