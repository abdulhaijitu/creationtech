

## পরিবর্তন

### 1. "Add Item" বাটন ইনলাইন করা
বর্তমানে "Add Item" বাটন Card Header-এ আছে। এটিকে items list-এর নিচে, CardContent-এর ভিতরে একটি dashed border row হিসেবে রাখা হবে — যাতে ইউজার items-এর ঠিক নিচেই নতুন item যোগ করতে পারে।

**ProposalForm.tsx:**
- Line 421-438: CardHeader থেকে "Add Item" বাটন সরানো, শুধু title রাখা
- Line 584-586: Items list-এর পরে একটি inline "Add Item" row যোগ করা — full-width dashed border button স্টাইলে

**QuotationForm.tsx:**
- একই পরিবর্তন — CardHeader থেকে বাটন সরিয়ে items-এর নিচে inline করা

### 2. Description-এর RichTextEditor কমপ্যাক্ট/কোলাপস স্টাইল
Description ফিল্ডে RichTextEditor-এর toolbar বেশি জায়গা নেয়। এটিকে কমপ্যাক্ট করতে:
- `min-h` কমানো: `min-h-[50px]` → `min-h-[36px]`
- Toolbar collapse স্টাইল: editor-এ CSS ক্লাস যোগ করা যাতে toolbar ডিফল্টে hidden থাকে, focus-এ দেখায়

**ProposalForm.tsx (Lines 528-533, 473-478):**
- Desktop ও mobile উভয় layout-এ RichTextEditor-এ collapse class যোগ:
  ```
  className="[&_.ProseMirror]:min-h-[36px] [&_.ProseMirror]:p-2 [&_.ProseMirror]:text-sm [&_.tiptap-toolbar]:hidden [&:focus-within_.tiptap-toolbar]:block"
  ```

**QuotationForm.tsx:** একই পরিবর্তন

### ফাইল পরিবর্তন
- `src/components/admin/ProposalForm.tsx`
- `src/components/admin/QuotationForm.tsx`

