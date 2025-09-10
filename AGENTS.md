# Repository Guidelines

## Project Structure & Module Organization

- Source code in `src/`:
  - `pages/` (routes, e.g., `index.astro`, `thank-you.astro`)
  - `components/` (UI components: `.astro`, `.tsx`)
  - `layouts/` (shared page shells)
  - `css/` and `css-utils/` (global styles, utilities)
  - `design-tokens/` (JSON tokens consumed by Tailwind)
  - `lib/`, `utils/` (shared helpers)
- Static assets in `public/` and `src/assets/`.
- Build config in `astro.config.mjs`, Tailwind in `tailwind.config.js`.

## Build, Test, and Development Commands

- `npm install` — install dependencies.
- `npm run dev` — start dev server at `http://localhost:4321`.
- `npm run build` — type/content check via `astro check`, then build to `dist/`.
- `npm run preview` — serve the production build locally.
- `npm run astro -- --help` — Astro CLI help (e.g., `npm run astro -- add`).

## Coding Style & Naming Conventions

- Use Prettier (see `.prettierrc`; single quotes on). Run your editor’s format-on-save.
- Indentation: 2 spaces; TypeScript (`.ts/.tsx`) preferred over JS.
- Components: PascalCase in `src/components/` (e.g., `PriceCard.tsx`).
- Pages: kebab-case or lowercase in `src/pages/` (e.g., `thank-you.astro`).
- Keep design tokens in `src/design-tokens/` and map via Tailwind utilities.
- Avoid inline styles; prefer Tailwind classes and existing CSS utilities.

## Testing Guidelines

- No dedicated test suite yet. Minimum bar before PR:
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
