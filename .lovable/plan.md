

## Products হিরো সেকশন ফিক্স

### সমস্যা
বর্তমান ProductHero হালকা ব্যাকগ্রাউন্ডে আছে (`bg-gradient-to-br from-[hsl(var(--primary)/0.08)]`) যেটা সাইটের বাকি ডার্ক হিরো সেকশনগুলোর সাথে মেলে না। ইমেজ কোলাজ ওভারফ্লো করছে, ফ্লোটিং ব্যাজ বাইরে চলে যাচ্ছে, আর মোবাইলে কোনো ভিজুয়াল কনটেন্ট নেই।

### সমাধান

Home পেইজের HeroSection এর ডার্ক থিম প্যাটার্ন হুবহু ফলো করে ProductHero সম্পূর্ণ রিডিজাইন করা হবে।

### পরিবর্তন — `src/components/products/ProductHero.tsx`

**ব্যাকগ্রাউন্ড:**
- `bg-hero-background` ক্লাস ব্যবহার (Home হিরোর মতো)
- Teal গ্রেডিয়েন্ট অর্ব + গ্রিড প্যাটার্ন + SVG নেটওয়ার্ক লাইন যোগ
- Bottom fade: `from-[#0a1628]`

**টেক্সট কালার:**
- সব টেক্সট `text-white`, `text-white/60` এ পরিবর্তন
- Badge: `border-teal-500/30 bg-teal-500/10 text-teal-400`
- Title: প্রথম লাইন `text-white`, দ্বিতীয় লাইন `text-teal-400`

**CTA বাটন:**
- Primary: `bg-gradient-to-r from-teal-500 to-teal-400` + shadow
- Outline: `border-white/20 bg-white/5 text-white`

**ইমেজ কোলাজ ফিক্স:**
- কন্টেইনারের মধ্যে ইমেজ রাখা — `overflow-hidden` যোগ
- ইমেজ সাইজ ও পজিশন সঠিকভাবে সেট করা যাতে ওভারল্যাপ না হয়
- ফ্লোটিং ব্যাজ কন্টেইনারের ভেতরে রাখা
- ইমেজ বর্ডার: `border-teal-500/20`
- Decorative circles: teal কালার (`bg-teal-500/15`)

**Stats কার্ড:**
- ডার্ক থিম: `border-teal-500/20 bg-gradient-to-br from-teal-900/40 to-teal-900/20`
- আইকন: `text-teal-400/70`
- টেক্সট: `text-white`, লেবেল: `text-white/50`

**মোবাইল:**
- Stats গ্রিড `grid-cols-3` বজায় রাখা, তবে ছোট স্ক্রিনে সুন্দরভাবে দেখানোর জন্য প্যাডিং এডজাস্ট
- ইমেজ কোলাজ `lg:block` হিসেবে রাখা (ডেস্কটপে দেখাবে)

**Bottom fade:** `from-[#0a1628]` — Home হিরোর সাথে মিল

শুধু একটি ফাইল পরিবর্তন হবে: `src/components/products/ProductHero.tsx`

