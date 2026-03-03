

## টপবার সবসময় দৃশ্যমান রাখা

### পরিবর্তন

**`src/components/layout/Header.tsx`**:
- `isTopbarVisible` state এবং scroll handler থেকে topbar hide/show লজিক সরিয়ে দেওয়া
- Topbar-এ সবসময় `isVisible={true}` পাঠানো

**`src/components/layout/Topbar.tsx`**:
- `isVisible` prop এবং transform/opacity transition লজিক সরিয়ে সরাসরি দেখানো
- `overflow-hidden` wrapper সরিয়ে ফেলা

এতে টপবার মেনুবারের মতোই সবসময় sticky থাকবে।

