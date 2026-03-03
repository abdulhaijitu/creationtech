

## সমস্যা

কনসোল লগে স্পষ্ট দেখাচ্ছে: `"duplicate key value violates unique constraint \"products_slug_key\""` — অর্থাৎ একই slug দিয়ে দুটি প্রোডাক্ট তৈরি করার চেষ্টা হচ্ছে।

**মূল কারণ**: `handleNameChange` ফাংশনে slug শুধু তখনই জেনারেট হয় যখন `formData.slug` খালি (`formData.slug || generateSlug(value)`)। কিন্তু `resetForm()` কল হলে slug আবার `''` হয়ে যায়, তাই পরবর্তী প্রোডাক্ট তৈরি করতে গেলে যদি একই নাম দেয় বা slug ম্যানুয়ালি চেঞ্জ না করে, তাহলে ডুপ্লিকেট slug-এ ক্র্যাশ হয়।

আরেকটি সমস্যা: slug ফিল্ড একবার সেট হলে নাম পরিবর্তন করলেও slug আপডেট হয় না — ইউজার confused হতে পারে।

## সমাধান

### `AdminProducts.tsx` এ পরিবর্তন:
1. **`handleNameChange`** — সব সময় নাম থেকে slug অটো-জেনারেট করবে (ইউজার ম্যানুয়ালি slug এডিট না করলে)
2. **Slug ইউনিকনেস চেক** — সাবমিটের আগে ডাটাবেজে slug exists কিনা চেক করা
3. **এরর মেসেজ উন্নত করা** — "Slug already exists" স্পষ্ট মেসেজ দেখানো

### পরিবর্তিত ফাইল
- **`src/pages/admin/AdminProducts.tsx`** — slug auto-generation fix + uniqueness validation

