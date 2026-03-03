

## ProposalForm ডিজাইন এনহ্যান্সমেন্ট ও কম্প্যাক্ট পলিশ

### ফাইল: `src/components/admin/ProposalForm.tsx`

**১. কম্প্যাক্ট সেকশন হেডার**
- CardHeader padding `pb-4` → `pb-3` সব জায়গায়
- CardTitle-এ আইকনের রং `text-primary` করা (সব সেকশনে consistent)
- সেকশন হেডারে হালকা `border-b` separator যোগ

**২. Client Information সেকশন কম্প্যাক্ট করা**
- ৪টি ফিল্ড (Name, Email, Mobile, Select Client) একটি `sm:grid-cols-2 lg:grid-cols-4` গ্রিডে রাখব — ডেস্কটপে এক রো-তে দেখাবে
- Company ফিল্ড বাদ (client_company ইতিমধ্যে client_name দিয়ে কভার হয়) অথবা 5th ফিল্ড হিসেবে রাখা

**৩. Proposal Details সেকশন রি-অর্গানাইজ**
- Subject + Valid Until একই রো-তে (`grid-cols-[1fr_auto]`) — Valid Until ছোট width
- RichTextEditor গুলোতে consistent compact styling
- Timeline ও Key Deliverables পাশাপাশি রাখা (এটা ইতিমধ্যে আছে — শুধু gap কমানো)

**৪. Budget Details টেবিল পলিশ**
- হেডার row-তে `bg-muted/50` ব্যাকগ্রাউন্ড ও `py-2` padding
- আইটেম রো-তে `border` সরিয়ে `divide-y` ব্যবহার — ক্লিনার লুক
- "Add Item" বাটনে `variant="ghost"` + dashed border style

**৫. Budget Summary কার্ড এনহ্যান্স**
- `bg-muted/30` → `bg-primary/5 border-primary/20` — প্রাইমারি টিন্ট
- Total রো-তে `bg-primary/10 rounded-lg p-3` ব্যাকগ্রাউন্ড

**৬. অ্যাকশন বার Sticky করা**
- নিচের Save/Cancel বাটনগুলো `sticky bottom-0 bg-background border-t py-4 z-10` করব
- মোবাইলে full-width বাটন

**৭. Offer Letter End + Notes + Terms কম্প্যাক্ট করা**
- Offer Letter End ও Notes পাশাপাশি (lg:grid-cols-2) রাখব
- Terms & Conditions আলাদা কার্ডে রাখব (যেমন আছে)

### পরিবর্তনের সারাংশ:

| বিষয় | পরিবর্তন |
|---|---|
| Section headers | Compact padding, consistent icon color, separator |
| Client info | 4-col grid on desktop |
| Subject + Date | Same row |
| Budget items | Cleaner divider style, ghost add button |
| Budget summary | Primary-tinted card, highlighted total |
| Action bar | Sticky bottom, full-width on mobile |
| Layout grouping | Offer Letter End + Notes side by side |

