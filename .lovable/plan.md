

## Proposal System Audit ও Enhancement Plan

### সমস্যা চিহ্নিত

1. **Console Warning**: `RichTextEditor` কে ref দেওয়া হচ্ছে কিন্তু `forwardRef` নেই
2. **Proposal Interface mismatch**: `AdminProposals.tsx`-এ `Proposal` interface-এ `offer_letter`, `expected_outcome`, `offer_letter_end`, `subtotal`, `tax_rate`, `tax_amount`, `discount_amount` ফিল্ড নেই — `(proposal as any)` cast ব্যবহার হচ্ছে ProposalForm-এ
3. **Unused Dialog import** in AdminProposals.tsx
4. **Email ও Approval অপশন নেই**

---

### পরিবর্তনসমূহ

#### 1. `src/components/ui/rich-text-editor.tsx` — forwardRef fix
- Component-কে `React.forwardRef` দিয়ে wrap করা (console warning fix)

#### 2. `src/pages/admin/AdminProposals.tsx` — Interface ও Design Enhancement
- **Proposal interface আপডেট**: সকল missing ফিল্ড যোগ (`offer_letter`, `expected_outcome`, `offer_letter_end`, `subtotal`, `tax_rate`, `tax_amount`, `discount_amount`)
- **Unused Dialog import সরানো**
- **List view enhance**: কার্ডে status badge, amount, version আরও compact ও clean
- **Email to Client অপশন**: Dropdown menu-তে "Email to Client" অপশন — ক্লিক করলে `mailto:` link open (client_email থাকলে) অথবা toast warning
- **Approval অপশন**: Dropdown menu-তে "Mark as Approved" স্ট্যাটাস অপশন যোগ; `STATUS_MAP`-এ `approved` আগেই `success` হিসেবে আছে

#### 3. `src/components/admin/ProposalForm.tsx` — Audit ও Enhancement
- **`(proposal as any)` cast সরানো**: ProposalFormProps-এর Proposal interface আপডেট করে সব ফিল্ড properly type করা
- **Design enhance**: Card headers compact, consistent spacing
- **Budget Items description-এ RichTextEditor check**: ঠিক আছে, টেবিল ও জাস্টিফাই সাপোর্ট শেয়ার্ড কম্পোনেন্ট থেকে আসছে

#### 4. `src/lib/status-colors.ts` — "revised" স্ট্যাটাস mapping
- `revised` কে `warning` বা `info` variant-এ যোগ (বর্তমানে নেই, তাই neutral fallback হচ্ছে)

### Technical Details

```text
Files to modify:
├── src/components/ui/rich-text-editor.tsx     (forwardRef wrap)
├── src/pages/admin/AdminProposals.tsx          (interface fix, email/approve options, cleanup)
├── src/components/admin/ProposalForm.tsx       (remove `as any` casts, interface fix)
└── src/lib/status-colors.ts                   (add 'revised' status)
```

**Email to Client**: `mailto:` link with pre-filled subject (`Proposal: {proposal_number} - {title}`). No edge function needed — simple browser mailto.

**Approval flow**: Status update to `approved` via existing `updateStatus` function. Badge color via existing `getStatusColor`.

