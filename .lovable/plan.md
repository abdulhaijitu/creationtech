

## /services পেইজ অডিট ও ফিক্স

### চিহ্নিত সমস্যা

1. **টাইপ সেফটি ভাঙা** — `(service as any).short_description_en`, `(service as any).cta_text_en` ইত্যাদি ব্যবহার করা হচ্ছে, কিন্তু এই ফিল্ডগুলো Supabase types-এ সঠিকভাবে আছে। `as any` সরাতে হবে।

2. **Services Grid-এ `id` অ্যাট্রিবিউট মিসিং** — "Explore Services" বাটন `#services-grid` এ স্ক্রল করে কিন্তু সেকশনে `id="services-grid"` নেই।

3. **কার্ড হাইট অসমান** — `CardContent` এ `h-full` + `flex flex-col` নেই, তাই ফিচার লিস্ট বিভিন্ন দৈর্ঘ্যের হলে কার্ডের CTA বাটন ভিন্ন পজিশনে থাকে।

4. **ডেসক্রিপশন খুব ছোট** — `text-sm` ব্যবহার হচ্ছে, `text-base` হওয়া উচিত পাঠযোগ্যতার জন্য।

5. **Portfolio ও Why Choose Us ব্যাকগ্রাউন্ড একই** — দুটোতেই `bg-muted/30`, ভিজুয়াল সেপারেশন নেই।

### সমাধান — `src/pages/Services.tsx`

1. **`as any` সরানো** — সরাসরি `service.short_description_en`, `service.cta_text_en`, `service.cta_link`, `service.is_featured` ব্যবহার করা (types-এ আছে)।

2. **`id="services-grid"` যোগ** — Services Grid সেকশনে, যাতে "Explore Services" অ্যাংকর লিংক কাজ করে।

3. **কার্ড লেআউট ফিক্স** — `CardContent` এ `flex flex-col h-full` এবং CTA লিংকে `mt-auto` যোগ করে সব কার্ডে CTA একই লেভেলে রাখা।

4. **ডেসক্রিপশন সাইজ** — `text-sm` → `text-base` করা।

5. **সেকশন ব্যাকগ্রাউন্ড** — Portfolio সেকশন `bg-muted/30` রেখে Why Choose Us থেকে `bg-muted/30` সরানো (বা উল্টো), যাতে ভিজুয়াল কনট্রাস্ট হয়।

শুধু একটি ফাইল পরিবর্তন: `src/pages/Services.tsx`

