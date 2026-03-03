

## Invoice Send / PDF / Print অপশন

### পরিবর্তন

#### 1. `src/utils/pdfGenerator.ts`
- `generatePDF` ফাংশনকে রিফ্যাক্টর করে `jsPDF` doc object রিটার্ন করানো (save না করে)
- তিনটি আলাদা export ফাংশন তৈরি:
  - `downloadPDF(data, companyInfo)` — বর্তমান behavior, `doc.save()` কল করবে
  - `printPDF(data, companyInfo)` — `doc.output('bloburl')` দিয়ে নতুন window তে print করবে
  - `getInvoicePDFBlob(data, companyInfo)` — PDF blob রিটার্ন করবে email send এর জন্য

#### 2. `src/pages/admin/AdminInvoices.tsx`
- প্রতিটি invoice row এর actions এ একটি **DropdownMenu** যোগ (বর্তমান individual icon buttons এর বদলে):
  - **Download PDF** — বর্তমান download behavior
  - **Print** — নতুন ব্রাউজার ট্যাবে PDF খুলে print dialog দেখাবে
  - **Send via Email** — status "sent" এ আপডেট করবে এবং toast দেখাবে (actual email পাঠানোর জন্য edge function দরকার হবে, আপাতত status update + PDF download)
  - **Edit** ও **Delete** বর্তমানের মতো থাকবে

#### 3. Helper function for building PDF data
- Invoice থেকে `DocumentData` তৈরি করার জন্য একটি reusable helper extract করা, কারণ Download, Print, ও Send সবাই একই data build করে।

### ফাইল পরিবর্তন:
1. `src/utils/pdfGenerator.ts` — generatePDF রিফ্যাক্টর + নতুন export functions
2. `src/pages/admin/AdminInvoices.tsx` — DropdownMenu actions যোগ, helper function extract

