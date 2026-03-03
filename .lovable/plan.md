

## Add Sister Concern Section After Hero

### What
Create a new `SisterConcernSection` component showing Creation Tech's three sister companies (CHost BD, Productly, Zobayer Shop) with their logos, names, and external links. Place it right after `HeroSection` on the homepage.

### Design
- Clean, minimal section with a subtle background
- Section title: "Our Sister Concerns" (EN) / "আমাদের সিস্টার কনসার্ন" (BN)
- Three logo cards in a row, each linking to the respective website (opens in new tab)
- Cards with border, hover lift effect, and grayscale-to-color logo transition (matching the existing PartnersSection style)
- Responsive: 3 columns on desktop, stacked or 1-per-row on mobile

### Files

1. **Copy uploaded logos to `src/assets/sister-concerns/`**:
   - `user-uploads://image-18.png` → `src/assets/sister-concerns/chost-logo.png`
   - `user-uploads://image-19.png` → `src/assets/sister-concerns/productly-logo.png`
   - `user-uploads://image-20.png` → `src/assets/sister-concerns/zobayershop-logo.png`

2. **Create `src/components/home/SisterConcernSection.tsx`**:
   - Import logos, use `useLanguage` for bilingual title/subtitle
   - Render 3 linked cards with company name, logo, and tagline
   - Use `ScrollReveal` for entrance animation
   - Each card: rounded border, hover scale, grayscale-to-color effect, external link icon

3. **Update `src/pages/Index.tsx`**:
   - Import `SisterConcernSection`
   - Place `<SisterConcernSection />` between `<HeroSection />` and `<PartnersSection />`

