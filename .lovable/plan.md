

## পরিকল্পনা: Portfolio Edit Project-কে Product Edit Page-এর মতো করা

### সমস্যা
বর্তমানে Portfolio-র Edit/Add Project একটি Dialog modal-এ আছে, যেখানে Product edit একটি full-page layout ব্যবহার করে (Cards দিয়ে সাজানো)। দুটো ভিন্ন প্যাটার্ন — ইউজার চাচ্ছেন একই ধরনের অভিজ্ঞতা।

### সমাধান
Portfolio-র Add/Edit Project-কে Dialog modal থেকে বের করে AdminProductDetail-এর মতো **full-page card-based layout**-এ রূপান্তর করা হবে।

### পরিবর্তন — `src/pages/admin/AdminPortfolio.tsx`

1. **Dialog modal সরানো** — `Dialog`, `DialogContent` ইত্যাদি সরিয়ে ফেলা হবে
2. **View mode যোগ** — `list` | `create` | `edit` state ব্যবহার করে full-page form দেখানো হবে (Products-এর মতো)
3. **Card-based form layout** — AdminProductDetail-এর প্যাটার্ন অনুসরণ:
   - **Card 1: Basic Information** — Title (EN/BN), Slug, Category, Active/Featured toggle (CardTitle-এ)
   - **Card 2: Client & Description** — Client (EN/BN), Description (EN/BN)
   - **Card 3: Tags & Results** — Tags, Result (EN/BN)
   - **Card 4: Project Image** — ProductImageUpload component
4. **Back button** — "← Back to Portfolio" (ArrowLeft icon)
5. **Save button** — পৃষ্ঠার নিচে ডানদিকে (Products-এর মতো)
6. **Delete dialog** — AlertDialog যেমন আছে তেমনই থাকবে

### কোড কাঠামো
```text
viewMode === 'list'  →  Project list + "Add Project" button
viewMode === 'create' →  Full page form (empty)
viewMode === 'edit'   →  Full page form (prefilled)
```

### পরিবর্তিত ফাইল
- **`src/pages/admin/AdminPortfolio.tsx`** — modal → full-page card layout

