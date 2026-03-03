

## সমস্যা

`renderDropdownActions` এর `useCallback` dependency array তে `cloneMutation` নেই (line 353)। এটি Clone button দেখানো আটকাবে না, তবে ক্লিক করলে কাজ নাও করতে পারে।

তবে আসল সমস্যা হতে পারে — dropdown menu scroll করলে Clone অপশন দেখা যাচ্ছে না কারণ এটি অনেক নিচে। অথবা UI তে সত্যিই রেন্ডার হচ্ছে না।

## সমাধান

**`src/pages/admin/AdminProposals.tsx` (Line 353):**
- `useCallback` dependency array তে `cloneMutation` যোগ করা:
  ```
  [statusMutation, versionMutation, cloneMutation, handlePdfAction]
  ```

এটাই একমাত্র পরিবর্তন। কোডে Clone MenuItem ঠিকভাবে আছে (line 349-351)। Dependency fix করলে সমস্যা সমাধান হওয়া উচিত।

