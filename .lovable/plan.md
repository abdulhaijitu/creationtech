

## Sidebar Simplification

### Current → New Structure

Remove all items not in the user's list. New `navGroups`:

```text
Dashboard
  - Overview          /admin

Sales & Clients
  - Leads             /admin/leads
  - Clients           /admin/clients
  - Invoices          /admin/invoices
  - Payments          /admin/payments
  - Quotations        /admin/quotations
  - Proposals         /admin/proposals

Products & Services
  - Products          /admin/products
  - Services          /admin/services

Content
  - Portfolio         /admin/portfolio
  - Testimonials      /admin/testimonials

Settings
  - General           /admin/settings
  - Preferences       /admin/settings/system
  - Payment Gateway   /admin/settings/payment
  - SMS Settings      /admin/settings/sms

Team
  - User Management   /admin/users
  - Roles & Permissions /admin/roles
  - Careers           /admin/careers
```

### Removed Items
Blog, Employees, Attendance, Internal Notes, ISP/Somity/Restaurant sub-products, all Frontend Control (CMS pages), Tasks, Notifications, Activity Logs, System Preferences (merged into Settings as "Preferences")

### File Changed
- `src/components/admin/AdminSidebar.tsx` — replace `navGroups` array, remove unused icon imports

