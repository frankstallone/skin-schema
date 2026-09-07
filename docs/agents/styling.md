# Styling and design tokens

- `src/design-tokens/*.json` is the source of truth for colors, spacing, type sizes, leading, font weights, fonts, and breakpoints.
- Do not edit `src/css/generated/*` directly. Generated styling artifacts are written by `npm run tokens:build`.
- Generated CSS is committed. Include generated CSS changes only when token JSON or the token generator changed.
- If you change token JSON or `src/css-utils/tailwind-token-generator.js`, run `npm run tokens:test` and `npm run tokens:build`.

### Canonical CSS Variables

- Use canonical token-backed variables only:
  - colors: `--color-*`
  - spacing: `--spacing-*`
  - text sizes: `--text-*`
  - font families: `--font-*`
  - font weights: `--font-weight-*`
  - line heights: `--leading-*`
  - breakpoints: `--breakpoint-*`
- Do not introduce compatibility aliases like `--space-*`, `--size-step-*`, `--gray-*`, or `--font-bold`.

### Color Intents and Modes

- Keep Pine, Bone, and Rose `scale-weight` tokens as stable primitives for palette authoring and fixed artwork.
- Interface colors use Mise en Mode intents generated from `src/design-tokens/colors.json`:
  - `--color-control-{background|foreground|border}-color`
  - `--color-action-{primary|secondary|auxiliary}-{background|foreground|border}-color`
  - `--color-surface-{primary|secondary|auxiliary}-{background|foreground|border}-color`
  - `--color-figure-1st-color` for the first decorative or partitioning color.
- Use `data-mode="light"` or `data-mode="dark"` on a scope. Both modes must assign the complete intent set; nested scopes inherit the nearest mode.
- Do not create `inverse-*`, `accent`, `paper`, `ink`, `text-color`, page-owned color aliases, or component color variants when an intent covers the use.
- Text and icons use the foreground intent paired with their containing surface, action, or control. Typography intents do not own color.
- The auxiliary surface is the page field. Secondary surfaces are raised or temporarily more important. Primary surfaces are highest-focus content or deliberate soft fields.
- Pine 900 and Pine 950 are approved dark surfaces. Pine 999 remains a generated endpoint, not a branded UI surface.

### Tailwind 4 Usage

- Tailwind classes are driven by the generated `@theme` file in `src/css/generated/tailwind-theme.css`.
- Prefer token-backed Tailwind utilities such as `bg-surface-auxiliary-background-color`, `text-surface-auxiliary-foreground-color`, `text-step-3`, `font-mono`, `font-bold`, `gap-s`, and `px-l`.
- Generated custom utilities live in `src/css/generated/tailwind-utilities.css`:
  - `flow-space-*`
  - `region-space-*`
  - `gutter-*`

### Guardrails

- Do not reintroduce `tailwind.config.js`, `@config`, JS theme plugins, or CSS variable compatibility layers.
- Keep the current reset strategy in `src/css/global.css`; do not enable Tailwind Preflight.

