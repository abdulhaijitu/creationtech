

## মোডাল UI/UX অডিট ও ফিক্স

### অডিট ফলাফল

সকল admin পেজের মোডাল পরীক্ষা করে নিম্নলিখিত সমস্যা পাওয়া গেছে:

**সমস্যা ১: Overflow/Scroll অনুপস্থিত** — কিছু মোডালে `max-h` ও `overflow-y-auto` নেই, ফলে ছোট স্ক্রিনে কন্টেন্ট কেটে যায় বা পেজের বাইরে চলে যায়।

| পেজ | মোডাল | সমস্যা |
|------|--------|---------|
| AdminLeads | Detail Dialog | `max-h` ও scroll নেই |
| AdminClients | Add/Edit Client | `max-h` ও scroll নেই |
| AdminPayments | View/Edit/Add (তিনটিই) | `max-h` ও scroll নেই |
| AdminCareers | Application Detail | `max-h` ও scroll নেই |

**সমস্যা ২: DialogDescription অনুপস্থিত** — Accessibility warning দেয় (Radix UI)। নিম্নলিখিত মোডালগুলোতে `DialogDescription` নেই:

- AdminClients (Add/Edit)
- AdminPayments (View/Edit/Add)
- AdminCareers (Job Dialog)

**সমস্যা ৩: মোবাইল UX** — Leads Detail মোডালে দীর্ঘ কন্টেন্ট (notes, convert section) থাকলে মোবাইলে scroll সমস্যা।

### ফিক্স প্ল্যান

**১. AdminLeads.tsx**
- Detail Dialog: `max-w-lg` → `max-w-lg max-h-[90vh] overflow-y-auto` যোগ

**২. AdminClients.tsx**
- Dialog: `<DialogContent>` → `<DialogContent className="max-h-[90vh] overflow-y-auto">`
- `DialogDescription` যোগ: "ক্লায়েন্ট তৈরি বা সম্পাদনা করুন"

**৩. AdminPayments.tsx**
- তিনটি Dialog-ই: `<DialogContent>` → `<DialogContent className="max-h-[90vh] overflow-y-auto">`
- View/Edit/Add সবগুলোতে `DialogDescription` যোগ

**৪. AdminCareers.tsx**
- Application Detail: `max-w-lg` → `max-w-lg max-h-[90vh] overflow-y-auto`
- Job Dialog: `DialogDescription` যোগ

### ফাইল পরিবর্তন
- `src/pages/admin/AdminLeads.tsx`
- `src/pages/admin/AdminClients.tsx`
- `src/pages/admin/AdminPayments.tsx`
- `src/pages/admin/AdminCareers.tsx`

