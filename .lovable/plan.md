

## Hero Section Redesign — Interactive Image Accordion

### Overview
Replace the right side of the hero section with an interactive image accordion component (hover-to-expand panels). Left side keeps existing branding (badge, rotating words, CTAs, trust badges). Right side accordion items will showcase Creation Tech's core services.

### Accordion Items (Creation Tech themed)
1. **Custom Software** — AI-generated image of custom software development
2. **AI Solutions** — AI/ML visual
3. **Mobile Apps** — Mobile app development visual
4. **Cloud & DevOps** — Cloud infrastructure visual
5. **UI/UX Design** — Product design visual

### Plan

**1. Create `src/components/ui/interactive-image-accordion.tsx`**
- Adapted from the user-provided component
- TypeScript-friendly with proper types
- Tailwind classes matching Creation Tech's dark hero theme (teal accents, navy background)
- Smooth CSS transitions for expand/collapse
- Items display vertically-cropped images with title overlay at bottom
- Active item expands to ~4x width of collapsed items

**2. Update `src/components/home/HeroSection.tsx`**
- Keep left side: badge, rotating headline, subheadline, CTAs, trust badges — unchanged
- Replace right side (desktop): remove the image/stat card collage, replace with the interactive image accordion
- Remove unused imports (heroOffice1/2/3, Brain, Cpu, Package, Award, CountUp for right side)
- Keep mobile stats grid as-is (accordion is desktop-only, like current right side)
- Use Unsplash images initially (can be replaced with AI-generated later or via admin)

### Files Changed
- `src/components/ui/interactive-image-accordion.tsx` — **new file**
- `src/components/home/HeroSection.tsx` — replace right-side content

