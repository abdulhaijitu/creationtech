

## Clone Proposal Feature

### পরিবর্তন
**`src/pages/admin/AdminProposals.tsx`:**

1. **`cloneMutation` তৈরি** (Line ~131 এর কাছে, `versionMutation` এর পরে):
   - `versionMutation` এর মতোই কাজ করবে, কিন্তু পার্থক্য:
     - `version: 1` (নতুন proposal হিসেবে, version increment নয়)
     - `title` এ "(Clone)" suffix যোগ হবে
     - Original proposal-এর status পরিবর্তন হবে না (versionMutation এ original কে 'revised' করা হয়)
   - Items কপি করবে `proposal_items` থেকে

2. **Dropdown menu তে Clone অপশন** (Line ~291-294):
   - "Create New Version" এর পরে `<DropdownMenuItem>` যোগ — `Copy` icon সহ "Clone Proposal"
   - `cloneMutation.mutate(proposal)` কল করবে

3. **Import**: `lucide-react` থেকে `Copy` icon import করা

