# Repository Guidelines

## Context by task

- Before domain exploration or naming concepts, read [domain guidance](docs/agents/domain.md).
- For issues or PRDs, read [issue tracker conventions](docs/agents/issue-tracker.md).
- When assigning triage labels, read [triage labels](docs/agents/triage-labels.md).
- Before changing UI, CSS, or design tokens, read [styling and design tokens](docs/agents/styling.md) for canonical variables, Mise en Mode intents, palette rules, and reset constraints.
- When updating bundled Impeccable skills, read [client variants](docs/agents/impeccable.md).

## Implementation constraints

- Prefer `.astro` components for static UI; use React islands only for required interactivity and choose hydration directives deliberately.
- Prefer token-backed Tailwind classes and existing CSS utilities. Inline styles are allowed for existing CUBE layout custom properties and vendor embed markup.
- `src/design-tokens/*.json` owns tokens. Never edit `src/css/generated/*` directly. Generated CSS is committed only with changes to token JSON or the generator.
- Use canonical token variables and semantic color intents from the styling reference. Keep the reset in `src/css/global.css`; do not enable Tailwind Preflight or add compatibility layers.

## Verification

- After token JSON or generator changes, run `npm run tokens:test` and `npm run tokens:build`.
- For application changes, run `npm run build`. Check affected UI in the browser for layout and runtime errors.
- For documentation-only changes, check references and the diff.

## Integration constraints

- Preserve the canonical site URL in `astro.config.mjs` and Netlify Forms attributes.
- Keep Instagram embeds, Google Tag Manager, and Partytown changes deliberate; they affect external scripts and analytics.
- External links opening a new tab need `rel="noopener noreferrer"`.
- Keep secrets out of this static site. Store large assets in `src/assets/` or `public/`.
