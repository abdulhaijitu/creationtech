

## Add Portfolio Menu Item After Services

### Change
Add "Portfolio" as a direct navigation link in the desktop nav bar, positioned between the Services dropdown and the Companies dropdown. Also add it to the mobile sidebar menu.

### Files Changed
- `src/components/layout/Header.tsx`
  - **Desktop nav (after Services mega menu, ~line 258)**: Insert a new `NavigationMenuItem` with a direct `Link` to `/portfolio` (same pattern as the Home item), with active state styling
  - **Mobile sidebar (~line 380 area)**: Add a Portfolio link in the mobile nav section, positioned after the Services section

