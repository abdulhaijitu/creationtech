

## Services মেনু আইটেম থেকে সাবমেনু সরানো

### পরিবর্তন — `src/components/layout/Header.tsx`

**ডেস্কটপ (লাইন 206-257):**
- Services এর `NavigationMenuTrigger` + `NavigationMenuContent` (মেগা মেনু) সম্পূর্ণ সরিয়ে ফেলা হবে
- Products লিংকের মতো একটি সাধারণ `<Link to="/services">` দিয়ে রিপ্লেস করা হবে
- Active state ইন্ডিকেটর বজায় থাকবে

**মোবাইল (লাইন 447-468):**
- "Services" সেকশন হেডার এবং সার্ভিস সাব-আইটেমগুলো সরিয়ে ফেলা হবে
- শুধু একটি সাধারণ "Services" লিংক থাকবে (Products লিংকের মতো)

**অপ্রয়োজনীয় কোড ক্লিনআপ:**
- `servicesMenuItems` ভেরিয়েবল (লাইন 83-89) সরানো হবে
- `dynamicServices` কোয়েরি (লাইন 36-49) সরানো হবে — আর দরকার নেই
- `isDropdownActive` ফাংশনের `servicesMenuItems` রেফারেন্স ক্লিনআপ

শুধু একটি ফাইল পরিবর্তন হবে: `src/components/layout/Header.tsx`

