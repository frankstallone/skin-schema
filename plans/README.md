# Motion audit remediation

- Branch: `f4/motion-audit-fixes`
- Audit baseline: `84cc53d`
- Scope: the 11 numbered findings from the deep animation audit
- Status: complete

| Plan                                              | Finding                           | Severity | Depends on | Status |
| ------------------------------------------------- | --------------------------------- | -------- | ---------- | ------ |
| [001](./001-event-drive-tourmaline.md)            | Event-drive Tourmaline            | High     | —          | DONE   |
| [002](./002-accelerate-hero-entrance.md)          | Accelerate hero entrance          | High     | 005        | DONE   |
| [003](./003-smooth-carousel-controls.md)          | Smooth carousel controls          | Medium   | 006, 011   | DONE   |
| [004](./004-respect-reduced-motion-video.md)      | Respect reduced motion for video  | Medium   | —          | DONE   |
| [005](./005-progressively-enhance-hero.md)        | Progressively enhance the hero    | Medium   | —          | DONE   |
| [006](./006-gate-hover-and-focus-motion.md)       | Gate hover and focus motion       | Medium   | 011        | DONE   |
| [007](./007-reduce-carousel-navigation-motion.md) | Reduce carousel navigation motion | Medium   | 004        | DONE   |
| [008](./008-stop-responsive-hero-replay.md)       | Stop responsive hero replay       | Medium   | 002, 005   | DONE   |
| [009](./009-gate-tourmaline-pointer-input.md)     | Gate Tourmaline pointer input     | Medium   | 001        | DONE   |
| [010](./010-release-hero-will-change.md)          | Release hero compositing hints    | Low      | 005        | DONE   |
| [011](./011-canonicalize-motion-tokens.md)        | Canonicalize interaction timing   | Low      | —          | DONE   |

Implementation lanes are intentionally non-overlapping:

1. `HomepageHero.astro`: 002, the hero portion of 004, 005, and 008.
2. `HomepageTourmaline.astro`: 001 and 009.
3. Shared controls/media/styles: 003, the remaining portion of 004, 006, 007, 010, and 011.

Plans 001/009 and 002/005/008 are implemented together because their lifecycle changes are inseparable. Verification happens after all lanes are integrated so the shared reduced-motion behavior can be tested as one system.
