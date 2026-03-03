

## Quotation Dropdown Scroll Fix

### সমস্যা
`AdminQuotations.tsx` এর dropdown menu তেও অনেকগুলো item থাকতে পারে যেগুলো viewport এর নিচে চলে যায়। Invoice লিস্টে dropdown menu নেই, তাই সেখানে পরিবর্তনের দরকার নেই।

### সমাধান

**`src/pages/admin/AdminQuotations.tsx` (Line 466):**

`DropdownMenuContent` এ Radix available height variable ও scroll যোগ করা:

```tsx
<DropdownMenuContent align="end" className="max-h-[var(--radix-dropdown-menu-content-available-height,400px)] overflow-y-auto">
```

একটি মাত্র লাইন পরিবর্তন।

