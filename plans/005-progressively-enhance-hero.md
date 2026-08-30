# 005 — Progressively enhance the hero

- Status: DONE
- Audit baseline: `84cc53d`
- Severity: Medium
- Category: Purpose and resilience
- Estimated scope: one component

## Problem

`src/components/homepage/HomepageHero.astro:64` ships `data-animation-stage="0"`, so the server baseline is hidden whenever JavaScript is enabled but the Motion module fails. The `<noscript>` fallback cannot cover that failure mode.

## Target

Ship a fully visible hero. Opt into stage 0 only after the module evaluates and is ready to register animation. Any synchronous setup failure must clean up and reveal stage 5.

## Repo conventions to follow

- Prefer static Astro markup as the resilient baseline.
- Keep stage CSS as the enhancement contract and Astro swap cleanup as the lifecycle boundary.

## Steps

1. Remove `data-animation-stage` from server markup.
2. Enter stage 0 synchronously inside successful animation startup, immediately before registrations.
3. Wrap startup so a setup/animation exception stops controls, resets inline styles, and enters stage 5.
4. Keep reduced-motion startup fully visible without entering a running stage.
5. Remove redundant fallback CSS only if the visible baseline remains explicit and testable.

## Boundaries

- Do not add an inline pre-hide script; that would recreate fail-closed behavior.
- Do not change copy, media, or final layout.

## Verification

- Disable JavaScript and separately block the Motion chunk: all hero content remains visible.
- Hard reload normally: no persistent flash, hidden state, or console exception.
- Toggle reduced motion during entrance: all content becomes visible.
- Done when animation is an enhancement rather than a prerequisite for legibility.
