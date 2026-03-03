

## পরিকল্পনা: Topbar-এ ডাইনামিক সোশ্যাল আইকন যোগ করা

### সমস্যা
Topbar-এর Login বাটনের বামপাশে কোনো সোশ্যাল মিডিয়া আইকন নেই।

### সমাধান
Footer-এ যেভাবে `business_info` টেবিল থেকে `social_facebook`, `social_twitter`, `social_linkedin`, `social_instagram` কী দিয়ে ডাইনামিক সোশ্যাল লিংক দেখানো হচ্ছে, ঠিক একই প্যাটার্ন ব্যবহার করে Topbar-এও সোশ্যাল আইকন যোগ করা হবে।

### পরিবর্তন
**`src/components/layout/Topbar.tsx`**:
1. `useBusinessInfoMap` hook ইমপোর্ট করা
2. `Facebook`, `Twitter`, `Linkedin`, `Instagram` আইকন ইমপোর্ট করা (lucide-react থেকে)
3. Footer-এর মতো `socialLinks` অ্যারে ও `getSocialLink` হেল্পার ব্যবহার করা
4. Login বাটনের বামপাশে ছোট সোশ্যাল আইকন রেন্ডার করা (একটি ডিভাইডার সহ)

### কোড স্ট্রাকচার
```tsx
// Right Side
<div className="flex items-center gap-2">
  {/* Social Icons */}
  {socialLinks.map(social => (
    <a key={social.key} href={getSocialLink(social.key)} ...>
      <social.icon className="h-3.5 w-3.5" />
    </a>
  ))}
  <div className="h-4 w-px bg-border/60" />  {/* Divider */}
  <Button>Login</Button>
</div>
```

ডেটা `business_info` টেবিল থেকে আসবে, তাই অ্যাডমিন প্যানেল থেকে লিংক পরিবর্তন করলে Topbar-এও আপডেট হবে।

