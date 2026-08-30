# 002 — Accelerate the hero entrance

- Status: DONE
- Audit baseline: `84cc53d`
- Severity: High
- Category: Performance
- Estimated scope: one component

## Problem

`src/components/homepage/HomepageHero.astro:324` animates Motion `y` and `scale` shorthands across text and video groups. Those shorthands are composed on Motion's main-thread render loop, and the headline/support blur reaches the audit ceiling of `20px`.

## Target

Preserve the storyboard and spring feel while using full accelerated `transform` strings. Use `translate3d(...)` for text and `translate3d(...) scale(...)` for video; cap blur at `16px`.

## Repo conventions to follow

- Keep timing constants and choreography colocated with `HomepageHero.astro`.
- Preserve the current final positions, stagger order, clip-path reveal, and stage contract.

## Steps

1. Replace kicker `y: 14` with `translate3d(0, 14px, 0)` keyframes.
2. Replace headline `y: 58`, support `y: 22`, and video `y: 52`/`scale: 0.94` with full transform keyframes.
3. Combine every dormant idle translation/scale state into one transform string or remove the dormant path if it is provably dead.
4. Reduce headline and support blur keyframes from `20px` to `16px`.
5. Confirm cleanup removes inline transform/filter values.

## Boundaries

- Do not redesign the entrance or change its total narrative order.
- Progressive-enhancement staging is handled with plan 005.

## Verification

- `npx prettier --check src/components/homepage/HomepageHero.astro`
- `npm run build`
- Record a load: transform keyframes use `translate3d`/`scale`, blur never exceeds `16px`, and the finish matches the static layout.
- Done when no Motion `y` or `scale` shorthand remains in the entrance.
