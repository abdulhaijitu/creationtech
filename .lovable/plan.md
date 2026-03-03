

## প্রোডাক্ট কার্ড UI/UX অডিট ও ফিক্স

### সমস্যা চিহ্নিত

**ক্রিটিক্যাল:** Products পেইজে হিরোর পর সব সেকশন (ProductShowcase, ProductOverview, ProductFeatures, ProductHowItWorks, ProductTechnology) অদৃশ্য — সরাসরি CTA ও ফুটার দেখায়। কারণ হলো ScrollReveal অ্যানিমেশন কাজ করছে না — এলিমেন্টগুলো `opacity: 0` এ আটকে আছে এবং IntersectionObserver ট্রিগার হচ্ছে না।

**ProductShowcase কার্ডের UI সমস্যা (কোড রিভিউ থেকে):**
1. কার্ডের বাইরের `div` এ `flex flex-col` নেই, তাই ভেতরের `flex-1` কাজ করে না — কার্ড হাইট অসমান হয়
2. প্রোডাক্ট টাইপ/ক্যাটাগরি ব্যাজ নেই — কার্ডে কন্টেক্সট অভাব
3. CTA বাটন দুটো মোবাইলে `flex-col gap-3` এ স্ট্যাক হয় — ক্র্যাম্পড লাগে
4. ডেসক্রিপশন `text-sm` — পড়তে কষ্ট
5. ইমেজে হোভার ওভারলে খুব সাটল (`from-background/30`)

### সমাধান

#### ১. ScrollReveal ফিক্স — `src/hooks/useScrollReveal.ts`
- `useState(false)` এর পরিবর্তে SSR/hydration সমস্যা এড়াতে একটু delay দিয়ে IntersectionObserver সেটআপ করা
- রিপোর্ট করা সমস্যা অনুযায়ী, observer কাজ না করলে fallback হিসেবে ১ সেকেন্ড পর `setIsVisible(true)` করা (safety net)

#### ২. ProductShowcase কার্ড রিডিজাইন — `src/components/products/ProductShowcase.tsx`
- কার্ড wrapper এ `flex flex-col` যোগ করে হাইট সমান করা
- ইমেজের উপর প্রোডাক্ট ক্যাটাগরি ব্যাজ যোগ (যেমন "ISP Solution", "Cooperative" ইত্যাদি)
- ডেসক্রিপশন `text-sm` → `text-base` করা
- CTA বাটন গ্যাপ বাড়ানো এবং মোবাইলেও `flex-row` করা (বাটন দুটো পাশাপাশি)
- ইমেজ ওভারলে আরো ভিজিবল করা
- `active:scale-[0.96]` বজায় রাখা

#### ফাইল পরিবর্তন:
1. `src/hooks/useScrollReveal.ts` — fallback timer যোগ
2. `src/components/products/ProductShowcase.tsx` — কার্ড স্ট্রাকচার ও স্টাইল ফিক্স

