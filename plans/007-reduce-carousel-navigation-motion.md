# 007 — Reduce carousel navigation motion

- Status: DONE
- Audit baseline: `84cc53d`
- Severity: Medium
- Category: Accessibility
- Estimated scope: two React components

## Problem

`src/components/ui/carousel.tsx:79` and `HomepageRangeCarousel.tsx:130` always call animated Embla navigation. Reduced-motion users still receive sliding motion from buttons and keyboard arrows.

## Target

Thread Embla's supported `jump?: boolean` argument through shared navigation and pass `true` whenever reduced motion is active.

## Repo conventions to follow

- Keep the shared carousel API typed.
- Reuse the hydration-safe reduced-motion state established for plan 004.

## Steps

1. Change context navigation signatures to `(jump?: boolean) => void`.
2. Forward `jump` to `api.scrollPrev(jump)` and `api.scrollNext(jump)`.
3. Pass reduced-motion state from shared arrow buttons and capture keyboard handler.
4. Pass it from the range modal's document-level keyboard handler.
5. Prevent double handling and leave native video-control arrow keys owned by the video.

## Boundaries

- Do not change Embla's global duration or loop configuration.
- Do not alter selected-slide state, button availability, or orientation behavior.

## Verification

- Under no preference, arrows retain smooth navigation.
- Under reduce, buttons and arrow keys jump instantly, including loop wrap.
- Verify one keypress advances exactly one slide and video controls keep their arrow behavior.
- Done when every exposed navigation path supplies the correct `jump` value.
