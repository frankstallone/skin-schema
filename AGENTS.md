# Repository Guidelines

## Project Structure & Module Organization

- Source code in `src/`:
  - `pages/` (routes, e.g., `index.astro`, `thank-you.astro`)
  - `components/` (UI components: `.astro`, `.tsx`)
  - `layouts/` (shared page shells)
  - `css/` and `css-utils/` (global styles, utilities)
  - `design-tokens/` (JSON tokens consumed by generated Tailwind theme CSS)
  - `lib/`, `utils/` (shared helpers)
- Static assets in `public/` and `src/assets/`.
- Build config in `astro.config.mjs`; Tailwind 4 is wired through `@tailwindcss/vite`.

## Build, Test, and Development Commands

- `npm install` — install dependencies.
- `npm run tokens:build` — generate Tailwind theme and custom utility CSS from design tokens.
- `npm run tokens:test` — run token generator unit tests.
- `npm run dev` — generate tokens, then start dev server at `http://localhost:4321`.
- `npm run build` — generate tokens, type/content check via `astro check`, then build to `dist/`.
- `npm run preview` — generate tokens, then serve the production build locally.
- `npm run astro -- --help` — Astro CLI help (e.g., `npm run astro -- add`).

## Coding Style & Naming Conventions

- Use Prettier (see `.prettierrc`; single quotes on). Run your editor’s format-on-save.
- Indentation: 2 spaces; TypeScript (`.ts/.tsx`) preferred over JS.
- Components: PascalCase in `src/components/` (e.g., `PriceCard.tsx`).
- Pages: kebab-case or lowercase in `src/pages/` (e.g., `thank-you.astro`).
- Keep design tokens in `src/design-tokens/` and map via generated Tailwind utilities.
- Avoid inline styles; prefer Tailwind classes and existing CSS utilities.

## Tailwind Token System

- `src/design-tokens/*.json` is the source of truth for colors, spacing, type sizes, leading, font weights, fonts, and breakpoints.
- Do not edit `src/css/generated/*` directly. Generated styling artifacts are written by `npm run tokens:build`.
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

### Tailwind 4 Usage

- Tailwind classes are driven by the generated `@theme` file in `src/css/generated/tailwind-theme.css`.
- Prefer token-backed Tailwind utilities such as `bg-gray-100`, `text-step-3`, `font-mono`, `font-bold`, `gap-s`, and `px-l`.
- Generated custom utilities live in `src/css/generated/tailwind-utilities.css`:
  - `flow-space-*`
  - `region-space-*`
  - `gutter-*`

### Guardrails

- Do not reintroduce `tailwind.config.js`, `@config`, JS theme plugins, or CSS variable compatibility layers.
- Keep the current reset strategy in `src/css/global.css`; do not enable Tailwind Preflight.

## Testing Guidelines

- No dedicated test suite yet. Minimum bar before PR:
  - `npm run tokens:test` completes without errors after token pipeline changes.
  - `npm run build` completes without errors.
  - `npm run preview` and manual check for console/runtime errors.
- Type and content validation is covered by `astro check` (runs in build).

## Commit & Pull Request Guidelines

- Conventional-style prefixes used in history: `feat`, `bug`, `refactor`, `ui`, `content`, `remove`, `upgrade`, `wip`.
  - Example: `feat: add CTA to hero`.
- PRs should include: clear description, rationale, linked issue (if any), and screenshots for UI changes.
- Keep changes scoped; update docs/paths if structure changes. Ensure Node `>= 20.12.2`.

## Security & Configuration Tips

- Do not add secrets; this is a static Astro site.
- Respect `site` in `astro.config.mjs` for canonical URLs and sitemap.
- Place large binaries only in `src/assets/` or `public/`.
