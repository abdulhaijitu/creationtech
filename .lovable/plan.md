

## Invoice PDF আউটপুট — UI/UX Audit ও ফিক্স

### চিহ্নিত সমস্যাগুলো

**ইউজার রিপোর্টেড:**
1. **লোগোর পাশে কোম্পানির নাম টেক্সট** — শুধু লোগো থাকবে, নাম/ট্যাগলাইন সরাতে হবে
2. **হেডারের নিচে সেপারেটর লাইন** — দুটি হরিজন্টাল লাইন (accent + light) সরাতে হবে
3. **"Monthly Recurring" টেক্সট ওভারল্যাপ** — `totalsX = pageWidth - 70` অনেক ছোট, লেবেল ও ভ্যালু ওভারল্যাপ করে

**Audit এ পাওয়া অতিরিক্ত সমস্যা:**
4. **লোগোর aspect ratio ভুল** — হার্ডকোডেড `12x12` (স্কোয়ার), আসল অনুপাত রক্ষা হচ্ছে না। Proposal PDF এ এটা ঠিক আছে
5. **`loadImageAsDataUrl` শুধু string রিটার্ন করে** — width/height রিটার্ন করে না, তাই aspect ratio ক্যালকুলেট করা যাচ্ছে না
6. **হেডারের contact info Y position** — লোগো ছাড়া `infoY=8` থেকে শুরু, লোগো সহ ভিজুয়ালি মিসঅ্যালাইনড
7. **Totals সেকশনে কলাম width অপর্যাপ্ত** — বড় BDT amounts ক্লিপ হতে পারে

### সমাধান পরিকল্পনা

**ফাইল: `src/utils/pdfGenerator.ts`**

#### 1. `loadImageAsDataUrl` আপডেট
Proposal PDF এর মতো `{ dataUrl, width, height }` অবজেক্ট রিটার্ন করবে, `string | null` এর বদলে। সব কলার আপডেট।

#### 2. `addHeader` রিফ্যাক্টর
- **লোগো**: Aspect ratio সংরক্ষণ করে render (height 12mm ফিক্স, width proportional)
- **কোম্পানির নাম ও ট্যাগলাইন সরানো** — শুধু লোগো থাকবে বাম পাশে
- **সেপারেটর লাইন দুটি সরানো** — Proposal PDF এর মতো শুধু gap রাখা
- **Contact info Y position** ঠিক করা — লোগোর সাথে aligned

#### 3. Totals সেকশন ফিক্স
- `totalsX` কে `pageWidth - 85` করা (বা আরো বড়) যাতে "Monthly Recurring:" ও BDT ভ্যালু ওভারল্যাপ না করে
- Label ও value এর মধ্যে যথেষ্ট gap নিশ্চিত করা

#### 4. ছোট UI উন্নতি
- Signature section এ company name bold করা
- Amount in Words লাইনে max-width যোগ করা যাতে লম্বা text wrap হয়

### পরিবর্তিত ফাইল:
- `src/utils/pdfGenerator.ts` — header, image loader, totals section

