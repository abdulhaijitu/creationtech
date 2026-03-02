

## পরিকল্পনা: Proposal ফর্ম আপডেট

### পরিবর্তনসমূহ

**ফাইল: `src/components/admin/ProposalForm.tsx`**

1. **Client Information সেকশন রিস্ট্রাকচার**:
   - "Client Name" ফিল্ডের লেবেল হবে **"Name (Client or Company)"** — একটি ফিল্ডেই ক্লায়েন্ট বা কোম্পানির নাম নেওয়া হবে
   - "Email" লেবেল হবে **"Email"** (যেমন আছে)
   - "Phone" লেবেল হবে **"Mobile"**
   - **"Company" ফিল্ড সরিয়ে দেওয়া হবে** — কারণ Name ফিল্ডেই Client or Company নাম যাচ্ছে

2. **"Proposal Title" → "Subject"**:
   - লেবেল "Proposal Title *" থেকে **"Subject *"** করা হবে
   - Placeholder আপডেট: "e.g., Website Development Proposal"

3. **বাকি সব ফিল্ড যেমন আছে তেমনই থাকবে** — Scope of Work, Timeline, Deliverables, Pricing Summary, Total Amount, Valid Until, Notes, Terms

### কোনো ডাটাবেজ পরিবর্তন লাগবে না
ডাটাবেজে `title` কলামেই Subject সেভ হবে, `client_name` কলামেই Name (Client or Company) সেভ হবে।

