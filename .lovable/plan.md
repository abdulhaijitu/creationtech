

## Footer Redesign — Light/Minimal Style (Demo-inspired)

### Overview
Redesign the Footer to match the demo's clean, light-background aesthetic with dot-pattern decorations, while keeping all Creation Tech data, bilingual support, and dynamic business info from the database.

### Design Changes
- **Background**: Switch from dark (`bg-foreground`) to light (`bg-white`) with subtle dot-pattern SVG decorations and gradient blobs
- **Layout**: 4-column grid — Brand+Social, Services, Company, Contact (matching demo structure)
- **Social icons**: Inline row under brand description with circular hover effects (black bg on hover)
- **Link style**: Gray text with black hover, small dot indicator on hover (like demo)
- **Contact section**: Icons inline with text, clean minimal style
- **Bottom bar**: Light gray border, centered copyright
- **Remove newsletter section**: Demo doesn't have it (or keep it — will remove to match demo closely)

### Data Preserved
- All existing `useBusinessInfoMap()`, `getInfo()`, `getSocialLink()` helpers
- Bilingual support (`language === 'en'`)
- All existing link arrays (company, services/products, legal)
- Logo import and dynamic business info

### Files Changed
- `src/components/layout/Footer.tsx` — full redesign with light theme, dot-pattern background, demo-inspired layout

