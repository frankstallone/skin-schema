---
name: Skin Schema
description: A serene, art-directed system for presenting enduring beauty content with precision.
colors:
  mineral-pine: "#213F37"
  pine-page: "#071310"
  pine-raised: "#0D1E1A"
  pine-content: "#1B352E"
  warm-bone: "#F2EDE6"
  translucent-rose: "#E6A0B5"
  serum-pink: "#D85B7D"
typography:
  display:
    fontFamily: "Geist, sans-serif"
    fontSize: "clamp(2.799375rem, 2.43rem + 1.81vw, 3.815rem)"
    fontWeight: 300
    lineHeight: 0.94
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Geist, sans-serif"
    fontSize: "clamp(1.94375rem, 1.76rem + 0.88vw, 2.44125rem)"
    fontWeight: 300
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Geist, sans-serif"
    fontSize: "clamp(1.62rem, 1.50rem + 0.59vw, 1.953125rem)"
    fontWeight: 400
    lineHeight: 1
  body:
    fontFamily: "Geist, sans-serif"
    fontSize: "clamp(1.125rem, 1.08rem + 0.22vw, 1.25rem)"
    fontWeight: 300
    lineHeight: 1.5
  label:
    fontFamily: "Geist Mono, sans-serif"
    fontSize: "clamp(0.75rem, 0.70rem + 0.22vw, 0.875rem)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "normal"
rounded:
  none: "0"
  control: "0.75rem"
  pill: "999px"
spacing:
  3xs: "clamp(0.3125rem, 0.29rem + 0.11vw, 0.375rem)"
  2xs: "clamp(0.5625rem, 0.49rem + 0.33vw, 0.75rem)"
  xs: "clamp(0.875rem, 0.78rem + 0.44vw, 1.125rem)"
  s: "clamp(1.125rem, 0.99rem + 0.67vw, 1.5rem)"
  m: "clamp(1.6875rem, 1.48rem + 1vw, 2.25rem)"
  l: "clamp(2.25rem, 1.98rem + 1.33vw, 3rem)"
  xl: "clamp(3.375rem, 2.96rem + 2vw, 4.5rem)"
  2xl: "clamp(4.5rem, 3.95rem + 2.67vw, 6rem)"
  3xl: "clamp(6.75rem, 5.92rem + 4vw, 9rem)"
  4xl: "clamp(9rem, 7.90rem + 5.33vw, 12rem)"
  gutter: "clamp(1.125rem, 0.44rem + 3.33vw, 3rem)"
components:
  button-primary:
    backgroundColor: "{colors.serum-pink}"
    textColor: "#0D1E1A"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "clamp(0.5625rem, 0.49rem + 0.33vw, 0.75rem) clamp(2.25rem, 1.98rem + 1.33vw, 3rem)"
  button-primary-hover:
    backgroundColor: "#DC6D8C"
    textColor: "#0D1E1A"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "clamp(0.5625rem, 0.49rem + 0.33vw, 0.75rem) clamp(2.25rem, 1.98rem + 1.33vw, 3rem)"
  field-dark:
    backgroundColor: "#00000000"
    textColor: "{colors.warm-bone}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "clamp(0.5625rem, 0.49rem + 0.33vw, 0.75rem) 0"
  navigation-dark:
    backgroundColor: "{colors.pine-page}"
    textColor: "{colors.warm-bone}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "clamp(0.875rem, 0.78rem + 0.44vw, 1.125rem) clamp(1.125rem, 0.44rem + 3.33vw, 3rem)"
---

# Design System: Skin Schema

## 1. Overview

**Creative North Star: "The Beauty Archive"**

Skin Schema presents beauty content as an enduring collection rather than a disposable feed. The system is serene, art-directed, and exact: deep mineral fields give imagery authority, skin-adjacent pink guides action, and disciplined spacing makes the collaboration feel as organized as the finished work.

The visual language is image-led and flat. Depth comes from tonal shifts, full-bleed media, asymmetric overlap, and fine dividers—not ornamental shadows or decorative containers. It must never feel discount-oriented, cold, unapproachable, cheap, messy, or generically luxurious.

**Key Characteristics:**

- Pine Shadow campaign surfaces with restrained Rose accents.
- Large, tightly composed Geist headlines paired with compact Geist Mono labels.
- Fluid type and spacing that scale continuously from mobile to wide screens.
- Square image frames and structural rules contrasted with pill-shaped actions.
- Purposeful motion that reveals media without withholding content.

**The Archive Rule.** Every visual decision must help the work feel worth saving, reusing, and returning to.

## 2. Colors

The palette is a living system, grounded in mineral green and translucent, skin-adjacent pink. Pine supplies structure and protection. Bone carries clarity. Rose signals softness and human presence. Serum Pink supplies controlled energy.

### Primary

- **Mineral Pine** (`#213F37`, `pine-750`): the approved Pine key, primary typography on light sections, and structural brand anchor. It is not the main dark page surface.
- **Warm Bone** (`#F2EDE6`, `bone-050`): primary text on Pine and the main surface for light pages.

### Secondary

- **Translucent Rose** (`#E6A0B5`, `rose-250`): large soft fields and low-energy warmth.
- **Serum Pink** (`#D85B7D`, `rose-450`): actions, focus, prices, process markers, and short moments of emphasis. Use Pine 900 text on Serum Pink.

### Tertiary

- **Rose 400** (`#DC6D8C`): interactive hover state. It stays brighter than Serum Pink while retaining strong contrast with Pine 900.

### Neutral

- The Pine, Bone, and Rose ramps each run from `000` through `999` using the shared Tonal Foundry category model.
- Supporting text, rules, and disabled states use the nearest tone from their surface family. They do not fall back to unrelated gray.

### Dark surface ladder

- **Page:** Pine 950 (`#071310`).
- **Chrome and raised sections:** Pine 900 (`#0D1E1A`).
- **Content sections:** Pine 800 (`#1B352E`).
- **Overlays:** Pine 999 (`#000000`), usually with transparency.

**The Darkroom Rule.** Pine Shadow tones carry the main composition; Bone supplies text; Serum Pink illuminates decisions, proof, and useful detail. Pine 750 remains a key swatch, not a dark surface token.

**The Reversal Rule.** Dark sections use Pine surfaces with Bone text. Light sections reverse to Bone surfaces with Pine text. Do not invent a neutral theme between them.

**The Rose Rule.** Serum Pink is the energetic accent, not the default heading color. Most headings stay Bone or Pine. Translucent Rose belongs to soft fields, not primary actions.

## 3. Typography

**Display Font:** Geist (with sans-serif fallback)

**Body Font:** Geist (with sans-serif fallback)

**Label/Mono Font:** Geist Mono (with sans-serif fallback)

**Character:** One variable family carries the editorial scale without ornamental type pairing. Geist Mono adds production precision to navigation, labels, rates, and process metadata.

### Hierarchy

- **Display** (300, fluid step 5, 0.94 line-height): hero statements only; balance line breaks deliberately and keep letter spacing at or above `-0.04em`.
- **Headline** (300, fluid step 3, 1.02 line-height): major section statements with a concise measure and confident rhythm.
- **Title** (400, fluid step 2, 1 line-height): rate names, modal headings, and compact moments of hierarchy.
- **Body** (300, fluid step 0, 1.5 line-height): explanatory copy; keep normal prose near 50–70 characters per line.
- **Label** (500, fluid step 000, 1 line-height): navigation, field labels, prices, and compact metadata; short labels may use uppercase, never body copy.

**The Single-Family Rule.** Geist earns distinction through scale, weight, spacing, and composition; do not add a decorative display face to manufacture luxury.

**The Mono-as-Structure Rule.** Geist Mono communicates organization and metadata. It is not a decorative shorthand for technical sophistication.

## 4. Elevation

The system is flat and tonal. It uses no decorative shadow vocabulary on the primary marketing surface; depth comes from Pine mixtures, image overlap, modal dimming, hairline dividers, and restrained hover movement. Overlays may darken the surrounding viewport, but their panels remain crisp and full-frame rather than floating cards.

**The Flat Archive Rule.** Surfaces remain flat at rest. If an element needs distinction, change its tone, boundary, crop, or position before considering a shadow.

## 5. Components

Components are polished and precise. Most are structurally square and restrained; pill geometry is reserved for clear actions and circular media controls.

### Buttons

- **Shape:** full pill for homepage actions (`999px`); general-purpose controls may use a gently curved `0.75rem` radius.
- **Primary:** Serum Pink background with Pine 900 text and fluid `2xs` by `l` padding.
- **Hover / Focus:** shift to Rose 400 and lift by one pixel over `180ms`; focus uses a two-pixel Serum Pink outline with a four-pixel offset.
- **Secondary:** text links remain unfilled and underline on hover when additional emphasis is needed.

### Cards / Containers

- **Corner Style:** square (`0`) for sections, rate rows, portfolio media, and modal panels.
- **Background:** Pine 950, 900, and 800 create section changes without detached card surfaces.
- **Shadow Strategy:** none; use hairline dividers, crop, overlap, and tonal contrast.
- **Border:** translucent Bone rules between ordered or comparable items.
- **Internal Padding:** use the fluid spacing scale, with `s` for compact rows and `l` or larger for major compositions.

### Inputs / Fields

- **Style:** transparent dark-field controls with no outer box, square corners, and a single translucent bottom rule.
- **Focus:** strengthen the bottom rule to Warm Bone and use Serum Pink for the visible outline.
- **Error / Disabled:** preserve readable contrast and communicate state with text and structure, never color alone.

### Navigation

Navigation is transparent over the hero, compact, uppercase, and set in Geist Mono. Brand and links use Warm Bone without default underlines; hover and keyboard focus remain direct and visible. On narrow screens, links wrap rather than collapse into an ornamental menu.

### Portfolio Media

Portfolio frames are square-edged, tightly gapped, and image-first. A compact Warm Bone label sits over a Pine directional fade. Hover and focus may lift the frame by `0.125rem` and increase brightness slightly, while keyboard focus receives a clear offset outline.

### Rate Ladder

Rates are an ordered progression rather than independent price cards. Hairline rules, aligned specifications, compact mono labels, and warm price emphasis establish comparison without boxed containers.

### Media Carousel

The carousel is a full-viewport Pine viewing room. Media remains the focal point; circular controls use translucent boundaries at rest and invert to Warm Bone on hover or focus. Disabled controls retain position and reduce opacity.

## 6. Do's and Don'ts

### Do:

- **Do** lead with real photography and video; the work must prove quality before the copy claims it.
- **Do** use Pine Shadow surfaces, Warm Bone text, Mineral Pine light-mode type, and Serum Pink action as the dominant working system.
- **Do** preserve the fluid type and spacing scales from `330px` through `1230px` viewports.
- **Do** use exact alignment, hairline rules, and purposeful whitespace to make the service feel organized.
- **Do** keep motion purposeful, fast, and safe for reduced-motion preferences.
- **Do** make customization visible through content structure and specific examples, not vague luxury language.

### Don't:

- **Don't** make Skin Schema feel discount-oriented, cold, unapproachable, cheap, or messy.
- **Don't** use generic luxury signals that make the creator or collaboration feel impersonal.
- **Don't** break the flat tonal system with decorative shadows, glass panels, or nested cards.
- **Don't** scatter Rose across a page; reserve Serum Pink for action and short emphasis, and Translucent Rose for soft fields.
- **Don't** add a decorative serif or use monospace as a costume for sophistication.
- **Don't** round sections, media frames, rate rows, or input fields; pills belong to actions and circular controls.
- **Don't** hide content behind animation or omit a reduced-motion path.
