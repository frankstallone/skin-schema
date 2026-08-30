---
target: the home page
total_score: 25
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
timestamp: 2026-08-30T00-33-04Z
slug: src-pages-index-astro
---
# Home Page Critique

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of System Status | 3 | Carousel and form have useful states; anchor navigation has no current-location feedback. |
| 2 | Match System / Real World | 4 | Language, deliverables, rates, and turnaround map well to a beauty-brand brief. |
| 3 | User Control and Freedom | 4 | Repeated anchor exits and a well-controlled carousel provide clear escape paths. |
| 4 | Consistency and Standards | 3 | The system is cohesive, but “I”/“we” shifts and 30+/50+ proof conflict with approved 20+/approximately 40 proof. |
| 5 | Error Prevention | 2 | Native required/email validation exists; the contact flow lacks structured prompts, draft protection, or a visible failure path. |
| 6 | Recognition Rather Than Recall | 3 | Main choices stay visible, but the textarea requires remembering four details from the paragraph above it. |
| 7 | Flexibility and Efficiency | n/a | Not a meaningful criterion for this Persuade surface. |
| 8 | Aesthetic and Minimalist Design | 4 | Strong hierarchy and restraint; mobile length and the legal-copy ending are the exceptions. |
| 9 | Error Recognition and Recovery | 2 | Native errors help, but there is no authored inline recovery or failed-submit preservation. |
| 10 | Help and Documentation | n/a | Not applicable to this Persuade surface. |
| **Total** |  | **25/32** | **Good (78%)** |

## Design Specificity Verdict

This is strongly authored for Skin Schema, not a category-template landing page. Pine/Bone/Rose, the three-film storyboard, creator portrait, flat archive grids, beauty-specific language, and tourmaline metaphor form a coherent visual world. The specificity is strongest in art direction and weakest in proof: the page demonstrates taste more clearly than it proves customized collaboration, brand rigor, or durable campaign value.

The Impeccable CLI returned `[]`: 0 findings, 0 rules, and no file locations. That means the source avoids the detector’s known design anti-patterns; it does not invalidate the strategic, content, touch-target, and conversion issues found in live inspection.

No reliable user-visible overlay is available. Mutable script injection was blocked by the Browser URL policy, so the detector overlay was not run or shown. The fallback was screenshot and computed-layout inspection at 1440×900, 390×844, and 330×700.

## Overall Impression

The home page already has a point of view: calm, sensorial, exact, and recognizably Skin Schema. The single biggest opportunity is to make the commercial proof as distinctive as the visual world. Right now a prospect can believe “this person has taste,” but has to work harder to conclude “this person can translate my product truth into an organized, reusable campaign system.”

## What’s Working

- **The hero has authorship.** A tight statement, three staggered vertical films, and one Serum Pink action create desire without clutter.
- **The creator-to-portfolio sequence balances warmth and craft.** Kseniya’s portrait prevents the darkroom palette from feeling impersonal, while the range section quickly returns attention to the work.
- **The system performs organization.** Numbered process steps, aligned rate rows, consistent CTAs, clear focus states, and robust carousel controls support the promise of a controlled collaboration.

## Priority Issues

### [P1] Trust claims and collaborator identity are inconsistent

**Why it matters:** HomepageCreator says 30+ brands and 50+ campaigns, while the approved product brief records 20+ brands and approximately 40 campaigns. The page also moves between “I” and “we.” A careful buyer may question both the evidence and who will actually deliver the work.

**Fix:** Use only substantiated counts. Define Skin Schema consistently as Kseniya, a creator-led studio, or a collaborator network, then align creator, process, rates, and contact copy.

**Suggested command:** `$impeccable clarify`

### [P1] Pricing collapses the premium, campaign-quality frame

**Why it matters:** After a luxury, campaign-led presentation, $150 for three stills and $350–$500 for films reads closer to commodity UGC pricing. That can repel brand-side buyers who associate realistic production investment with concepting, rights, review, and reliable delivery.

**Fix:** Frame these as clearly bounded entry offerings or replace them with “starting engagements.” Tie price to concepting, usage, deliverables, revisions, channels, and the value of a reusable suite.

**Suggested command:** `$impeccable shape`

### [P1] Mobile utility links miss the 44×44 target baseline

**Why it matters:** At 390px and 330px, header and footer links measure roughly 18px high. The primary CTAs pass at about 45px, but Process, Rates, Contact, and Instagram are fragile one-handed targets.

**Fix:** Add block/invisible padding around utility links without enlarging their visual type; verify at 330px and 200% zoom.

**Suggested command:** `$impeccable adapt`

### [P2] The portfolio proves taste, not customization or durable value

**Why it matters:** “Photo set,” “Short video,” and “Product story film” demonstrate range but do not show how a real brief became a brand-specific idea, what was delivered, or how assets remained useful across channels and months. Two core beliefs are still asserted rather than proven.

**Fix:** Turn one portfolio entry into a compact case narrative: product context, product truth, creative decision, deliverable suite, and channels. Use approved brand names and avoid unsupported performance claims.

**Suggested command:** `$impeccable bolder`

### [P2] The outreach close creates blank-page anxiety and omits the promised fallback

**Why it matters:** The contact paragraph asks for product, launch, timeline, and placement, but the textarea only asks “What would you like to create?” The visitor must remember the four-part prompt. The documented secondary action—saving contact details for a later brief—is absent, and legal terms become the page’s final emotional note.

**Fix:** Put the prompts next to or inside the field, add appropriate autocomplete, provide a saveable email/contact option, and end with a human reassurance around the terms.

**Suggested command:** `$impeccable clarify`

## Persona Red Flags

**Jordan, first-time buyer:** “Product truth” is differentiated but abstract without one immediate example. Logos establish status, yet no named case explains what Skin Schema actually did. The freeform inquiry lacks an example answer, so the first commitment feels larger than necessary.

**Riley, deliberate stress tester:** Riley will catch the unsupported proof-count mismatch, unexplained “I”/“we” shift, ambiguous cancellation window, and absence of authored failed-submit recovery or draft preservation. The carousel itself holds up well: Escape, backdrop close, focus trapping, arrow keys, disabled states, and focus return are implemented.

**Casey, distracted mobile visitor:** Utility links are undersized, the mobile document is about 9,261px tall, contact begins around y=8,067, and multiple autoplay videos increase slow-connection risk. The hero CTA mitigates the distance, but there is no persistent deep-scroll conversion path; name/email also lack explicit autocomplete.

## Minor Observations

- Carousel alt text repeats generic “high quality skincare photography example” language instead of identifying the visible product or action.
- Hero videos have a group label but no individual captions.
- “Cancelation policy” should be “Cancellation policy.”
- The tourmaline is memorable and reduced-motion aware, but its mobile footprint competes with client work.
- There is no horizontal overflow at 1440px, 390px, or 330px; the intentionally cropped third hero frame remains contained.
- The final page impression is payment/cancellation policy rather than warmth, contactability, or the founder’s core ritual idea.

## Questions to Consider

- What single real project could prove quality, customization, organized collaboration, and month-spanning reuse at once?
- Are the current prices meant to signal accessibility, or are they unintentionally defining the studio as commodity production?
- Is “product truth” clear enough on first contact, or does it need one concrete sensory/product example directly beneath the hero?
- Should the last emotional note be cancellation policy, or a warm, saveable invitation for the next brief?
