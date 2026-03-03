

## Invoice Enhancement Plan — Recurring ও One-time Billing Support

### বর্তমান অবস্থা
- Invoice items এ শুধু `description`, `quantity`, `unit_price`, `amount` আছে
- Proposal items এ ইতিমধ্যে `billing_type` (`one_time` / `recurring`) কলাম আছে — Invoice items এ নেই
- Billing period বা recurring frequency ট্র্যাক করার কোনো ফিল্ড নেই

### প্রস্তাবিত পরিবর্তন

#### 1. Database Migration
`invoice_items` টেবিলে নতুন কলাম যোগ:
- **`billing_type`** (`text`, default `'one_time'`) — `one_time` বা `recurring`
- **`billing_period`** (`text`, nullable) — যেমন "March 2026", "Q1 2026"

`invoices` টেবিলে নতুন কলাম:
- **`billing_period_start`** (`date`, nullable) — বিলিং পিরিয়ডের শুরু
- **`billing_period_end`** (`date`, nullable) — বিলিং পিরিয়ডের শেষ
- **`is_recurring`** (`boolean`, default `false`) — রিকারিং ইনভয়েস কিনা

#### 2. InvoiceForm UI পরিবর্তন (`src/components/admin/InvoiceForm.tsx`)
- Invoice Details সেকশনে **Billing Period** (start/end date) ফিল্ড যোগ
- **Is Recurring** toggle/checkbox যোগ
- প্রতিটি Line Item এ **Billing Type** dropdown যোগ (`One-time` / `Monthly Recurring`)
- Recurring item এ **Billing Period** লেবেল ফিল্ড যোগ (যেমন "March 2026")

#### 3. AdminInvoices.tsx পরিবর্তন
- Form data তে নতুন ফিল্ডগুলো যোগ
- Create/Update mutation এ নতুন কলাম handle করা
- Invoice items insert/fetch এ `billing_type` ও `billing_period` অন্তর্ভুক্ত করা
- List view তে Billing Period কলাম দেখানো (যদি থাকে)

#### 4. PDF Generator Update (`src/utils/pdfGenerator.ts`)
- Items table এ **Type** কলাম যোগ (One-time / Monthly)
- Billing period তথ্য PDF header area তে দেখানো
- Summary তে one-time ও recurring আলাদা subtotal দেখানো

### ফলাফল
```text
Invoice Form:
  ┌─ Invoice Details ─────────────────────┐
  │ Issue Date | Due Date | Status        │
  │ ☑ Recurring Invoice                   │
  │ Billing Period: [Start] → [End]       │
  └───────────────────────────────────────┘
  
  ┌─ Line Items ──────────────────────────┐
  │ Type     | Description | Qty | Price  │
  │ Monthly  | Hosting     |  1  | 5000   │
  │ Monthly  | Domain Mgmt |  1  | 1000   │
  │ One-time | Bug Fix     |  3  | 2000   │
  └────────────────────────────────────────┘
  
  ┌─ Summary ─────────────────────────────┐
  │ Recurring Subtotal:     ৳6,000/month  │
  │ One-time Subtotal:      ৳6,000        │
  │ Total:                  ৳12,000       │
  └───────────────────────────────────────┘
```

### Technical Details

**Migration SQL:**
```sql
ALTER TABLE invoice_items ADD COLUMN billing_type text NOT NULL DEFAULT 'one_time';
ALTER TABLE invoice_items ADD COLUMN billing_period text;
ALTER TABLE invoices ADD COLUMN billing_period_start date;
ALTER TABLE invoices ADD COLUMN billing_period_end date;
ALTER TABLE invoices ADD COLUMN is_recurring boolean DEFAULT false;
```

**Files to modify:**
1. Database migration (new columns)
2. `src/components/admin/InvoiceForm.tsx` — UI ফিল্ড যোগ
3. `src/pages/admin/AdminInvoices.tsx` — formData, mutations, list view update
4. `src/utils/pdfGenerator.ts` — PDF এ billing type ও period দেখানো

