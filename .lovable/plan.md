

## AdminProposals পেইজ হার্ড পলিশ ও অপটিমাইজেশন

### ফাইল: `src/pages/admin/AdminProposals.tsx`

**১. TanStack Query দিয়ে ডেটা ফেচিং রিফ্যাক্টর (Speed Optimize)**
- `useState` + `useEffect` + manual `fetchProposals` প্যাটার্ন সরিয়ে `useQuery` ব্যবহার করব
- এতে automatic caching, background refetch, এবং stale-while-revalidate সুবিধা পাওয়া যাবে
- `useMutation` দিয়ে `updateStatus` ও `createNewVersion` হ্যান্ডেল করব, যাতে `queryClient.invalidateQueries` দিয়ে অটো-রিফ্রেশ হয়

**২. `useMemo` দিয়ে ফিল্টারিং ক্যাশ করা (Speed Optimize)**
- `filteredProposals` কে `useMemo` এ wrap করব যেন প্রতিটি রি-রেন্ডারে ফিল্টারিং পুনরায় না চলে

**৩. `useCallback` দিয়ে ইভেন্ট হ্যান্ডলার মেমোয়াইজ (Speed Optimize)**
- `formatDate`, `formatCurrency`, `getCompanyInfo` কে কম্পোনেন্টের বাইরে বা `useCallback`/`useMemo` এ নিয়ে আসব

**৪. AdminLoadingSkeleton ও AdminEmptyState ব্যবহার (Shadcn Standard)**
- ইনলাইন `Loading proposals...` টেক্সট সরিয়ে প্রজেক্টের existing `AdminLoadingSkeleton` কম্পোনেন্ট ব্যবহার করব
- `No proposals found.` সরিয়ে `AdminEmptyState` ব্যবহার করব — icon, title, description এবং "New Proposal" action বাটন সহ

**৫. Summary Stats Bar যোগ করা (Design Upgrade)**
- লিস্টের আগে ৪টি সামারি কার্ড: Total, Draft, Sent/Accepted, Total Value
- ছোট, কমপ্যাক্ট কার্ডে কাউন্ট দেখাবে

**৬. Card Layout Polish (Responsive Hard Polish)**
- মোবাইলে (< sm): View বাটন ও DropdownMenu একই রো-তে না রেখে, প্রোপোজাল ইনফো ফুল-উইথ, অ্যাকশন বাটনগুলো নিচে
- ড্রপডাউন মেনু আইটেমে সব আইকন consistent করা (কিছুতে আইকন আছে, কিছুতে নেই)
- `capitalize` ক্লাস Badge এ যোগ করা স্ট্যাটাস টেক্সটে
- কোম্পানি নাম থাকলে ক্লায়েন্ট নামের পাশে দেখানো

**৭. Table View অপশন (Design Upgrade)**
- ডেস্কটপে লিস্ট/টেবিল ভিউ টগল বাটন যোগ করব
- ডেস্কটপে Table কম্পোনেন্ট দিয়ে কলামার ভিউ দেখাবে

### পরিবর্তনের সারাংশ:

| বিষয় | পরিবর্তন |
|---|---|
| Data fetching | `useState/useEffect` → `useQuery/useMutation` |
| Loading state | ইনলাইন টেক্সট → `AdminLoadingSkeleton` |
| Empty state | ইনলাইন টেক্সট → `AdminEmptyState` |
| Filtering | raw → `useMemo` |
| Summary stats | নতুন ৪টি মিনি কার্ড |
| Mobile layout | অ্যাকশন বাটন নিচে, ফুল-উইথ কন্টেন্ট |
| Table view | ডেস্কটপে টেবিল ভিউ অপশন |
| Dropdown icons | সব আইটেমে consistent আইকন |

