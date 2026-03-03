

## Backend ও Frontend Bangla টেক্সট → English রূপান্তর

### সমস্যা
Admin panel এবং কিছু frontend কোডে সরাসরি বাংলা টেক্সট হার্ডকোড করা আছে (DialogDescription, toast messages, button labels ইত্যাদি)। এগুলো English-এ পরিবর্তন করতে হবে।

> **নোট:** `LanguageContext.tsx`-এর বাংলা translations এবং public-facing পেজগুলোতে `language === 'bn'` conditional rendering রাখা হবে — কারণ সেগুলো bilingual UI-এর অংশ, হার্ডকোড না।

### পরিবর্তন

**১. `src/pages/admin/AdminLeads.tsx`** — সবচেয়ে বেশি Bangla
- Toast: `'সফল!'` → `'Success!'`, `'নতুন Lead যোগ হয়েছে'` → `'New lead added'`
- Convert button: `'রূপান্তর হচ্ছে...'` → `'Converting...'`, `'ক্লায়েন্টে রূপান্তর করুন'` → `'Convert to Client'`
- Helper text: `'Lead-এর তথ্য নিয়ে নতুন ক্লায়েন্ট তৈরি হবে'` → `'A new client will be created from this lead's info'`
- Dialog title: `'নতুন Lead যোগ করুন'` → `'Add New Lead'`
- DialogDescription: `'Lead-এর টাইপ সিলেক্ট করে তথ্য পূরণ করুন'` → `'Select lead type and fill in the details'`
- Buttons: `'বাতিল'` → `'Cancel'`, `'সেভ হচ্ছে...'` → `'Saving...'`, `'সেভ করুন'` → `'Save'`

**২. `src/pages/admin/AdminClients.tsx`**
- DialogDescription: `'ক্লায়েন্টের তথ্য পূরণ করুন'` → `'Fill in the client details'`

**৩. `src/pages/admin/AdminPayments.tsx`**
- 3টি DialogDescription: English-এ পরিবর্তন (`'View payment details'`, `'Update payment information'`, `'Add a new payment record'`)

**৪. `src/pages/admin/AdminCareers.tsx`**
- 2টি DialogDescription: English-এ পরিবর্তন (`'Fill in the job posting details'`, `'View applicant details'`)

**৫. `src/pages/admin/AdminProposals.tsx`**
- Alert button: `'ডিলিট করুন'` → `'Delete'`

**৬. `src/pages/admin/AdminServices.tsx`**
- Default/placeholder values for `cta_text_bn`: এগুলো ঠিকই আছে কারণ এটা bilingual content field — কিন্তু placeholder text রাখা যায়

### ফাইল পরিবর্তন
- `src/pages/admin/AdminLeads.tsx`
- `src/pages/admin/AdminClients.tsx`
- `src/pages/admin/AdminPayments.tsx`
- `src/pages/admin/AdminCareers.tsx`
- `src/pages/admin/AdminProposals.tsx`

