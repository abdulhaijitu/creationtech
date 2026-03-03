

## সমস্যা

PDF-এর প্রতিটি পেইজের ডান পাশে একটি accent strip (vertical line) আসছে। এটি `addAccentStrip` ফাংশন থেকে আসছে যা প্রতিটি পেইজে 3টি semi-transparent rectangle draw করে। স্ক্রিনশটে এটি স্পষ্টভাবে দেখা যাচ্ছে।

## সমাধান — `src/utils/proposalPdfGenerator.ts`

`addAccentStrip` ফাংশনটি সম্পূর্ণ সরিয়ে দেওয়া এবং `addPageFooters` থেকে এর কলটি মুছে ফেলা:

1. **Line 511-525**: `addAccentStrip` ফাংশন মুছে ফেলা
2. **Line 537**: `addAccentStrip(doc);` কল মুছে ফেলা

### ফাইল পরিবর্তন
- `src/utils/proposalPdfGenerator.ts` — `addAccentStrip` ফাংশন ও তার কল রিমুভ

