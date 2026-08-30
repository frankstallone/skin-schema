# 010 — Release hero compositing hints

- Status: DONE
- Audit baseline: `84cc53d`
- Severity: Low
- Category: Performance
- Estimated scope: two component stylesheets

## Problem

`src/components/Homepage.astro:138-181` applies persistent `will-change` to hero copy and media, keeping compositing hints after the 1.35-second entrance has completed.

## Target

Apply targeted hints only while stages 0–4 are running under `prefers-reduced-motion: no-preference`. Stage 5 and the static baseline must compute to `will-change: auto`.

## Repo conventions to follow

- Keep lifecycle-owned animation styles with `HomepageHero.astro`.
- Do not hint dormant idle animation that is disabled.

## Steps

1. Remove unconditional hero `will-change` declarations from `Homepage.astro`.
2. Add a running-stage selector for kicker, lines, body, and CTA with opacity/transform/filter hints.
3. Add a running-stage selector for storyboard reveals with opacity/transform/clip-path hints.
4. Exclude video transform hints unless the idle path is enabled in the same change.
5. Confirm reduced motion and stage 5 release every hint.

## Boundaries

- Do not remove `will-change` from unrelated components.
- Do not alter timing or visual properties.

## Verification

- Inspect computed styles during entrance: only targeted running elements are hinted.
- Inspect after 1.5 seconds and under reduced motion: `will-change` is `auto`.
- Done when no hero hint persists beyond the running lifecycle.
