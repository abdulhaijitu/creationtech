

## Services Section Redesign — Accordion Feature Block

### Overview
Replace the current custom accordion+illustration layout with the `Feature197` accordion-feature-section pattern: left side has a shadcn `Accordion` with service titles/descriptions, right side shows the corresponding image that updates on accordion item change. Data remains dynamic from the database with bilingual support.

### Plan

**1. Create `src/components/ui/accordion-feature-section.tsx`**
- Adapted from the provided `Feature197` component
- Remove `"use client"` directive (not needed in Vite/React)
- Two-column layout: left accordion, right image
- Accept `features` prop with `id`, `title`, `image`, `description`
- Uses existing `Accordion` from `@/components/ui/accordion`
- Active item controls the displayed image on the right
- Mobile: image shown inline below each accordion item's description (as in the original component)

**2. Update `src/components/home/ServicesSection.tsx`**
- Import and use `Feature197` (or renamed `AccordionFeatureSection`)
- Map database services to the `features` format:
  - `title` → bilingual `title_en/bn`
  - `description` → bilingual `short_description_en/bn` or `description_en/bn`
  - `image` → `featured_image_url` or fallback illustrations
- Keep section header ("Our Services" / "আমাদের সেবাসমূহ") above the component
- Keep loading skeleton and empty state logic
- Remove old custom accordion markup, Sparkles icon, manual expand/collapse logic

### Files Changed
- `src/components/ui/accordion-feature-section.tsx` — **new file**
- `src/components/home/ServicesSection.tsx` — refactored to use new component

