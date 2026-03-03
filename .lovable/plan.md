

## Invoice WhatsApp Send — wa.me Link

### পরিবর্তন: `src/pages/admin/AdminInvoices.tsx`

DropdownMenu তে "Send via WhatsApp" অপশন যোগ করা হবে। ক্লিক করলে:

1. ক্লায়েন্টের ফোন নম্বর থেকে `wa.me` URL তৈরি হবে
2. Pre-filled message এ Invoice নম্বর, total amount (BDT), due date এবং কোম্পানির নাম থাকবে
3. নতুন ট্যাবে WhatsApp খুলবে
4. ফোন নম্বর না থাকলে toast warning দেখাবে

### Implementation

- `handleWhatsAppSend(invoice)` ফাংশন তৈরি — ফোন নম্বর sanitize করে (শুধু digits রাখবে, +88 prefix handle করবে), message format করে, `window.open()` দিয়ে `https://wa.me/{phone}?text={encodedMessage}` খুলবে
- DropdownMenu তে "Send" এর পাশে "Send via WhatsApp" আইটেম যোগ (MessageCircle icon সহ)
- ফোন নম্বর ছাড়া warning toast: "Client phone number not available"

### Message Format:
```
Dear {client_name},

Invoice #{invoice_number}
Amount: ৳{total}
Due Date: {due_date}

Thank you for your business.
- {company_name}
```

### পরিবর্তিত ফাইল:
- `src/pages/admin/AdminInvoices.tsx`

