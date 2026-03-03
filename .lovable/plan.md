

## সমস্যা

স্ক্রিনশটে দেখা যাচ্ছে **Budget Details** এর totals সেকশনে label ও currency value ওভারল্যাপ করছে। কারণ:
- `totalsX = pageWidth - 70` — এটি label শুরুর x-position, কিন্তু "One-time Subtotal:", "Yearly Recurring:" এই label গুলো যথেষ্ট লম্বা, এবং ডানদিকে right-aligned amount-ও আছে — ফলে দুটো একে অপরের উপর পড়ছে।
- "Total (One-time):" label-ও `totalsX - 10` থেকে শুরু হয়ে amount-এর সাথে clash করছে।

## সমাধান — `src/utils/proposalPdfGenerator.ts`

**totals সেকশনের layout ঠিক করা:**

1. `totalsX` কে আরো বামে নিয়ে আসা: `pageWidth - 70` → `pageWidth - 90` — এতে label-এর জন্য বেশি জায়গা পাবে
2. Label গুলো `right` align না করে `left` aligned রাখা (যেমন আছে), কিন্তু amount column শুরু হবে নির্দিষ্ট position থেকে যাতে overlap না হয়
3. "Total (One-time):" label-এ `totalsX - 10` → `totalsX` ব্যবহার করা

### পরিবর্তন (Line 972, 1014):
```
// Line 972
totalsX = pageWidth - 90;  // was pageWidth - 70

// Line 1014  
doc.text('Total (One-time):', totalsX, y);  // was totalsX - 10
```

এতে label ও value-এর মধ্যে পর্যাপ্ত gap থাকবে এবং ওভারল্যাপ হবে না।

### ফাইল পরিবর্তন
- `src/utils/proposalPdfGenerator.ts` — lines 972, 1014

