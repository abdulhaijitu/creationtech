

## Sidebar Pages Audit & Fix

### Audit Findings

**Sidebar-linked pages (all have matching routes - OK):**
- `/admin` → AdminDashboard
- `/admin/leads` → AdminLeads (has internal tabs: contacts, quotes, meetings)
- `/admin/clients` → AdminClients, `/admin/clients/:id` → AdminClientProfile
- `/admin/invoices` → AdminInvoices
- `/admin/payments` → AdminPayments
- `/admin/quotations` → AdminQuotations
- `/admin/proposals` → AdminProposals
- `/admin/products` → AdminProducts, `/admin/products/:slug` → AdminProductDetail
- `/admin/services` → AdminServices
- `/admin/portfolio` → AdminPortfolio
- `/admin/testimonials` → AdminTestimonials
- `/admin/settings` → AdminSettings
- `/admin/settings/system` → AdminSystemPreferences
- `/admin/settings/payment` → AdminPaymentGateway
- `/admin/settings/sms` → AdminSMSSettings
- `/admin/users` → AdminUsers
- `/admin/roles` → AdminRoles
- `/admin/careers` → AdminCareers

**Issues found:**

1. **Redundant pages**: `AdminQuotes.tsx` and `AdminMeetings.tsx` are separate pages with routes (`/admin/leads/quotes`, `/admin/leads/meetings`) but AdminLeads already has tabs for quotes and meetings built-in. These are unused from sidebar.

2. **Dashboard links broken**: Dashboard stat cards link to `/admin/leads/contacts`, `/admin/leads/quotes`, `/admin/leads/meetings` -- these either go to the redundant separate pages or a non-existent route (`/admin/leads/contacts`). Should all point to `/admin/leads` instead.

3. **`isActive` bug**: The sidebar `isActive` function uses `startsWith`, so clicking `/admin/settings/system` also highlights the "Settings" footer link since it matches `/admin/settings`. Minor but worth noting.

### Plan

1. **Delete redundant files**: Remove `AdminQuotes.tsx` and `AdminMeetings.tsx`

2. **Clean App.tsx routes**: Remove the two routes for `/admin/leads/quotes` and `/admin/leads/meetings`, and remove their imports

3. **Fix Dashboard links**: Change stat card `href` values:
   - `/admin/leads/contacts` → `/admin/leads`
   - `/admin/leads/quotes` → `/admin/leads`
   - `/admin/leads/meetings` → `/admin/leads`

4. **Fix sidebar `isActive` for settings**: Make settings sub-routes not falsely highlight the footer Settings link by checking exact match or using a more specific condition

### Files Changed
- `src/App.tsx` — remove 2 routes + 2 imports
- `src/pages/admin/AdminDashboard.tsx` — fix 3 href values
- Delete `src/pages/admin/AdminQuotes.tsx`
- Delete `src/pages/admin/AdminMeetings.tsx`

