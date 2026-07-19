---
name: Skin Schema
description: A serene, art-directed system for presenting enduring beauty content with precision.
colors:
  studio-black: "#171717"
  gallery-white: "#fcfcfc"
  soft-white: "#f2f2f2"
  silver-mist: "#c7c7c7"
  quiet-gray: "#8f8f8f"
  structure-gray: "#6f6f6f"
  skin-veil: "#e6c3ba"
  mineral-veil: "#e6e4d8"
  orchid-powder: "#e3b4d4"
  petal-pink: "#eec0bd"
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
  button-light:
    backgroundColor: "{colors.skin-veil}"
    textColor: "{colors.studio-black}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "clamp(0.5625rem, 0.49rem + 0.33vw, 0.75rem) clamp(2.25rem, 1.98rem + 1.33vw, 3rem)"
  button-light-hover:
    backgroundColor: "{colors.petal-pink}"
    textColor: "{colors.studio-black}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "clamp(0.5625rem, 0.49rem + 0.33vw, 0.75rem) clamp(2.25rem, 1.98rem + 1.33vw, 3rem)"
  field-dark:
    backgroundColor: "#00000000"
    textColor: "{colors.gallery-white}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "clamp(0.5625rem, 0.49rem + 0.33vw, 0.75rem) 0"
  navigation-dark:
    backgroundColor: "{colors.studio-black}"
    textColor: "{colors.gallery-white}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "clamp(0.875rem, 0.78rem + 0.44vw, 1.125rem) clamp(1.125rem, 0.44rem + 3.33vw, 3rem)"
---

# Design System: Skin Schema

## 1. Overview

**Creative North Star: "The Beauty Archive"**

Skin Schema presents beauty content as an enduring collection rather than a disposable feed. The system is serene, art-directed, and exact: dark gallery-like fields give imagery authority, pale skin tones guide action, and disciplined spacing makes the collaboration feel as organized as the finished work.

The visual language is image-led and flat. Depth comes from tonal shifts, full-bleed media, asymmetric overlap, and fine dividers—not ornamental shadows or decorative containers. It must never feel discount-oriented, cold, unapproachable, cheap, messy, or generically luxurious.

**Key Characteristics:**

- Near-black campaign surfaces with restrained skin-toned accents.
- Large, tightly composed Geist headlines paired with compact Geist Mono labels.
- Fluid type and spacing that scale continuously from mobile to wide screens.
- Square image frames and structural rules contrasted with pill-shaped actions.
- Purposeful motion that reveals media without withholding content.

**The Archive Rule.** Every visual decision must help the work feel worth saving, reusing, and returning to.

## 2. Colors

The palette behaves like a dark viewing room: Studio Black establishes focus, Gallery White carries clarity, and cosmetic skin tones signal warmth and action without becoming decorative noise.

### Primary

- **Studio Black** (`#171717`): the dominant campaign surface, primary text color on light sections, and anchor for the site's high-contrast presentation.
- **Skin Veil** (`#e6c3ba`): the principal action and focus accent, reserved for CTAs, prices, process markers, and warm emphasis.

### Secondary

- **Mineral Veil** (`#e6e4d8`): a pale, product-like warmth used in tonal mixtures and supporting surfaces.
- **Petal Pink** (`#eec0bd`): the active and hover state for Skin Veil controls.

### Tertiary

- **Orchid Powder** (`#e3b4d4`): a supporting cosmetic accent available for art direction, not a default interface color.

### Neutral

- **Gallery White** (`#fcfcfc`): primary light surface and high-contrast text on dark fields.
- **Soft White** (`#f2f2f2`): subdued light text and secondary surface.
- **Silver Mist** (`#c7c7c7`): supporting copy and restrained controls on dark surfaces.
- **Quiet Gray** (`#8f8f8f`): low-emphasis metadata where contrast remains sufficient.
- **Structure Gray** (`#6f6f6f`): borders, disabled states, and structural separation.

**The Darkroom Rule.** Studio Black carries the composition; pale accents illuminate only decisions, proof, and useful detail.

**The Skin-Tone Rule.** Never scatter all cosmetic hues across one surface. Skin Veil is the default accent; the remaining tones require a specific art-direction purpose.

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

The system is flat and tonal. It uses no decorative shadow vocabulary on the primary marketing surface; depth comes from near-black tonal mixtures, image overlap, modal dimming, hairline dividers, and restrained hover movement. Overlays may darken the surrounding viewport, but their panels remain crisp and full-frame rather than floating cards.

**The Flat Archive Rule.** Surfaces remain flat at rest. If an element needs distinction, change its tone, boundary, crop, or position before considering a shadow.

## 5. Components

Components are polished and precise. Most are structurally square and restrained; pill geometry is reserved for clear actions and circular media controls.

### Buttons

- **Shape:** full pill for homepage actions (`999px`); legacy general-purpose controls may use a gently curved `0.75rem` radius.
- **Primary:** Skin Veil background with Studio Black text and fluid `2xs` by `l` padding.
- **Hover / Focus:** shift to Petal Pink and lift by one pixel over `180ms`; focus uses a two-pixel Skin Veil outline with a four-pixel offset.
- **Secondary:** text links remain unfilled and underline on hover when additional emphasis is needed.

### Cards / Containers

- **Corner Style:** square (`0`) for sections, rate rows, portfolio media, and modal panels.
- **Background:** Studio Black and subtly warmed black mixtures create section changes without detached card surfaces.
- **Shadow Strategy:** none; use hairline dividers, crop, overlap, and tonal contrast.
- **Border:** translucent white rules between ordered or comparable items.
- **Internal Padding:** use the fluid spacing scale, with `s` for compact rows and `l` or larger for major compositions.

### Inputs / Fields

- **Style:** transparent dark-field controls with no outer box, square corners, and a single translucent bottom rule.
- **Focus:** strengthen the bottom rule to Gallery White and use Skin Veil for the visible outline.
- **Error / Disabled:** preserve readable contrast and communicate state with text and structure, never color alone.

### Navigation

Navigation is transparent over the hero, compact, uppercase, and set in Geist Mono. Brand and links use Gallery White without default underlines; hover and keyboard focus remain direct and visible. On narrow screens, links wrap rather than collapse into an ornamental menu.

### Portfolio Media

Portfolio frames are square-edged, tightly gapped, and image-first. A compact Gallery White label sits over a dark directional fade. Hover and focus may lift the frame by `0.125rem` and increase brightness slightly, while keyboard focus receives a clear offset outline.

### Rate Ladder

Rates are an ordered progression rather than independent price cards. Hairline rules, aligned specifications, compact mono labels, and warm price emphasis establish comparison without boxed containers.

### Media Carousel

The carousel is a full-viewport dark viewing room. Media remains the focal point; circular controls use translucent boundaries at rest and invert to Gallery White on hover or focus. Disabled controls retain position and reduce opacity.

## 6. Do's and Don'ts

### Do:

- **Do** lead with real photography and video; the work must prove quality before the copy claims it.
- **Do** use Studio Black, Gallery White, and Skin Veil as the dominant working palette.
- **Do** preserve the fluid type and spacing scales from `330px` through `1230px` viewports.
- **Do** use exact alignment, hairline rules, and purposeful whitespace to make the service feel organized.
- **Do** keep motion purposeful, fast, and safe for reduced-motion preferences.
- **Do** make customization visible through content structure and specific examples, not vague luxury language.

### Don't:

- **Don't** make Skin Schema feel discount-oriented, cold, unapproachable, cheap, or messy.
- **Don't** use generic luxury signals that make the creator or collaboration feel impersonal.
- **Don't** break the flat tonal system with decorative shadows, glass panels, or nested cards.
- **Don't** scatter the full cosmetic palette across a page; reserve color for art direction and action.
- **Don't** add a decorative serif or use monospace as a costume for sophistication.
- **Don't** round sections, media frames, rate rows, or input fields; pills belong to actions and circular controls.
- **Don't** hide content behind animation or omit a reduced-motion path.
