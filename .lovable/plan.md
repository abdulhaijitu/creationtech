

## Admin Portfolio Page Audit & Fix

### Issues Found

**1. Missing `DialogDescription`** — Accessibility warning from Radix UI. The create/edit dialog has no `DialogDescription`.

**2. No image upload component** — Currently uses a plain text `Image URL` input. Other admin pages (Products) use `ProductGalleryUpload` with Supabase Storage. Portfolio should use a similar image upload approach.

**3. Status badge uses non-standard color classes** — `bg-success-muted`, `bg-neutral-muted` etc. may not exist in the theme. Should use standard Tailwind/theme classes.

**4. Console warning** — `DialogFooter` ref warning. The `DialogFooter` is placed at incorrect indentation level (outside the inner content wrapper). Needs structural fix.

**5. No toggle for active/inactive from list view** — Users must open the edit dialog just to toggle visibility. A quick toggle would improve UX.

### Fix Plan

**1. `AdminPortfolio.tsx` — Dialog fixes**
- Add `DialogDescription` after `DialogTitle`: `"Fill in the project details below"`
- Fix DialogFooter indentation/structure — ensure it's properly nested inside the dialog content div
- Replace plain `Image URL` text input with `ProductImageUpload` component (reuse existing) for proper file upload
- Add active/inactive quick-toggle button on list cards
- Fix status badge classes to use standard badge component or proper Tailwind classes

### File Changes
- `src/pages/admin/AdminPortfolio.tsx`

