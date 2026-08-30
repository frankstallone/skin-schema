# 001 — Event-drive Tourmaline

- Status: DONE
- Audit baseline: `84cc53d`
- Severity: High
- Category: Performance
- Estimated scope: one component

## Problem

`src/components/homepage/HomepageTourmaline.astro:274` runs `requestAnimationFrame` continuously, even after the pointer settles. Each frame writes seven inherited properties to the custom-element host, invalidating descendant transform and mask consumers.

## Target

Keep the existing `0.085` easing feel while rendering only in response to unsettled pointer state. Write the plane transform directly and keep only light-position properties on the relief element. Neutral output must remain `56% 32%`, opacity `0.14`, with a neutral perspective transform.

## Repo conventions to follow

- Keep the implementation local to the static Astro component.
- Preserve the existing decoded-image reveal and ambient CSS drift.
- Do not add a React island or generated CSS.

## Steps

1. Cache the plane and relief nodes and remove the seven host-level runtime variables.
2. Render four element-local values: plane `transform`, relief light X/Y, and relief `opacity`.
3. Wake rAF only after a target change and only while visible, document-visible, and motion-safe.
4. Lerp at `0.085`; when both remaining deltas are `<= 0.001`, snap once and sleep.
5. Synchronize IntersectionObserver and page-visibility state; cancel pending work when paused or disconnected.

## Boundaries

- Do not change the artwork, perspective, movement amplitudes, reveal timing, or ambient drift timing.
- Pointer-capability behavior belongs to plan 009.

## Verification

- `npx prettier --check src/components/homepage/HomepageTourmaline.astro`
- `npm run build`
- In a Performance trace, pointer movement wakes frames; settled, offscreen, and hidden states have no recurring component rAF.
- Done when visual output matches the current center/corner states and the loop reliably sleeps.
