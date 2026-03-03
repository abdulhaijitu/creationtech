

## সকল পেইজ রেসপনসিভ হার্ড পলিশ, UI/UX পলিশ এবং স্পিড অপটিমাইজেশন

এটি একটি বড় স্কোপের কাজ। আমি কোডবেস বিশ্লেষণ করে নিচের সমস্যাগুলো চিহ্নিত করেছি এবং সমাধান প্রস্তাব করছি:

---

### ১. স্পিড অপটিমাইজেশন

**সমস্যা চিহ্নিত:**
- `App.css` ফাইলে Vite boilerplate CSS আছে (`#root { max-width: 1280px; margin: 0 auto; padding: 2rem; }`) — এটি layout ভেঙে দিতে পারে এবং অপ্রয়োজনীয়
- `QueryClient` কোনো `staleTime` বা `gcTime` কনফিগার করা নেই — প্রতিটি পেজ চেঞ্জে সব query রিফেচ হয়
- সব অ্যাডমিন পেজ eagerly import হচ্ছে — initial bundle বড় হচ্ছে
- `ScrollReveal` কম্পোনেন্ট প্রতিটি সেকশনে একাধিকবার ব্যবহার — Intersection Observer overhead

**সমাধান:**
- `App.css` পুরোটা মুছে ফেলা (এটা Vite boilerplate, ব্যবহৃত হচ্ছে না)
- `QueryClient`-এ গ্লোবাল `staleTime: 5 * 60 * 1000` সেট করা
- অ্যাডমিন রাউটগুলো `React.lazy()` দিয়ে code-split করা
- পাবলিক পেজগুলোও lazy load করা (About, Blog, Careers, Pricing, etc.)

---

### ২. রেসপনসিভ হার্ড পলিশ

**সমস্যা চিহ্নিত:**

| পেইজ/কম্পোনেন্ট | সমস্যা |
|---|---|
| **Contact Hero** | `text-4xl sm:text-5xl lg:text-6xl` — মোবাইলে খুব বড়, `text-3xl` হওয়া উচিত |
| **Pricing Hero** | একই সমস্যা — মোবাইলে hero text overflow হতে পারে |
| **Pricing Comparison Table** | টেবিল মোবাইলে horizontal scroll ছাড়া দেখা যায় না — scroll wrapper দরকার |
| **Portfolio Filter** | `sticky top-0` — Header-এর পেছনে ঢুকে যাচ্ছে, `top-[header-height]` দরকার |
| **Blog Newsletter** | `text-3xl sm:text-4xl` heading mobile-এ একটু বড় |
| **Careers Hero** | `text-4xl sm:text-5xl lg:text-6xl` — mobile-এ shrink দরকার |
| **Footer** | `pt-20` — mobile-এ অতিরিক্ত padding, `pt-12 lg:pt-20` হওয়া উচিত |
| **Admin Layout** | `marginLeft: '3.05rem'` hardcoded — sidebar collapsed width-এর সাথে mismatch হতে পারে |

**সমাধান:**
- সব hero heading `text-3xl sm:text-4xl lg:text-5xl` প্যাটার্নে standardize
- Pricing comparison table-এ `overflow-x-auto` wrapper
- Portfolio sticky filter-এ proper top offset
- Footer mobile padding কমানো
- CTA section action cards মোবাইলে single column

---

### ৩. UI/UX পলিশ

**সমস্যা চিহ্নিত:**
- Blog পেজের ক্যাটেগরি ফিল্টার functional নয় (state নেই)
- `SisterConcernSection` — mobile-এ `sm:grid-cols-3` squeeze হয় ছোট ফোনে
- `FloatingButtons` — WhatsApp button-এর `animate-ping` infinite loop — performance drain ও visually distracting
- Pricing comparison table-এ mobile-এ feature names truncated
- Contact page hero image শুধু desktop-এ দেখায়, mobile-এ empty space

**সমাধান:**
- Blog ক্যাটেগরি ফিল্টারে state management যোগ
- FloatingButtons-এর `animate-ping` সরিয়ে subtle pulse দেওয়া
- SisterConcernSection mobile grid `grid-cols-1 sm:grid-cols-3` ঠিক আছে তবে card padding কমানো
- Contact & Pricing mobile-এ stats section-এর gap/padding optimize

---

### পরিবর্তিত ফাইল তালিকা

| ফাইল | পরিবর্তন |
|---|---|
| `src/App.css` | মুছে ফেলা (boilerplate) |
| `src/App.tsx` | Lazy loading + QueryClient config |
| `src/pages/Contact.tsx` | Hero text size mobile fix |
| `src/pages/Pricing.tsx` | Hero text + comparison table scroll |
| `src/pages/Portfolio.tsx` | Sticky filter top offset |
| `src/pages/Blog.tsx` | Category filter state + newsletter heading |
| `src/pages/Careers.tsx` | Hero text size |
| `src/components/layout/Footer.tsx` | Mobile padding |
| `src/components/common/FloatingButtons.tsx` | Remove infinite ping |
| `src/components/home/CTASection.tsx` | Minor mobile spacing |

**মোট ~10টি ফাইল পরিবর্তন।** কোনো ডাটাবেজ মাইগ্রেশন প্রয়োজন নেই।

