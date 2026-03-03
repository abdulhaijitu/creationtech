

## Accordion Image Fade-In Animation with Framer Motion

### Change
In `src/components/ui/accordion-feature-section.tsx`, wrap the desktop image (line ~68-74) with `AnimatePresence` and `motion.img` using a `key={activeImage}` to trigger a fade-in/out transition on image change.

### Details
- Import `motion, AnimatePresence` from `framer-motion`
- Replace the static `<img>` in the desktop section with:
  ```tsx
  <AnimatePresence mode="wait">
    <motion.img
      key={activeImage}
      src={activeImage}
      alt="Feature illustration"
      className="h-full max-h-[500px] w-full rounded-2xl object-cover"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      loading="lazy"
    />
  </AnimatePresence>
  ```

### File
- `src/components/ui/accordion-feature-section.tsx`

