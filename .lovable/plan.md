

## মেনুবার কাপাকাপি (Flickering) ফিক্স

### সমস্যা
Header `sticky top-0` — এর ভেতরে Topbar আছে যেটা scroll-এ `max-h-12` থেকে `max-h-0` হয়ে collapse হয়। এই height পরিবর্তন layout shift ঘটায় — content উপরে উঠে যায় → scroll position বদলায় → Topbar আবার দেখায় → আবার লুকায় = **feedback loop / jitter**।

### সমাধান
Topbar-কে header height থেকে আলাদা করা — `max-h` transition-এর বদলে `transform: translateY` ব্যবহার করা যাতে layout shift না হয়:

**ফাইল: `src/components/layout/Topbar.tsx`**
- `max-h-12`/`max-h-0` সরিয়ে fixed height রাখা
- `overflow-hidden` + `max-h` এর বদলে `translate-y` + `opacity` দিয়ে hide করা — GPU accelerated, no layout shift

**ফাইল: `src/components/layout/Header.tsx`**
- Topbar-কে header-এর বাইরে রাখা অথবা scroll threshold-এ hysteresis যোগ করা (show at <10px, hide at >40px) যাতে rapid toggling না হয়

### পরিবর্তন বিস্তারিত

1. **Header.tsx**: Scroll handler-এ hysteresis প্যাটার্ন — `setIsTopbarVisible` শুধু তখনই `true` হবে যখন `scrollY < 10`, এবং `false` হবে যখন `scrollY > 40`। মাঝের zone-এ previous state বজায় থাকবে।

2. **Topbar.tsx**: `max-h-12`/`max-h-0` replace করা `h-10` fixed height + `-translate-y-full opacity-0` দিয়ে hide করা। Parent-এ `overflow-hidden` wrapper দিয়ে collapsed space ঢাকা।

**মোট ২টি ফাইল পরিবর্তন।**

