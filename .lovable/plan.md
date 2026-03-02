

## সমস্যা বিশ্লেষণ

বর্তমানে Leads (contact_submissions, quote_requests, meeting_requests) এবং Clients (clients টেবিল) সম্পূর্ণ আলাদা। ফলে Lead থেকে Quotation/Proposal তৈরি করতে গেলে আবার ম্যানুয়ালি Client যোগ করতে হয়।

## প্রস্তাবিত সমাধান: "Convert to Client" ফিচার

Lead যোগ হলে সেটা **অটোমেটিক্যালি Client তৈরি করবে না** — কারণ সব Lead-ই ক্লায়েন্ট হয় না। বরং Lead-এর ডিটেইল দেখার সময় একটি **"Convert to Client"** বাটন থাকবে যেটা:

1. Lead-এর নাম, ইমেইল, ফোন, কোম্পানি তথ্য নিয়ে `clients` টেবিলে insert করবে
2. ডুপ্লিকেট চেক করবে (email দিয়ে) — যদি আগে থেকেই client থাকে তাহলে জানাবে
3. সফল হলে toast দেখাবে এবং Client Profile-এ নেভিগেট করার অপশন দেবে

### কারিগরি বিবরণ

**ফাইল: `src/pages/admin/AdminLeads.tsx`**

- Lead detail dialog-এ (যেখানে status change, notes আছে) একটি নতুন **"Convert to Client"** বাটন যোগ
- ক্লিক করলে:
  ```
  1. clients টেবিলে email দিয়ে চেক → আগে থাকলে "Already exists" toast
  2. না থাকলে → clients টেবিলে insert (name, email, phone, company, notes হিসেবে lead source তথ্য)
  3. সফল হলে → "Client created" toast + optional navigate to /admin/clients/:id
  ```
- Lead-এর status `'converted'` করে দেবে (ঐচ্ছিক — ট্র্যাকিং-এর জন্য)

### ডাটাবেজ পরিবর্তন
কোনো স্কিমা পরিবর্তন লাগবে না। বিদ্যমান `clients` টেবিলেই insert হবে।

### বিকল্প পদ্ধতি (অটো-ক্রিয়েট)
যদি চান যে Lead যোগ হওয়ামাত্র অটোমেটিক Client তৈরি হোক, সেটাও করা যায় — তবে এতে অপ্রয়োজনীয় Client এন্ট্রি জমা হবে। "Convert to Client" পদ্ধতিটি বেশি পরিচ্ছন্ন।

