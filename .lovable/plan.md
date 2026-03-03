

## Proposal WhatsApp Send

`src/pages/admin/AdminProposals.tsx` এ পরিবর্তন:

1. **Import**: `MessageCircle` icon যোগ করা (lucide-react থেকে)

2. **`handleWhatsAppSend` ফাংশন**: Invoice/Quotation এর মতোই — client_phone sanitize করে (digits only, `88` prefix ensure), message তৈরি করে `wa.me` link দিয়ে open করবে। ফোন না থাকলে toast warning।

3. **Message format**:
```
Dear {client_name},

Proposal #{proposal_number} - {title}
Amount: ৳{total_amount}

Thank you for your business.
- {company_name}
```

4. **Dropdown menu**: Email to Client এর পরে "Send via WhatsApp" আইটেম যোগ (line ~373 এর পরে), `renderDropdownActions` এর dependency array তে `handleWhatsAppSend` যোগ।

### File changed
- `src/pages/admin/AdminProposals.tsx`

