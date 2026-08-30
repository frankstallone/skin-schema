# 006 — Gate hover and focus motion

- Status: DONE
- Audit baseline: `84cc53d`
- Severity: Medium
- Category: Accessibility
- Estimated scope: two page stylesheets

## Problem

Portfolio media at `src/components/Homepage.astro:392` and the thank-you action at `src/pages/thank-you.astro:213` translate on raw hover/focus. This creates sticky touch hover and movement under reduced motion.

## Target

Keep non-motion brightness/color feedback. Apply hover translation only inside `(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)`, and keyboard translation only for `:focus-visible` under `no-preference`.

## Repo conventions to follow

- Preserve the DESIGN-specified portfolio lift of `-0.125rem`.
- Use the compact action lift of `-1px` on thank-you actions.
- Preserve visible focus outlines at every motion preference.

## Steps

1. Split static/non-motion feedback from transform feedback.
2. Move portfolio hover transform and transform transition into the fine-pointer, no-preference query.
3. Add the corresponding no-preference `:focus-visible` transform path where appropriate.
4. Apply the same structure to thank-you actions.
5. Confirm touch and reduced-motion modes never translate.

## Boundaries

- Do not suppress color, brightness, border, or outline feedback.
- Do not change entrance/reveal animations.

## Verification

- Test mouse, touch emulation, keyboard, and reduced-motion combinations.
- `npm run build`
- Done when translations occur only for intentional, motion-safe input paths.
