

## পরিবর্তন — Terms & Conditions পয়েন্ট-ভিত্তিক ইনপুট

### বর্তমান অবস্থা
Terms & Conditions সেকশনে একটি RichTextEditor আছে যেখানে ফ্রি-ফর্ম টেক্সট লেখা যায়।

### নতুন ডিজাইন
RichTextEditor সরিয়ে একটি **পয়েন্ট-ভিত্তিক ইনপুট সিস্টেম** তৈরি করা হবে:

- প্রতিটি term একটি আলাদা Input row হিসেবে থাকবে — বামে সিরিয়াল নম্বর, ডানে delete (X) বাটন
- নিচে একটি dashed-border "Add Term" বাটন (Budget Details-এর Add Item-এর মতো inline style)
- `formData.terms` স্ট্রিং হিসেবেই থাকবে — পয়েন্টগুলো `\n` দিয়ে separated হিসেবে parse/serialize করা হবে (backward compatible)
- Drag reorder দরকার নেই, শুধু add/remove/edit

### ফাইল পরিবর্তন
- **`src/components/admin/ProposalForm.tsx`** (Lines 712-728):
  - RichTextEditor সরিয়ে পয়েন্ট list UI বসানো
  - terms string কে `\n` split করে array হিসেবে manage করা
  - প্রতি row: `#{index+1}` badge + Input + Trash2 icon button
  - নিচে dashed "Add Term" button (Plus icon সহ)

