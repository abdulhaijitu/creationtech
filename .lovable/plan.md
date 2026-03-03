

## Product Add/Edit অডিট ও ক্যাটাগরি ম্যানেজমেন্ট

### সমস্যা চিহ্নিত

1. **Add Product (AdminProducts.tsx)** এবং **Edit Product (AdminProductDetail.tsx)** এর মধ্যে অসঙ্গতি:
   - Add-এ inline gallery code (70 লাইন), Edit-এ `ProductGalleryUpload` component — দুটো আলাদা কোড
   - Edit-এ slug/display_order এডিট করা যায় না
   - Edit-এ `formData` টাইপ `any` — টাইপ-সেফটি নেই
   - Edit-এ delete অপশন নেই

2. **Products টেবিলে `category` কলাম নেই** — ক্যাটাগরি ম্যানেজমেন্ট করতে হলে নতুন টেবিল ও কলাম দরকার

### সমাধান

#### ১. Database Migration
- **`product_categories` টেবিল তৈরি** — `portfolio_categories`-এর মতোই (`id`, `name_en`, `name_bn`, `slug`, `is_active`, `display_order`, `created_at`)
- **`products` টেবিলে `category` কলাম যোগ** (text, nullable)
- RLS: anyone can view active, admin can manage

#### ২. AdminProductDetail.tsx ফিক্স
- `formData` টাইপ `any` সরিয়ে proper interface ব্যবহার
- **Slug ও Display Order** এডিটিং যোগ
- **Category Select** ড্রপডাউন যোগ (`product_categories` থেকে)
- **Delete বাটন** যোগ (AlertDialog সহ)

#### ৩. AdminProducts.tsx (Add Product) ফিক্স
- Inline gallery code সরিয়ে **`ProductGalleryUpload` component** ব্যবহার (Edit-এর মতো)
- **Category Select** ড্রপডাউন যোগ
- **Category Management Dialog** যোগ — "Manage Categories" বাটন (Portfolio-র মতো CRUD dialog)

#### ৪. Public Products পেজে আপডেট
- Products পেজে category-based filtering যোগ (যদি প্রয়োজন হয় ভবিষ্যতে)

### পরিবর্তিত ফাইল
- **Database migration** — `product_categories` টেবিল + `products.category` কলাম
- **`src/pages/admin/AdminProducts.tsx`** — Gallery simplification, category management dialog, category select
- **`src/pages/admin/AdminProductDetail.tsx`** — Type fix, slug/order editing, category select, delete button

