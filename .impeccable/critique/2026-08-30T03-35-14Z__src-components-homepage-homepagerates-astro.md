---
target: pricing, custom campaign, and contact sequence in the home page
total_score: 23
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
timestamp: 2026-08-30T03-35-14Z
slug: src-components-homepage-homepagerates-astro
---
Method: dual agent (A: /root/critique_design · B: /root/critique_detector)

# Pricing, custom campaign, and contact critique

## Design Health Score

| Heuristic | Score | Evidence |
|---|---:|---|
| Visibility of system status | 3/4 | Both route actions scroll correctly, but contact does not acknowledge which route was chosen. |
| Match with the real world | 4/4 | Focused packages, concrete deliverables, and separately quoted campaigns match how beauty marketers scope work. |
| User control and freedom | 3/4 | Both paths remain available, but they collapse into the same undifferentiated form. |
| Consistency and standards | 4/4 | Tonal surfaces, typography, rules, and primary and secondary action styles are cohesive. |
| Error prevention | 2/4 | Required fields help, but the form does not help visitors provide enough information for either route. |
| Recognition rather than recall | 2/4 | Visitors must remember and restate the route they selected after arriving at contact. |
| Flexibility and efficiency | n/a | This is a persuade surface, so power user accelerators are not a meaningful criterion. |
| Aesthetic and minimalist design | 3/4 | The sequence is restrained, but the merged closing surfaces and cramped 1000px action reduce precision. |
| Error recognition and recovery | 2/4 | Native form recovery exists, but there is no authored failure guidance or draft preservation. |
| Help and documentation | n/a | Not applicable to this persuade sequence. |
| **Total** | **23/32** | **Good, with one unresolved conversion decision.** |

## Design Specificity Verdict

The page remains unmistakably Skin Schema. Pine, Bone, Rose, the flat archive structure, real beauty work, and large editorial type give the full experience a clear point of view. The new custom campaign block also solves a specific commercial problem: it makes clear that the starter prices are not the ceiling of the work.

The block itself is less specific than the page around it. “Several formats, broader concepts, or larger productions” could belong to almost any small creative studio. It does not yet express Skin Schema’s sharper value: finding the product truth, respecting brand guardrails, and building a connected set of photo and film assets that can live across a launch and beyond it.

The automated scan found **0 findings** in both `HomepageRates.astro` and `Homepage.astro`. The browser overlay could not be injected because the Browser URL policy blocks the required `javascript:` preflight, so screenshots and read only DOM measurements were used instead.

## Overall Impression

The new section is the right strategic move. It repairs the pricing story by separating one focused deliverable from a larger engagement, and the tonal step from Pine 950 to Pine 900 feels calm and premium.

Its relationship to the surrounding page is only half resolved. It is clearly separate from rates, but not clearly separate from contact. Because custom campaign and contact share the same Pine 900 surface with no boundary, they read as one long closing section. That makes the custom campaign action feel like an extra step on the way to the same generic form.

The conversion sequence currently says: choose a starter package or choose a custom campaign, then forget that choice and describe everything again. The visual distinction is meaningful, but the interaction does not preserve it.

## What Is Working

1. **The pricing narrative is clearer.** “One polished deliverable” versus “several formats, broader concepts, or larger productions” establishes a useful boundary around the starter prices.
2. **The tonal pivot works.** At 1440px, the 397px Pine 900 field creates a calm exhale after the denser 1168px rate section.
3. **The mobile version is clean.** At 390px, the block stacks naturally, has no horizontal overflow, and the outline action measures about 316 by 47px, meeting the touch target baseline.

## Priority Issues

### P1: The two routes disappear at contact

Both “Discuss a starting package” and “Discuss a custom campaign” link to `#Contact`. The form then shows only Name, Email, and “What would you like to create?” There is no project type, route acknowledgment, or tailored helper copy.

This makes the choice feel cosmetic and asks visitors to remember and restate context. Add a visible “Starting package” and “Custom campaign” choice to the form, and preselect it from the clicked action. Keep both options visible as a fallback.

Suggested command: `$impeccable shape`

### P1: The action hierarchy makes starter work look preferred

The starter package action is solid Rose, while the custom campaign action is outlined. The form submit is also solid Rose. This teaches visitors that the $150 to $500 route is the main offer and that custom campaigns are secondary.

Decide the commercial hierarchy directly. If both routes are equal qualifiers, use the same secondary treatment for both and reserve Rose for submit. If custom campaigns are the strategic heart of the business, give that route the stronger invitation.

Suggested command: `$impeccable colorize`

### P2: Custom campaign and contact visually merge

Both sections use the same Pine 900 background and have no border. At 1440px, the complete custom invitation and the beginning of contact appear in one viewport as a continuous field.

Choose one clear intent. Either merge the custom campaign idea into contact as the project type choice, or keep it as a standalone invitation and restore a real structural transition before contact. A background change is more semantically appropriate than a border between identical tonal categories.

Suggested command: `$impeccable layout`

### P2: The compact desktop layout is cramped

At 1000px, rates have already become one column, but the custom campaign block remains two columns until 900px. Its right column is about 341px wide, and “Discuss a custom campaign” wraps into two uneven lines, making the pill about 341 by 83px. It is one line at both 1440px and 390px.

Stack the custom campaign block at the same breakpoint as rates, or rebalance its columns so the action stays on one line.

Suggested command: `$impeccable adapt`

### P2: The custom value is still generic

The copy explains scale, but not what makes Skin Schema valuable at that scale. It does not mention product qualities, brand standards, connected formats, channel use, or durable reuse.

Add one concrete differentiator. For example: a connected photo and film suite shaped around the product and built for launch, product pages, and ongoing social use. Keep the phrasing natural and avoid unsupported performance claims.

Suggested command: `$impeccable clarify`

## Persona Red Flags

### Jordan, a first time buyer

Jordan can understand the starter versus custom distinction, but both actions produce the same blank form. “Broader concepts” and “larger productions” still leave Jordan guessing about what changes beyond price and scale.

### Riley, a deliberate buyer

Riley will test both routes and see that neither changes the form or submission data. “Quoted separately” also does not explain what shapes the quote, such as usage, formats, timeline, location, talent, or review rounds.

### Casey, a distracted mobile visitor

The custom action is a good size, but it sits only about 121px above contact at 390px. Tapping it moves the page such a short distance that it may feel as though nothing happened. The full page is about 9812px tall, and the final form still depends on a large freeform response.

### Morgan, an in house beauty marketer

The custom invitation is the first part of pricing that sounds like Morgan’s likely engagement, yet it is visually subordinate to starter packages. It gives no place to specify launch date, channels, usage, or approval needs, and it does not demonstrate that larger work is a core capability.

## Minor Observations

- At 1440px, the starter action is about 353 by 54px, the custom action 362 by 56px, and submit 287 by 54px.
- At 390px, all three actions remain above the 44px touch target baseline.
- No page level overflow, clipping, broken anchors, or hidden focus was found at 1440px, 1000px, or 390px.
- Keyboard focus is clearly visible in the contact form.
- The required Name and Email fields are correctly labelled, but they lack `autocomplete="name"` and `autocomplete="email"`.
- Both custom campaign and contact use the same reveal treatment, producing two consecutive closing beats rather than one decisive close.

## Questions to Consider

1. Is custom campaign work the premium heart of Skin Schema, or a fallback for briefs that do not fit the packages?
2. If both route actions lead to the same unchanged form, what decision has the visitor actually made?
3. Would the close be stronger as one contact section with a visible starting package or custom campaign choice?
4. What one real project could make “connected campaign” unmistakably Skin Schema?
