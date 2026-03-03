

## সমস্যা বিশ্লেষণ

`InvoiceForm.tsx` এ দুটি সমস্যা:

1. **Client details hidden**: Line 147 এ `{formData.client_id && (...)}` — যদি invoice এ `client_id` null থাকে (কিন্তু `client_name` আছে), তাহলে email/phone/address ফিল্ডগুলো দেখায় না।

2. **ClientCombobox fallback নেই**: Combobox শুধু `clients.find(c => c.id === value)` দিয়ে match করে। যদি client_id null হয় বা clients list এ না থাকে, তাহলে placeholder দেখায় — existing client name দেখায় না।

## সমাধান

**File: `src/components/admin/InvoiceForm.tsx`**

1. Line 147: Client details দেখানোর condition পরিবর্তন — `client_id` অথবা `client_name` থাকলেই দেখাবে:
   ```tsx
   {(formData.client_id || formData.client_name) && (
   ```

2. `ClientCombobox` এ একটি নতুন `displayName` prop পাঠানো যাতে client_id ছাড়াও client name দেখাতে পারে।

**File: `src/components/admin/ClientCombobox.tsx`**

3. নতুন optional `displayName` prop যোগ — যখন `selectedClient` পাওয়া যায় না কিন্তু `displayName` আছে, তখন সেটা দেখাবে।

### পরিবর্তিত ফাইল:
- `src/components/admin/InvoiceForm.tsx` (2 লাইন)
- `src/components/admin/ClientCombobox.tsx` (interface + render logic)

