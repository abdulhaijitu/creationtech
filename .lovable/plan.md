

## পরিকল্পনা: Admin Leads পেজে ম্যানুয়াল Lead যোগ করার ফিচার

### কী হবে
AdminPageHeader-এ একটি "+ Add Lead" বাটন যোগ হবে। ক্লিক করলে একটি Dialog ওপেন হবে যেখানে Lead-এর টাইপ (Contact / Quote / Meeting) সিলেক্ট করে ম্যানুয়ালি ডাটা ইনপুট করা যাবে এবং সরাসরি ডাটাবেজে সেভ হবে।

### কারিগরি বিবরণ

**ফাইল: `src/pages/admin/AdminLeads.tsx`**

1. নতুন state যোগ: `isAddOpen`, `addType` (contact/quote/meeting), এবং ফর্ম ফিল্ড state
2. AdminPageHeader-এ `actions` prop হিসেবে `<Button><Plus /> Add Lead</Button>` যোগ
3. নতুন Dialog — টাইপ সিলেক্ট করলে সংশ্লিষ্ট ফর্ম ফিল্ড দেখাবে:
   - **Contact**: full_name, email, phone, subject, message
   - **Quote**: full_name, email, phone, company, service_interest, budget, project_details
   - **Meeting**: full_name, email, phone, company, meeting_topic, preferred_date, preferred_time, additional_notes
4. Submit করলে সংশ্লিষ্ট টেবিলে (`contact_submissions` / `quote_requests` / `meeting_requests`) insert হবে, status ডিফল্ট `'new'`
5. সফল হলে Dialog বন্ধ, toast দেখাবে, এবং `fetchData()` কল করে লিস্ট রিফ্রেশ হবে

### কোনো ডাটাবেজ পরিবর্তন লাগবে না
বিদ্যমান তিনটি টেবিলেই insert হবে — স্কিমা পরিবর্তনের দরকার নেই।

