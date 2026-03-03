

## সমস্যা বিশ্লেষণ

### ১. লাইন স্পেস বেশি (Project Overview, Key Deliverables, Expected Outcome)
PDF-এ `renderStyledContent` ফাংশনে প্রতিটি empty paragraph (HTML `<p></p>` ট্যাগ থেকে আসে) `PARAGRAPH_GAP = 3` যোগ করে। RichTextEditor প্রায়ই consecutive empty `<p>` ট্যাগ তৈরি করে, ফলে দ্বিগুণ/তিগুণ gap হয়। এছাড়া `LINE_HEIGHT = 5.5` কিছুটা বেশি।

### ২. Terms & Conditions সুন্দর লাগছে না
Terms সেকশনটি অন্যান্য content সেকশনের মতোই `addSection` দিয়ে রেন্ডার হচ্ছে — বড় ফন্ট, সাধারণ paragraph স্টাইল। Terms এর জন্য ছোট ফন্ট ও কম্প্যাক্ট, numbered/bulleted লেআউট বেশি উপযুক্ত।

---

## পরিবর্তন পরিকল্পনা

### ফাইল: `src/utils/proposalPdfGenerator.ts`

**১. Line spacing কমানো:**
- `LINE_HEIGHT`: `5.5` → `5.0`
- `PARAGRAPH_GAP`: `3` → `2`
- `renderStyledContent`-এ consecutive empty paragraphs collapse করা (2+ empty para = max 1 gap)
- `addSection` return-এ extra gap কমানো: `y + PARAGRAPH_GAP + 1` → `y + PARAGRAPH_GAP`

**২. Terms & Conditions সেকশন আলাদাভাবে রেন্ডার:**
- নতুন `addTermsSection` ফাংশন তৈরি — ছোট ফন্ট (10pt body, 12pt heading), কম line height (4.5), compact padding
- Terms heading-এর নিচে হালকা accent-colored background box বা left-border accent strip
- Line 987 এ `addSection` এর বদলে `addTermsSection` কল করা

```text
┌──────────────────────────────────────┐
│ ▎ Terms & Conditions                │
│ ▎                                    │
│ ▎ 1. Payment must be made...         │  ← 10pt, tighter spacing
│ ▎ 2. Project timeline starts...      │
│ ▎ 3. Any changes to scope...         │
└──────────────────────────────────────┘
```

### সারাংশ

| পরিবর্তন | বিবরণ |
|---|---|
| Line spacing | `LINE_HEIGHT` ও `PARAGRAPH_GAP` কমানো, consecutive empty para collapse |
| Terms section | আলাদা compact রেন্ডারার — ছোট ফন্ট, left accent border, tighter spacing |

### ফাইল পরিবর্তন
- `src/utils/proposalPdfGenerator.ts` — constants, `renderStyledContent`, নতুন `addTermsSection`

