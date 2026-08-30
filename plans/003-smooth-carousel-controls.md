# 003 — Smooth carousel controls

- Status: DONE
- Audit baseline: `84cc53d`
- Severity: Medium
- Category: Easing and feedback
- Estimated scope: one stylesheet block

## Problem

`src/components/Homepage.astro:545` transitions background, border, and color, while the actual hover rule at line 554 changes `filter` and `transform`. The visible properties snap, and brightness does not implement the documented Warm Bone inversion.

## Target

Use the secondary action intents for the hover/focus inversion and transition exactly `background-color, border-color, color, transform` over `180ms ease-in-out`. Keep the compact `-1px` lift only for motion-safe fine-pointer hover and motion-safe `:focus-visible`.

## Repo conventions to follow

- Use Mise en Mode intent variables, not palette aliases.
- Keep non-motion color feedback available under reduced motion.

## Steps

1. Replace brightness feedback with secondary action background/foreground/border intents.
2. Correct `background` to `background-color` in the transition list.
3. Gate hover translation by hover/fine pointer and no-preference motion.
4. Gate focus-visible translation by no-preference motion.
5. Ensure disabled buttons never invert or lift.

## Boundaries

- Do not alter dimensions, icons, focus outline, or Embla behavior.
- Shared navigation behavior belongs to plan 007.

## Verification

- `npx prettier --check src/components/Homepage.astro`
- Test pointer, keyboard, reduced-motion, and disabled states in preview.
- Done when every changed visual property interpolates and no filter remains on controls.
