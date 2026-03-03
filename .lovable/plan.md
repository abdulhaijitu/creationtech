

## Leads পেজে Edit ও Delete ফিচার যোগ

### বর্তমান অবস্থা
- **Add**: ইতোমধ্যে আছে (Add Lead ডায়ালগ)
- **Edit**: নেই — Detail ডায়ালগে শুধু View ও Notes সেভ করা যায়
- **Delete**: নেই

### পরিবর্তন

**ফাইল: `src/pages/admin/AdminLeads.tsx`**

1. **Edit ফিচার**:
   - Detail ডায়ালগে "Edit" বাটন যোগ — ক্লিক করলে Edit মোডে যাবে
   - Edit মোডে সব ফিল্ড editable হবে (Add ফর্মের মতো, কিন্তু existing data pre-filled)
   - `isEditing` + `editForm` state যোগ
   - `handleEditSubmit` ফাংশন — সংশ্লিষ্ট টেবিলে update করবে
   - Card-এর DropdownMenu-তে "Edit" অপশন যোগ

2. **Delete ফিচার**:
   - Card-এর DropdownMenu-তে "Delete" অপশন যোগ (destructive স্টাইল)
   - AlertDialog দিয়ে confirmation
   - `handleDelete` ফাংশন — সংশ্লিষ্ট টেবিল থেকে row delete করবে
   - `deleteTarget` state (id + type) ট্র্যাক করার জন্য

3. **UI উন্নতি**:
   - Detail ডায়ালগের header-এ Edit ও Delete বাটন
   - DropdownMenu-তে Edit/Delete আইটেম (Pencil ও Trash2 আইকন সহ)

### কোনো ডাটাবেজ মাইগ্রেশন দরকার নেই
বিদ্যমান RLS policies (`Admin can manage...` with ALL command) ইতোমধ্যে UPDATE ও DELETE সাপোর্ট করে।

