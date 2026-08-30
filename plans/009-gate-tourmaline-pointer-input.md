# 009 — Gate Tourmaline pointer input

- Status: DONE
- Audit baseline: `84cc53d`
- Severity: Medium
- Category: Accessibility and input
- Estimated scope: one component

## Problem

`src/components/homepage/HomepageTourmaline.astro:203` binds pointer tracking for every device, including coarse/touch input where hover tilt is unavailable or noisy.

## Target

Install pointer listeners only while `(hover: hover) and (pointer: fine)` matches. Capability loss and reduced motion must synchronously reset to the neutral render without leaving a stranded tilt.

## Repo conventions to follow

- Use media queries to model capabilities, not user-agent detection.
- Make connection/disconnection and Astro navigation leak-free.

## Steps

1. Add a pointer-capability MediaQueryList and a replaceable pointer AbortController.
2. Bind `pointermove`/`pointerleave` only while the query matches.
3. Guard zero-width/height bounds before normalizing coordinates.
4. On capability loss, abort listeners, cancel work, zero current/target values, and render neutral.
5. Recreate both controllers cleanly after custom-element reconnection.

## Boundaries

- Do not add touch gestures or device-orientation input.
- The event-driven scheduler and visibility behavior are specified by plan 001.

## Verification

- Fine-pointer hover tilts and settles normally.
- Touch/coarse emulation has no pointer listeners or tilt.
- Switching the capability query off clears an existing tilt immediately.
- Done when coarse input cannot wake the Tourmaline animation.
