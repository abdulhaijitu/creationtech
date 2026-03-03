

## Remove Products Submenu from Navigation

Replace the Products dropdown (with `NavigationMenuTrigger` + `NavigationMenuContent`) with a simple direct link, matching the pattern used for the "Home" nav item.

### Changes

**File: `src/components/layout/Header.tsx`**
- Lines 207-255: Replace the Products `NavigationMenuItem` block (which uses `NavigationMenuTrigger` + `NavigationMenuContent`) with a simple `<Link to="/products">` — same pattern as `simpleNavItems` rendering (lines 183-205)
- Lines 51-64: Remove the `dynamicProducts` query and `productsItems` mapping since they're no longer needed
- Also check mobile nav section for any Products submenu and simplify it to a direct link

