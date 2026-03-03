

## সমস্যা বিশ্লেষণ

বর্তমান Add/Edit Project মোডালে নিম্নলিখিত UI/UX সমস্যা আছে:

1. **কোনো ভিজ্যুয়াল গ্রুপিং নেই** — সব ফিল্ড একটানা নিচে নামছে, কোনো সেকশন বিভাজন নেই। ফলে ফর্মটি দীর্ঘ ও বিশৃঙ্খল মনে হয়।
2. **Header ও Footer স্ক্রল হয়ে যায়** — `overflow-y-auto` পুরো `DialogContent`-এ আছে, তাই স্ক্রল করলে Title ও Save বাটন দেখা যায় না। Footer সবসময় দৃশ্যমান থাকা উচিত।
3. **ফিল্ড অর্ডার অগোছালো** — Slug প্রথমে আছে যেটা সাধারণত Title থেকে auto-generate হয়। Title আগে আসা উচিত।
4. **Required ফিল্ডের ইন্ডিকেশন দুর্বল** — শুধু `*` চিহ্ন আছে, কোনো ভিজ্যুয়াল পার্থক্য নেই।
5. **Image upload সেকশন আলাদা হিসেবে চেনা যায় না** — অন্য ফিল্ডের সাথে মিশে গেছে।

## সমাধান

**`src/pages/admin/AdminPortfolio.tsx`** — মোডাল ফর্মের কাঠামো রিডিজাইন:

### ১. Sticky Header ও Footer
- `DialogContent`-এ `overflow` সরিয়ে ভেতরে একটি scrollable `div` রাখা হবে
- `DialogHeader` ও `DialogFooter` fixed থাকবে, মাঝের ফর্ম বডি স্ক্রল করবে

### ২. সেকশন গ্রুপিং (ভিজ্যুয়াল বিভাজন)
ফর্মকে লজিক্যাল সেকশনে ভাগ করা হবে, প্রতিটি সেকশনে একটি ছোট heading ও `Separator`:
- **Basic Info** — Title (EN/BN), Slug, Category
- **Client & Description** — Client (EN/BN), Description (EN/BN)
- **Tags & Results** — Tags, Result (EN/BN)
- **Media & Settings** — Image upload, Featured/Active toggles

### ৩. ফিল্ড অর্ডার সংশোধন
- Title (EN) প্রথমে, তারপর Title (BN), তারপে Slug ও Category

### ৪. Slug Auto-generate
- Title (EN) থেকে স্বয়ংক্রিয়ভাবে slug তৈরি হবে (lowercase, spaces → hyphens, special chars removed)। ম্যানুয়ালি এডিটও করা যাবে।

### ৫. উন্নত ভিজ্যুয়াল ফিডব্যাক
- সেকশন headers-এ muted text color ও small font
- Required ফিল্ডের label-এ `text-destructive` রঙে `*`

### পরিবর্তিত ফাইল
- **`src/pages/admin/AdminPortfolio.tsx`** — মোডাল ফর্ম সেকশনের সম্পূর্ণ পুনর্গঠন

