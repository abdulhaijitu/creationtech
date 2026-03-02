

## পরিকল্পনা: রিচ টেক্সট বুলেট/নাম্বারিং ফিক্স, প্রপোজাল PDF, এবং কাস্টমার অ্যাকশন

### ১. বুলেট/নাম্বারিং ফিক্স

**সমস্যা**: TipTap এর `prose` ক্লাসে Tailwind Typography প্লাগইন ছাড়া `list-style` এবং `padding` কাজ করে না। বুলেট/নাম্বারিং রেন্ডার হচ্ছে না কারণ CSS-এ `ul`/`ol` স্টাইল নেই।

**ফিক্স — `src/index.css`**: ProseMirror-এর জন্য list styles যোগ:
```css
.ProseMirror ul { list-style: disc; padding-left: 1.5rem; }
.ProseMirror ol { list-style: decimal; padding-left: 1.5rem; }
.ProseMirror li p { margin: 0; }
```

### ২. প্রপোজাল A4 PDF জেনারেশন

**নতুন ফাংশন — `src/utils/pdfGenerator.ts`**: `generateProposalPDF()` ফাংশন যোগ যা পুরো প্রপোজাল রেন্ডার করবে:
- Proposal header (নম্বর, তারিখ, স্ট্যাটাস)
- Client info
- Offer Letter (HTML → plain text stripped)
- Scope of Work, Timeline, Deliverables, Expected Outcome
- Budget items table (autoTable)
- Totals (subtotal, tax, discount, total)
- Offer Letter End
- Notes & Terms
- Footer

HTML rich text থেকে plain text extract করতে একটি `stripHtml()` helper ব্যবহার হবে।

### ৩. AdminProposals — PDF ডাউনলোড / প্রিন্ট / মেইল অপশন

**ফাইল — `src/pages/admin/AdminProposals.tsx`**:
- Dropdown menu-তে নতুন অপশন যোগ:
  - **Download PDF** — `generateProposalPDF()` কল
  - **Print** — PDF generate করে `window.open` দিয়ে প্রিন্ট
  - **Email with PDF** — mailto link (PDF সরাসরি attach সম্ভব নয়, তাই email body-তে সারাংশ)

### ৪. কাস্টমার Accept / Negotiation অপশন

**ফাইল — `src/pages/admin/AdminProposals.tsx`**:
- Dropdown-এ দুটি নতুন status option:
  - **Mark as Negotiation** — status `negotiation` এ আপডেট
  - (Accepted আগেই `accepted` হিসেবে আছে)

**ফাইল — `src/lib/status-colors.ts`**:
- `negotiation` status যোগ → `warning` variant

### Technical Details

```text
Files to modify:
├── src/index.css                    (list styles for ProseMirror)
├── src/utils/pdfGenerator.ts        (add generateProposalPDF function)
├── src/pages/admin/AdminProposals.tsx (PDF/print/email/negotiation options)
└── src/lib/status-colors.ts         (add 'negotiation' status)
```

