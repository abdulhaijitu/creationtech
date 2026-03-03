

## সমস্যা

Dropdown menu তে অনেকগুলো item আছে (12টি) এবং "Create New Version" ও "Clone Proposal" viewport এর নিচে চলে যাচ্ছে — দেখা যাচ্ছে না। Dropdown scroll করে না।

## সমাধান

**`src/pages/admin/AdminProposals.tsx` (Line 313):**

`DropdownMenuContent` এ `className="max-h-[70vh] overflow-y-auto"` যোগ করতে হবে যাতে dropdown scroll করা যায়:

```tsx
<DropdownMenuContent align="end" className="max-h-[70vh] overflow-y-auto">
```

এটাই একমাত্র পরিবর্তন। এতে dropdown দীর্ঘ হলেও scroll করে সব item দেখা যাবে।

