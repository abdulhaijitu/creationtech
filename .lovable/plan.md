

## সমস্যা ও সমাধান

### ১. "Add Term" কাজ না করার বাগ
**কারণ:** `formData.terms.split('\n').filter(t => t.trim() !== '')` — এই `.filter()` নতুন যোগ করা খালি string `''` কে সাথে সাথে বাদ দিয়ে দিচ্ছে, তাই নতুন row দেখা যাচ্ছে না।

**সমাধান:** খালি string filter করা বন্ধ করা — শুধু split করা হবে, filter শুধু save/serialize এর সময় হবে।

### ২. প্রতিটি Term-এ মিনিমাল রিচ টেক্সট
প্লেইন `Input` এর বদলে প্রতি term-এ একটি কমপ্যাক্ট `RichTextEditor` বসানো হবে — toolbar ডিফল্টে hidden, focus-এ visible (যেমন Description ফিল্ডে করা হয়েছে)। এতে bold, italic, link ইত্যাদি ব্যবহার করা যাবে।

**ডেটা ফরম্যাট পরিবর্তন:** `\n` split এর বদলে একটি delimiter (যেমন `|||`) ব্যবহার করা হবে, কারণ RichTextEditor এর আউটপুট HTML হওয়ায় `\n` কনফ্লিক্ট করবে।

### ফাইল পরিবর্তন
- **`src/components/admin/ProposalForm.tsx`** (Lines 720-771):
  - `\n` split → `|||` delimiter দিয়ে parse/serialize
  - প্রতি row তে `Input` → compact `RichTextEditor` (collapsed toolbar style)
  - Empty item filter বাগ ফিক্স

