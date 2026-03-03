

## সমস্যা

LanguageToggle দুই জায়গায় আছে:
1. **Topbar** (`src/components/layout/Topbar.tsx`) — লাইন ৫১ এ `<LanguageToggle variant="minimal" />`
2. **Header navbar** (`src/components/layout/Header.tsx`) — ডেস্কটপ রাইট সেকশনে `<LanguageToggle variant="minimal" />`

## সমাধান

**Topbar থেকে LanguageToggle সরিয়ে দেওয়া হবে।** কারণ Topbar স্ক্রল করলে হাইড হয়ে যায়, তাই মেইন navbar-এ রাখাই যুক্তিসঙ্গত — সবসময় অ্যাক্সেসযোগ্য থাকবে।

### পরিবর্তন
- **`src/components/layout/Topbar.tsx`** — LanguageToggle কম্পোনেন্ট ও তার পাশের ডিভাইডার (`<div className="h-4 w-px bg-border/60" />`) সরিয়ে ফেলা হবে।

