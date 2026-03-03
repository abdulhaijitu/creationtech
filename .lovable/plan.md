

## Redesign ProductHero with hero-section-9 Pattern

Replace the current single-image hero with a framer-motion animated hero featuring a 3-image collage layout.

### Design

**Left column** (unchanged content, new animations):
- Badge, title, subtitle, CTA buttons, stats — all wrapped in framer-motion `containerVariants` with staggered `itemVariants` (opacity + translateY)

**Right column** (new — replaces single image):
- 3-image creative collage using the 3 product images (`isp-manager.jpg`, `somity-app.jpg`, `restaurant-app.jpg`)
- Large image top-left, medium image top-right (offset down), small image bottom-center
- Decorative gradient circles behind images (primary/accent colors)
- Floating animation on decorative elements via `floatingVariants`
- Each image uses `imageVariants` (scale + opacity entrance)

**Animations**: framer-motion `motion.div` with:
- Container: stagger children 0.2s
- Items: fade-in + translateY 20px → 0
- Images: scale 0.8 → 1 with opacity
- Decorative shapes: infinite y-axis float

### File Change

**`src/components/products/ProductHero.tsx`** — full rewrite:
- Import `motion` from `framer-motion`, product images from assets
- Keep existing content (badge, title, subtitle, CTAs, stats, language support)
- Replace right column single image with 3-image collage + decorative circles
- Keep background grid pattern and gradient orbs
- Remove `hero-animate` CSS classes, use framer-motion instead

No new files needed — the hero-section-9 pattern is adapted directly into ProductHero rather than creating a separate reusable component, since ProductHero has bilingual content and routing-specific logic.

