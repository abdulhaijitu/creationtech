

## Budget Details সেকশন এনহ্যান্সমেন্ট ও Recurring Cost সাপোর্ট

### সমস্যা
বর্তমানে `proposal_items` টেবিলে শুধু fixed/one-time খরচ ট্র্যাক হয়। মাসিক/বাৎসরিক recurring খরচ আলাদা করে দেখানোর কোনো ব্যবস্থা নেই।

### সমাধান

#### ১. Database Migration — `proposal_items` টেবিলে `billing_type` কলাম যোগ
```sql
ALTER TABLE public.proposal_items 
ADD COLUMN billing_type text NOT NULL DEFAULT 'one_time';
-- Values: 'one_time', 'monthly', 'yearly'
```

#### ২. ProposalForm UI পরিবর্তন (`src/components/admin/ProposalForm.tsx`)

**ProposalItem interface আপডেট:**
```typescript
interface ProposalItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  billing_type: 'one_time' | 'monthly' | 'yearly';
}
```

**Budget Details সেকশনে পরিবর্তন:**
- হেডারে নতুন "Type" কলাম যোগ (grid `12 cols` → Description 4, Type 2, Qty 1.5, Price 2, Amount 1.5, Action 1)
- প্রতিটি আইটেমে একটি `Select` dropdown: One-time / Monthly / Yearly
- আইটেমের Amount-এর পাশে ছোট Badge দিয়ে billing type দেখাবে (e.g., `/mo`, `/yr`)

**Budget Summary সেকশনে গ্রুপিং:**
- One-time খরচ আলাদা subtotal
- Monthly খরচ আলাদা subtotal (with `/mo` label)
- Yearly খরচ আলাদা subtotal (with `/yr` label)
- Tax ও Discount শুধু one-time subtotal-এ প্রযোজ্য
- Grand Total-এ one-time total দেখাবে, এবং আলাদা লাইনে recurring costs

**Summary কার্ড উদাহরণ:**
```text
┌─────────────────────────────────┐
│ One-time Cost        ৳50,000   │
│ Monthly Recurring    ৳5,000/mo │
│ Yearly Recurring     ৳20,000/yr│
│ ─────────────────────────────  │
│ Tax (5%)             ৳2,500    │
│ Discount            -৳3,000    │
│ ═════════════════════════════  │
│ Total (One-time)    ৳49,500    │
│ + Monthly           ৳5,000/mo  │
│ + Yearly            ৳20,000/yr │
└─────────────────────────────────┘
```

#### ৩. Save/Load লজিক আপডেট
- `saveMutation`-এ `billing_type` ফিল্ড include করা
- Item fetch-এ `billing_type` ম্যাপ করা
- Default value `'one_time'` — backward compatible

#### ৪. AdminProposals লিস্ট ভিউ
- কোনো পরিবর্তন দরকার নেই — `total_amount` এখনও one-time total হিসেবে থাকবে

### পরিবর্তনের সারাংশ

| বিষয় | পরিবর্তন |
|---|---|
| Database | `billing_type` কলাম যোগ (`one_time`, `monthly`, `yearly`) |
| Budget Items | Type dropdown কলাম, billing badge |
| Budget Summary | গ্রুপ করে one-time, monthly, yearly আলাদা দেখাবে |
| Save/Load | `billing_type` ফিল্ড সেভ ও লোড |

### ফাইল পরিবর্তন
- `supabase/migrations/` — নতুন migration ফাইল
- `src/components/admin/ProposalForm.tsx` — Budget Details ও Summary আপডেট

