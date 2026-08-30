# 011 — Canonicalize interaction timing

- Status: DONE
- Audit baseline: `84cc53d`
- Severity: Low
- Category: Cohesion and tokens
- Estimated scope: global variables plus affected interaction styles

## Problem

`src/css/global/variables.css:3-6` defines four unused `--transition-*` aliases with 200–500ms timing and mixed easings. Production compact interactions already use `180ms ease-in-out`, so the unused vocabulary drifts from reality.

## Target

Delete the unused aliases and consistently use the existing `180ms ease-in-out` convention for compact interaction feedback touched by this remediation.

## Repo conventions to follow

- Do not invent a compatibility alias or a noncanonical motion-variable namespace.
- Do not expand the design-token generator, which owns color, spacing, and typography—not motion.
- Keep semantic entrance choreography component-local.

## Steps

1. Remove all four root `--transition-*` declarations.
2. Confirm the aliases have no consumers.
3. Use literal `180ms ease-in-out` in authored CSS and `duration-[180ms] ease-in-out` in Tailwind classes for compact interactions changed by plans 003 and 006.
4. Leave deliberate section-reveal and Tourmaline timings unchanged.

## Boundaries

- Do not edit `src/css/generated/*` or design-token JSON.
- Do not normalize long-form animation timing into the interaction convention.

## Verification

- `rg -n -- "--transition-(base|movement|fade|bounce)" src` returns no results.
- `npm run tokens:test`
- `npm run build`
- Done when unused aliases are gone and changed compact controls share the settled production timing.
