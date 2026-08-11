# `llms.txt` implementation research

Date: 2026-08-11

## Recommendation

Publish one concise file at `public/llms.txt`. Astro will serve it as
`https://skinschema.com/llms.txt`, where it covers the whole site. Add
`<link rel="describedby" href="/llms.txt" />` to the shared HTML head for
explicit discovery.

Do not add `llms-full.txt`. The current v2 proposal does not define or require
that file. The site is small, and a second aggregate file would duplicate the
home page without improving discovery. If the site later gains substantial
articles or documentation, add clean Markdown versions of those pages and link
them from `llms.txt` instead.

`llms.txt` remains an optional, emerging convention rather than a formal web
standard. Chrome's Lighthouse audit treats a missing file as not applicable;
it recommends a root file with a concise Markdown summary and key links when a
site chooses to publish one. [Chrome Lighthouse `llms.txt` audit](https://developer.chrome.com/docs/lighthouse/agentic-browsing/llms-txt)

## Current v2 specification

The current proposal is v2, modified 2026-08-10. A root `/llms.txt` describes
the whole site. A file may instead appear below another path, such as
`/docs/llms.txt`, and then covers URLs below that path; the most specific file
wins. [llms.txt v2 proposal](https://llmstxt.org/)

The parts must appear in this order:

1. Optional byte-order mark.
2. One H1 naming the project or site. This is the only required section.
3. Optional blockquote with a short summary.
4. Optional Markdown details or guidance, without headings.
5. Optional H2 sections containing file lists. Each list item requires a
   Markdown link; a colon and short description may follow it.

`## Optional` may group secondary links, but in v2 it is only a convention. It
no longer has the mechanical omit behavior it had with the old context-builder
tooling. [Format](https://llmstxt.org/#format), [v2 changes](https://llmstxt.org/changes.html)

The proposal says linked targets should be easy for agents to read, ideally
clean Markdown versions of pages. It accepts either an appended `.md` URL or a
replacement `.md` URL. It also recommends
`rel="alternate" type="text/markdown"` for a page's Markdown counterpart and
`rel="describedby"` for the applicable `llms.txt`. Skin Schema has no Markdown
page counterpart today, so add only `rel="describedby"`; do not advertise a
nonexistent alternate. [Discovery and Markdown versions](https://llmstxt.org/#proposal)

No `robots.txt` directive is needed. The proposal treats `llms.txt`,
`robots.txt`, and sitemaps as complementary: robots controls crawler access, a
sitemap lists indexable pages, and `llms.txt` gives agents a curated route into
the useful content. [Existing standards](https://llmstxt.org/#existing-standards)

## `llms-full.txt`

Skip it.

- The current v2 specification defines files named `llms.txt`; it does not
  define a root `llms-full.txt`. [Format](https://llmstxt.org/#format)
- v2 explicitly removed context-expansion tooling from the proposal. Earlier
  first-party material produced `llms-ctx.txt` and `llms-ctx-full.txt`; those
  generated context bundles were not a required `llms-full.txt` endpoint.
  [v2 changes](https://llmstxt.org/changes.html)
- The v2 usage model is selective: an agent reads or searches the small
  `llms.txt`, then follows only relevant links. This avoids placing an entire
  site in one context window. [Proposal](https://llmstxt.org/#proposal)

## Appropriate Skin Schema content

Use current public facts from the home page and keep volatile detail, such as
exact starting rates, on the canonical page. Suggested file:

```md
# Skin Schema

> Skin Schema is a creator-led beauty content studio producing campaign-ready visuals for skincare, makeup, and wellness brands.

Skin Schema was created by beauty photographer and videographer Kseniya. Services include product photo sets, short-form product videos, and premium product videos, with concepting, shooting, and delivery.

## Website

- [Services, process, rates, and contact](https://skinschema.com/): Official Skin Schema home page with work examples, current starting rates, project process, and contact form.

## Social

- [Instagram](https://www.instagram.com/skinschema/): Official Skin Schema account and portfolio.
```

The summary, service names, creator identity, and URLs match the current site
source and live home page. Exclude the proof-of-concept store, checkout,
thank-you pages, and old blog material: they are not needed to understand the
current public offer. Absolute canonical URLs remove ambiguity for agents that
fetch the file outside the site context.

## Validation

1. Run `npm run build`; confirm `dist/llms.txt` exists and matches the source.
2. After deployment, request `https://skinschema.com/llms.txt`; require HTTP
   200, plain Markdown rather than an HTML error document, and successful
   responses from every linked URL.
3. Smoke-test the grammar with the proposal's parser. Its Python package
   exposes `parse_llms_file`; the CLI is installed by `pip install llms-txt`.
   This is useful validation, though v2 no longer makes context expansion part
   of the proposal. [Official Python module and CLI](https://llmstxt.org/intro.html)
4. Run Lighthouse's agentic browsing audit to verify root discovery.
   [Lighthouse audit behavior](https://developer.chrome.com/docs/lighthouse/agentic-browsing/llms-txt)
5. Give an agent only `/llms.txt` as its starting point and ask who Skin Schema
   is, what it offers, where current rates live, and how to make contact. This
   is the proposal's recommended usefulness test. [Authoring guidance](https://llmstxt.org/#example)

## Sources

- [The `/llms.txt` file, v2](https://llmstxt.org/)
- [v2 change notes](https://llmstxt.org/changes.html)
- [Official Python module and CLI](https://llmstxt.org/intro.html)
- [Chrome Lighthouse `llms.txt` audit](https://developer.chrome.com/docs/lighthouse/agentic-browsing/llms-txt)
