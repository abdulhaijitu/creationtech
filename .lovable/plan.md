

## Proposal Delete অপশন যোগ করা

### সমস্যা
Proposal dropdown menu তে Delete অপশন নেই। ব্যবহারকারী proposal মুছতে পারছেন না।

### সমাধান

**`src/pages/admin/AdminProposals.tsx` ফাইলে পরিবর্তন:**

1. **Import যোগ করা:**
   - `Trash2` icon — lucide-react থেকে
   - `AlertDialog` components — confirmation dialog এর জন্য

2. **Delete mutation তৈরি করা:**
   - `useMutation` দিয়ে proposal ও তার items (proposal_items) ডিলিট করা
   - প্রথমে `proposal_items` ডিলিট, তারপর `proposals` থেকে ডিলিট
   - সফল হলে query cache invalidate ও success toast দেখানো

3. **Confirmation dialog যোগ করা:**
   - `useState` দিয়ে `deleteTarget` state রাখা (কোন proposal ডিলিট হবে)
   - `AlertDialog` component ব্যবহার করে "আপনি কি নিশ্চিত?" confirmation দেখানো
   - Confirm করলে delete mutation call হবে

4. **Dropdown menu তে Delete item যোগ করা:**
   - Clone Proposal এর পরে একটি `DropdownMenuSeparator` ও Delete `DropdownMenuItem` যোগ
   - লাল রঙের text (`text-red-600`) দিয়ে destructive action বোঝানো
   - ক্লিক করলে confirmation dialog ওপেন হবে, সরাসরি ডিলিট হবে না

### Technical Details

```text
Dropdown Menu Structure (updated):
  ... existing items ...
  ─────────────────────
  Clone Proposal
  ─────────────────────
  🗑 Delete Proposal  (red, opens AlertDialog)
```

Delete flow: DropdownMenuItem click → set deleteTarget → AlertDialog opens → Confirm → deleteMutation.mutate() → delete proposal_items → delete proposal → invalidate queries → toast success

