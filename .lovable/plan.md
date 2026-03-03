

## Portfolio Category Management

### সমস্যা
বর্তমানে `portfolio_projects` টেবিলে `category` একটি ফ্রি-টেক্সট ফিল্ড — কোনো ক্যাটাগরি ম্যানেজমেন্ট নেই। একই ক্যাটাগরি ভিন্নভাবে লেখা হতে পারে।

### সমাধান

#### ১. নতুন `portfolio_categories` টেবিল তৈরি
- `id`, `name_en`, `name_bn`, `slug`, `is_active`, `display_order`, `created_at`
- RLS: anyone can view active, admin can manage

#### ২. Admin Portfolio পেজে Category Management UI
- **List view-তে** "Manage Categories" বাটন যোগ (Portfolio heading-এর পাশে)
- একটি **Dialog** দিয়ে ক্যাটাগরি CRUD:
  - ক্যাটাগরি লিস্ট (name EN/BN, active toggle)
  - Add/Edit/Delete অপশন
  - Inline editing সাপোর্ট

#### ৩. Project Form-এ Category ফিল্ড পরিবর্তন
- ফ্রি-টেক্সট `Input` এর বদলে `Select` ড্রপডাউন
- ড্রপডাউনে `portfolio_categories` থেকে active ক্যাটাগরি দেখাবে

#### ৪. Public Portfolio পেজে আপডেট
- ক্যাটাগরি ফিল্টার বাটনগুলো `portfolio_categories` থেকে আসবে (ordered)

### পরিবর্তিত ফাইল
- **Database migration** — `portfolio_categories` টেবিল
- **`src/pages/admin/AdminPortfolio.tsx`** — Category management dialog + Select dropdown
- **`src/pages/Portfolio.tsx`** — Categories from DB instead of extracting from projects

