## 2024-05-22 - Shadcn Button Loading State on Icon Buttons
**Learning:** Standard shadcn/ui Button component breaks layout when `loading={true}` is used with `size="icon"`. The spinner is prepended with margin, causing the square button to expand into a rectangle.
**Action:** In `Button.tsx`, add conditional logic to replace children with the spinner (instead of prepending) when `loading` is true AND `size` is 'icon'. Also add `aria-busy={loading}` for accessibility.

## 2024-05-23 - Input Clear Button Accessibility
**Learning:** Raw icon buttons positioned absolutely inside inputs often suffer from small touch targets and poor keyboard focus visibility, making them hard to use.
**Action:** Wrap such icons in a fixed-size container (e.g., `h-6 w-6 rounded-full`) with `hover:bg` states and explicit `focus-visible:ring` to transform them into accessible, tactile controls without affecting the input layout.
