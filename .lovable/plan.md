

## Quotation পেজে Download PDF / Print / Send DropdownMenu যোগ

### পরিবর্তন: `src/pages/admin/AdminQuotations.tsx`

বর্তমানে Quotation কার্ডে আলাদা "PDF" বাটন (line 445-485) এবং DropdownMenu তে শুধু status change / convert / delete আছে। Invoice পেজের প্যাটার্ন অনুসরণ করে:

1. **আলাদা PDF বাটন সরানো** — line 445-485 এর standalone Download PDF বাটন রিমুভ
2. **DropdownMenu তে তিনটি অপশন যোগ** (separator সহ, status items এর আগে):
   - **Download PDF** — বর্তমান PDF download logic
   - **Print** — `printPDF()` ব্যবহার করে ব্রাউজারে print dialog খোলা
   - **Send Quotation** — PDF download + status `sent` এ আপডেট (draft/pending হলে)
3. **Helper function extract** — `buildQuotationPDFData(quotation)` ফাংশন তৈরি (Invoice পেজের `buildInvoicePDFData` এর মতো) যাতে Download, Print, Send সবাই reuse করতে পারে
4. **Import যোগ** — `printPDF` import, `Printer` ও `Send` icon import, `DropdownMenuSeparator` import

### পরিবর্তিত ফাইল:
- `src/pages/admin/AdminQuotations.tsx`

