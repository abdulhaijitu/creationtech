

## Make Products Dropdown Dynamic in Header Navigation

### Current State
- **Services**: Already dynamic in the header -- fetches from `services` table via `nav-services` query (line 36-49). Homepage and /services page also dynamic.
- **Products**: Header dropdown is **hardcoded** (lines 66-71) with 3 fixed products. Homepage ProductsSection and /products page already fetch dynamically from `products` table.
- **Portfolio**: Just a direct link in header (no dropdown needed). Homepage and /portfolio page already fetch dynamically from `portfolio_projects` table.

So the only thing that needs to change is the **Products dropdown in the Header** -- it currently lists hardcoded items instead of fetching from the backend.

### Plan

**File: `src/components/layout/Header.tsx`**

1. Add a new query to fetch active products (similar to the existing `nav-services` query):
```ts
const { data: dynamicProducts } = useQuery({
  queryKey: ['nav-products'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('id, slug, name_en, name_bn, short_description_en, short_description_bn')
      .eq('status', 'active')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data;
  },
  staleTime: 5 * 60 * 1000,
});
```

2. Replace the hardcoded `productsItems` array (lines 66-71) with a dynamically built array from `dynamicProducts`, plus a "View All Products" link at the end.

3. Update both the desktop dropdown (lines 188-204) and mobile Products section (lines 402-415) to use the dynamic items with bilingual support.

