

## Plan: Redesign Admin Sidebar with Framer Motion Hover-Expand Pattern

### Overview
Replace the current shadcn sidebar-based admin sidebar with a framer-motion animated sidebar that collapses by default and expands on hover, matching the provided design reference.

### Technical Details

**New dependency required:** `framer-motion`

**Files to modify:**
1. **`src/components/admin/AdminSidebar.tsx`** — Complete rewrite using framer-motion `motion.div` with hover-to-expand behavior:
   - Default state: collapsed (~3rem wide, icons only)
   - On mouse enter: smoothly animate to ~15rem, show labels
   - Keep all existing `navGroups` data and route-active logic
   - Replace `next/link` → `react-router-dom Link`, `usePathname` → `useLocation`
   - Organization header with "CT" avatar + "Creation Tech" text
   - Flat nav items (no collapsible groups — items shown directly with group labels as separators)
   - Footer with user avatar dropdown (sign out, profile) using existing `useAuth`
   - `ScrollArea` for scrollable nav content

2. **`src/components/admin/AdminLayout.tsx`** — Simplify layout:
   - Remove `SidebarProvider`, `SidebarInset`, `SidebarTrigger` wrappers
   - Use simple flex layout: sidebar (fixed/sticky) + main content area
   - Keep top header bar with "View Site" button but remove sidebar trigger (hover replaces it)
   - Remove `TooltipProvider` wrapper (no longer needed for sidebar)

3. **No changes to `src/components/ui/sidebar.tsx`** — The existing shadcn sidebar component stays untouched (other pages may use it). The admin sidebar will be a standalone framer-motion component.

### Animation Config
```text
Collapsed: width 3.05rem, icons centered, text hidden (opacity 0)
Expanded:  width 15rem, icons + labels visible (opacity 1)
Transition: tween, easeOut, 0.2s duration
Items stagger: 0.03s delay between children
```

### Mobile Handling
- On mobile, sidebar starts collapsed and still expands on touch/hover
- Alternatively, use a sheet/drawer for mobile (preserving existing mobile UX)

