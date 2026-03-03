

## Make Sister Concern Section Dynamic with Admin Panel

The `sister_concerns` table already exists in the database with proper RLS policies. The component currently uses hardcoded data. Need to:

1. **Update `SisterConcernSection.tsx`** to fetch from `sister_concerns` table using `useQuery`, with fallback to local assets if DB is empty.

2. **Create `src/pages/admin/AdminSisterConcerns.tsx`** — full CRUD admin page:
   - List all sister concerns with name, tagline, logo, active status
   - Add/Edit dialog with fields: name (EN/BN), tagline (EN/BN), website URL, logo upload, display order, active toggle
   - Delete with confirmation
   - Logo upload to `company-assets` storage bucket (already exists)

3. **Update `src/App.tsx`** — add route `/admin/sister-concerns`

4. **Update `src/components/admin/AdminSidebar.tsx`** — add "Sister Concerns" nav item under Content group

### Component Data Flow
- Homepage: `useQuery` → `sister_concerns` table → render cards with `logo_url` from storage
- Admin: CRUD operations with logo upload to `company-assets` bucket

### Seed Existing Data
- Use insert tool to seed the 3 existing companies into the `sister_concerns` table with their logos uploaded to storage

