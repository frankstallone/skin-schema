# 004 — Respect reduced motion for video

- Status: DONE
- Audit baseline: `84cc53d`
- Severity: Medium
- Category: Accessibility
- Estimated scope: four components plus one small preference helper if useful

## Problem

Autoplay is server-rendered in `HomepageHero.astro:133`, `HomepageRange.astro:74`, `HomepageRangeCarousel.tsx:297`, and `Hero.astro:11`. Playback can begin before hydration and continues when `prefers-reduced-motion: reduce` is active.

## Target

Remove all authored `autoplay`/`autoPlay` attributes. On the client, play only eligible videos under `no-preference`; pause immediately on `reduce` without resetting `currentTime`. Keep `muted`, `playsinline`, `loop`, and metadata preloading.

## Repo conventions to follow

- Keep DOM-specific eligibility in each component.
- Catch rejected `video.play()` promises.
- Clean listeners on `astro:before-swap`; clean React effects on rerender/unmount.

## Steps

1. Extend the hero's existing media-query synchronization to pause/play its three videos.
2. Add scoped data hooks and small Astro binders for HomepageRange and legacy Hero.
3. In HomepageRangeCarousel, pause non-active videos, pause the active video under reduced motion, and play only the active video under no preference.
4. Use `useSyncExternalStore` or an equivalent hydration-safe subscription for React, with a reduced-motion server snapshot.
5. Preserve time position across preference changes and explicitly pause during cleanup.

## Boundaries

- Do not remove video controls, loop capability, posters, or sources.
- Do not reset playback time or create a global video manager.

## Verification

- `rg -n "autoplay|autoPlay" src/components` returns no authored autoplay attributes.
- Load with reduced motion already enabled: no video starts before or after hydration.
- Toggle the preference live and verify pause/resume behavior; confirm no unhandled play rejection.
- Done when all four component families follow the same preference contract.
