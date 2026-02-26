## 2024-05-22 - Icon-Only Button Accessibility

**Learning:** The codebase frequently uses icon-only buttons (Refresh, Filter, Social Links) without accessible names. This makes the app unusable for screen reader users in critical areas like sales lists.
**Action:** Always verify `aria-label` is present on `Button` components with `size="icon"` or raw `<button>`/`<a>` tags containing only icons. Use dynamic labels (e.g., including entity name) where possible for better context.

## 2024-05-23 - Custom Modal Accessibility

**Learning:** Custom modals using Framer Motion often miss critical ARIA attributes (`role="dialog"`, `aria-modal`) and focus management on close buttons.
**Action:** When working with custom interactive components, manually verify and add ARIA attributes and visible focus states (matching the system's `ring-2 ring-indigo-500`) to ensure keyboard accessibility.

## 2024-05-24 - Form Accessibility & UX

**Learning:** Forms often lack semantic structure (`<form>`) and label associations (`htmlFor`/`id`), preventing native browser behaviors (submit on Enter) and screen reader support.
**Action:** Wrap inputs in a `<form>`, associate labels with `htmlFor`, and ensure `focus:ring-2` is applied to all interactive inputs to match the design system.

## 2025-02-19 - Modal Exit Animations & Focus Management

**Learning:** Custom modals implemented with `AnimatePresence` fail to animate exit if the conditional render happens outside the `AnimatePresence` boundary (e.g., `if (!prop) return null`).
**Action:** Always wrap the conditional render inside `AnimatePresence` (e.g., `<AnimatePresence>{isOpen && <Modal />}</AnimatePresence>`) and ensure the modal handles `Escape` key and initial focus management (e.g., `autoFocus` on close button).

## 2025-02-20 - Search Input & Empty States

**Learning:** Native `input[type="search"]` elements render a non-customizable clear button in some browsers (Chrome) that conflicts with custom clear buttons. Also, empty states often lack clear guidance.
**Action:** Use `[&::-webkit-search-cancel-button]:hidden` to hide native clear buttons when implementing custom ones. Always provide actionable empty states (icon + message + action) instead of plain text.

## 2026-02-10 - Button Component Consistency
**Learning:** Manual `<a>` tags for icon buttons often miss consistent focus/hover states compared to the `Button` component, leading to a fragmented UI.
**Action:** Replace manual `<a>` implementations with `<Button asChild variant="ghost" size="icon">` to inherit design system interactions (focus rings, hover bgs) while keeping semantic HTML.

## 2026-02-11 - Actionable Empty States
**Learning:** Empty states in search/filter contexts are dead ends for users. Providing a clear "Reset" or "Clear Search" button directly in the empty state message significantly improves recovery time.
**Action:** Always include a primary action button (e.g., "Clear Search", "Reset Filters") in empty state components when filters are active.

## 2026-02-21 - Loading State Standardization
**Learning:** Reusable `Button` components should handle loading states internally to ensure consistency (spinner, disabled state) and reduce boilerplate in consuming components. However, this requires careful handling of icon-only buttons where the spinner might displace the icon or cause layout shifts.
**Action:** Add a `loading` prop to base `Button` components that renders a spinner and disables the button. For icon-only buttons, consider conditionally hiding the original icon when loading to prevent layout issues.

## 2026-02-23 - Search Input Focus Restoration
**Learning:** Custom "clear search" buttons often fail to return focus to the input field, forcing users to manually re-select it to type a new query. This breaks the search flow.
**Action:** Always use `useRef` to programmatically focus the input element (`inputRef.current?.focus()`) immediately after clearing the search value.

## 2026-02-24 - Live Region Feedback
**Learning:** Dynamic content updates (like search results or loading states) often lack screen reader announcements, leaving users unaware of changes.
**Action:** Use `role="status"` and `aria-live="polite"` on containers that dynamically update content (e.g., loading spinners, empty search results) to ensure changes are announced without interrupting the user.
