

## Topbar ও Menubar ডিজাইন অডিট ও এনহ্যান্সমেন্ট

### চিহ্নিত সমস্যা

1. **Topbar ফ্লিকারিং** — স্ক্রল থ্রেশহোল্ড `scrollY < 10` এ টপবার বারবার show/hide হয়, ফলে ফ্লিকার হয়। `max-h-0` ↔ `max-h-12` ট্রানজিশন দেখতে অসুন্দর।

2. **Topbar ভিজুয়াল ফ্ল্যাট** — শুধু `bg-muted/50` ব্যাকগ্রাউন্ড, কোনো গ্র্যাডিয়েন্ট বা ভিজুয়াল ডেপথ নেই। Contact info ও login ভিজুয়ালি দুর্বল।

3. **Menubar-এ কোড রিপিটিশন** — প্রতিটি nav item-এ একই 15-লাইন ব্লক কপি-পেস্ট করা হয়েছে। একটি `navItems` অ্যারে থেকে `.map()` করলে ক্লিন হবে।

4. **Desktop CTA এরিয়া খালি দেখায়** — শুধু একটি বাটন আছে, Language toggle ডেস্কটপ মেইন nav-এ নেই (শুধু topbar-এ আছে যা স্ক্রলে হাইড হয়ে যায়)।

5. **মোবাইল Sheet ডিজাইন বেসিক** — Nav items-এ আইকন নেই, কোনো ভিজুয়াল হায়ারার্কি নেই।

---

### সমাধান

#### 1. Topbar (`src/components/layout/Topbar.tsx`)
- ব্যাকগ্রাউন্ড `bg-muted/50` → সূক্ষ্ম গ্র্যাডিয়েন্ট `bg-gradient-to-r from-primary/5 via-background to-primary/5` দিয়ে প্রিমিয়াম ফিল
- Contact info-তে সূক্ষ্ম ডিভাইডার ডট যোগ
- Login বাটনে সূক্ষ্ম hover effect এনহ্যান্স
- Phone নম্বরে country code ফরম্যাট: `+880 1833-876434`

#### 2. Header Menubar (`src/components/layout/Header.tsx`)
- **DRY রিফ্যাক্টর**: সব nav items একটি `navItems` অ্যারেতে রেখে `.map()` দিয়ে রেন্ডার — ডেস্কটপ ও মোবাইল উভয়ক্ষেত্রে
- **ডেস্কটপ Right সেকশন**: Language toggle যোগ (topbar হাইড হলেও ব্যবহারযোগ্য থাকবে), তারপর CTA বাটন
- **স্ক্রল থ্রেশহোল্ড ফিক্স**: `scrollY < 10` → `scrollY < 30` করে ফ্লিকারিং কমানো
- Nav item hover-এ সূক্ষ্ম `bg-accent/50` ব্যাকগ্রাউন্ড যোগ

#### 3. মোবাইল Sheet এনহ্যান্স
- প্রতিটি nav item-এ আইকন যোগ (Home → `Home`, Services → `Briefcase` ইত্যাদি)
- Active item-এ বাম দিকে একটি ছোট primary বর্ডার ইন্ডিকেটর

---

### পরিবর্তিত ফাইল
- `src/components/layout/Topbar.tsx`
- `src/components/layout/Header.tsx`

