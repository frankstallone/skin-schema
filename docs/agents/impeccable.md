# Impeccable client variants

Both clients need regular local skill files. Keep `.agents/skills/impeccable/` for Codex and `.cursor/skills/impeccable/` for Cursor; do not replace either with an unverified symlink.

When changing shared instructions, apply the same change to both copies. Compare content after accounting for these intentional differences:

- Script paths use the client’s own skill directory. Command prefixes are `$` for Codex and `/` for Cursor, including `scripts/lib/provider.mjs`.
- Cursor declares the Apache 2.0 license in skill frontmatter and installs agents in `.cursor/agents/`; the Codex bundle stores its agents inside the skill.
- Codex references contain client-specific question-tool, browser, image-generation, permission, and critique run-note guidance. Cursor uses its own question and command conventions.
- Critique checks `AGENTS.md` for Codex and `.cursorrules` for Cursor when looking for legacy Design Context.

Keep shared descriptions and the craft floor identical. Preserve product truth, refinement scope, asset provenance, and the selected playbook’s finish behavior when pruning prose. Runtime tools and active permission rules take precedence over client examples.
