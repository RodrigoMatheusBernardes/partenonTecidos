# 🎨 Design Rules & Brand Manual

These guidelines ensure that all future frontend implementations maintain the luxury, premium, and sophisticated aesthetic of **Parthenon Tecidos**.

---

## 🏛️ Brand Concept & Personality

### Brand Identity
- **Concept:** Classical Greek Architecture (symmetry, proportion, structure) + Scandinavian Minimalism (clean layouts, space, utility).
- **Tone of Voice:** Deliberate, sophisticated, educative, understated luxury.
- **Competitors as Benchmarks:** Loro Piana, Hermès, Brunello Cucinelli.

### Emotional Appeal
- **First Impression:** "This is different. This is extremely high quality."
- **Navigation:** Understated and elegant. Space is luxury. Never crowd elements or spam promotional banners.

---

## 🎨 Color Palette & Shadows

All layouts must strictly adhere to the Tailwind configuration classes:

- **Primary Colors:** Sophisticated Darks (`bg-[#0B0C10]`, `text-[#EAEAEB]`)
- **Accent Colors:** Warm Gold/Ouro (`text-[#C5A880]`, `hover:text-[#D4BC9B]`, `border-[#C5A880]`)
- **Backgrounds:** Luxury clean whites/creams or absolute darks depending on the theme.
- **Shadows:** Standard luxury shadows (`shadow-sm-luxury` to `shadow-xl-luxury`). Never use harsh, default Tailwind shadows.
- **Hover Transitions:** Soft transition speeds (`transition-all duration-300 ease-in-out` or `transition-all duration-500 ease-in-out`).

---

## ✍️ Typography & Spacing

### Typography
- **Headings:** High-contrast, elegant Serif fonts or clean, spaced uppercase sans-serif headings.
- **Body Text:** Highly readable, responsive sans-serif font family.
- **Sizing:** Always use fluid/clamp typography rules where headers scale gracefully on small devices.

### Spacing
- Use a 4px/8px incremental grid.
- Proportions are key: Spacing should feel deliberate. Sections should have comfortable padding (e.g., `py-12 md:py-20`).

---

## 🧱 Component Rules & Guidelines

1. **Buttons (`components/ui/Button.tsx`):**
   - Must use specified design system variants (`primary`, `secondary`, `tertiary`, `danger`, `ghost`).
   - Sizing should scale gracefully (`sm`, `md`, `lg`).
   - Smooth hover transition is mandatory.

2. **Product Cards (`components/ui/ProductCard.tsx`):**
   - High aspect ratio for images (e.g., `aspect-square` or `aspect-[4/5]`).
   - Clean, borderless cards with shadow effects on hover.
   - Elegant price highlights using the premium gold tone (`#C5A880`).
   - Interactive favoriting button positioned cleanly in top-right with hover visibility.

3. **Shimmer Skeletons:**
   - Any loading state must use the custom shimmer skeleton component (`components/ui/Skeleton.tsx`) instead of static loaders.
