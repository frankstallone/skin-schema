# 008 — Stop responsive hero replay

- Status: DONE
- Audit baseline: `84cc53d`
- Severity: Medium
- Category: Interruptibility
- Estimated scope: one component

## Problem

`src/components/homepage/HomepageHero.astro:423` listens to the 560px copy breakpoint and calls the full synchronization path. Crossing the breakpoint cancels, resets, and replays the 1.35-second entrance.

## Target

Let CSS own the responsive copy swap. Start desktop and mobile copy animations at the same timeline position so either variant can become visible mid-entrance without restarting the storyboard.

## Repo conventions to follow

- Keep the existing `max-width: 560px` CSS behavior in `Homepage.astro`.
- Preserve independent headline stagger within each copy variant.

## Steps

1. Remove the breakpoint MediaQueryList and its change listener/cleanup.
2. Query desktop and mobile headline groups separately and register both at the same start time.
3. Register desktop and mobile body groups at the same support start; animate the shared CTA once.
4. Keep hidden `display: none` variants progressing so a resize reveals the matching current state.
5. Ensure stage 5 forces both variants to their stable end state.

## Boundaries

- Do not change the breakpoint or copy content.
- Preference changes may still stop/reveal or intentionally restart; width changes may not.

## Verification

- Resize repeatedly across 560px at early, middle, late, and completed stages.
- Confirm no kicker/video/headline replay and no raw hidden copy appears.
- Confirm listener cleanup contains no obsolete breakpoint listener.
- Done when viewport width is no longer an animation lifecycle trigger.
