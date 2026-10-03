# Storefront bundle handoff

Audit date: October 2, 2026. This document records the source media and inputs for the private, two-bundle Stripe test storefront. Deployment results belong in the last section.

## Current offer

| Package ID         | Working title    | Source files | Provisional test price |
| ------------------ | ---------------- | -----------: | ---------------------- |
| `bathroom-rituals` | Bathroom Rituals |           30 | $99 USD                |
| `coastal-skin`     | Coastal Skin     |           34 | $99 USD                |

The titles and prices await approval. The $99 price comes from a founding-price hypothesis in the earlier bundle plan. It is not evidence of buyer demand or a settled sale price. Final commercial license terms also await approval. Test Checkout takes no real payment and grants no commercial usage rights.

Keep both batches intact, including the seven files that appear in both. The user requested two bundles of 30 and 34 files. These counts describe delivered files, not distinct compositions or unique shots.

## Local sources and evidence

- [Source archive directory](</Users/starlord/Movies/Skin Schema Storefront/2026-10-02>)
- [Canonical 30-file source folder](</Users/starlord/Movies/Skin Schema Storefront/2026-10-02/batch-30-originals>) and [inventory](</Users/starlord/Movies/Skin Schema Storefront/2026-10-02/batch-30-originals-inventory.json>)
- [Canonical 34-file source folder](</Users/starlord/Movies/Skin Schema Storefront/2026-10-02/batch-34-originals>) and [inventory](</Users/starlord/Movies/Skin Schema Storefront/2026-10-02/batch-34-originals-inventory.json>)
- [Original first-share browser ZIP](</Users/starlord/Downloads/iCloud Photos from Kseniya Stallone.zip>): 671,185,977 bytes.
- [Independent media audit](</Users/starlord/Movies/Skin Schema Storefront/2026-10-02/media-audit-metadata.json>)
- [All 34 clips at 20% of runtime](</Users/starlord/Movies/Skin Schema Storefront/2026-10-02/batch-34-contact-sheet-20.jpg>) and [at 70%](</Users/starlord/Movies/Skin Schema Storefront/2026-10-02/batch-34-contact-sheet-70.jpg>)
- [All 30 clips at 20% of runtime](</Users/starlord/Movies/Skin Schema Storefront/2026-10-02/batch-30-contact-sheet-20.jpg>)
- [Message-attachment media comparison](</Users/starlord/Movies/Skin Schema Storefront/2026-10-02/message-attachment-media-comparison.json>)

The first browser ZIP's 30 media entries have the same SHA-256 hash multiset as the 30 numbered iCloud downloads. Compare ZIP entries directly; the older loose `batch-30` extraction contains only 28 files and is not canonical.

The audit independently checked all 64 files with `ffprobe` and SHA-256. File sizes, durations and hashes match the inventories. Display dimensions account for the files' ±90° rotation metadata. The sources retain their bytes and rotation metadata; the audit created separate review images only.

The first ten video attachments returned by the authorized message read are byte-identical to the matching 34-file downloads. Their dimensions, durations, codecs and frame rates also match. The comparison retains media facts only.

## Verified media facts

| Fact                          | Bathroom Rituals                           | Coastal Skin                                |
| ----------------------------- | ------------------------------------------ | ------------------------------------------- |
| Delivered files               | 30                                         | 34                                          |
| Total runtime                 | 118.307 seconds; about 1 minute 58 seconds | 143.460 seconds; about 2 minutes 23 seconds |
| Individual runtimes           | 1.583–11.787 seconds                       | 1.735–12.515 seconds                        |
| Source file bytes             | 671,077,807; about 671.1 MB                | 503,865,840; about 503.9 MB                 |
| Portrait 4K display size      | 8 files at 2160 × 3840                     | 1 file at 2160 × 3840                       |
| Portrait Full HD display size | 18 files at 1080 × 1920                    | 30 files at 1080 × 1920                     |
| Other cropped display sizes   | 4 files                                    | 3 files                                     |
| Filename extensions           | 30 MOV                                     | 31 MOV and 3 MP4                            |
| Video codecs                  | 26 H.264 and 4 HEVC                        | 31 H.264 and 3 HEVC                         |
| Measured average frame rates  | About 29.777–30.312 fps                    | About 29.478–30.305 fps                     |
| Files with audio tracks       | 30                                         | 34                                          |
| Audio codecs                  | 29 PCM tracks and 1 AAC track              | 34 PCM tracks                               |

Source totals exclude ZIP packaging overhead. Confirm the generated archive sizes before reporting exact download sizes. The source files are encoded with H.264 or HEVC. Do not describe either bundle as entirely 4K or uncompressed, or promise an exact constant frame rate.

The cropped files are:

| Batch | File           | Display size |
| ----- | -------------- | ------------ |
| 30    | `18-C0161.MOV` | 1880 × 3342  |
| 30    | `19-C1309.MOV` | 932 × 1658   |
| 30    | `21-C1301.MOV` | 890 × 1582   |
| 30    | `27-C1039.MOV` | 992 × 1762   |
| 34    | `21-C1564.MOV` | 928 × 1650   |
| 34    | `27-C1525.MOV` | 1022 × 1820  |
| 34    | `30-C1498.MOV` | 862 × 1532   |

Some files already contain cropped or exported media. For example, batch 30 includes `11-FullSizeRender.mov`. A filename, resolution, codec or iCloud rendition name cannot certify that a file is a camera original. This audit confirms the delivered files; it does not establish their complete edit or export history.

## Overlap and filename handling

The bundles contain 64 delivered files and 57 unique byte sequences. Each bundle has no internal byte-identical duplicate; the seven duplicates occur across bundles.

| Bathroom Rituals file | Identical Coastal Skin file |
| --------------------- | --------------------------- |
| `02-C2593.MOV`        | `05-C2593.MOV`              |
| `03-C2592.MOV`        | `06-C2592.MOV`              |
| `04-C2590.MOV`        | `07-C2590.MOV`              |
| `05-C2588.MOV`        | `08-C2588.MOV`              |
| `06-C2587.mov`        | `09-C2587.mov`              |
| `08-C2587.mov`        | `11-C2587.mov`              |
| `09-C2587.mov`        | `10-C2587.mov`              |

Preserve the numeric prefixes in archive filenames. Batch 30 has four source names that collide as `C2587.mov` after case folding, plus two as `C1749.mov`. Batch 34 has three as `C2587.mov`. These names refer to different files. Removing prefixes or changing filename case can overwrite footage on a filesystem that ignores case.

The file references in this audit use the local inventory numbering. The ZIPs use a separate stable ordering and three-digit prefixes. Use each ZIP's `clip-index.csv` and SHA-256 hashes to match its clips to the local inventory.

## Theme and commercial-use review

Bathroom Rituals fits the 30-file batch: robes, towels, shower details, water, mirror moments and bath context dominate the sampled frames.

Coastal Skin fits much of the 34-file batch, but not every clip. Its first 12 files include a fire feature, robes, interior artwork, showers and mirror routines. Later clips show greenery, pools, beach and ocean views, a person with a surfboard, bags and books. The final clip shows reading in bed. Keep the title provisional and describe the indoor rituals as well as the coastal footage. “Coastal & Resort Rituals” is a possible broader title, not an approved replacement.

The [Commercial B-Roll Collection & Edition Ideas](https://docs.google.com/document/d/1bVS7F6gyQIXFgr_J_d9nJrKr6Fryn1xTQGUwuEkUbUE/edit) sets the intended rule for reusable commercial footage: omit visible third-party beauty products and product-specific handling, confirm permission for recognizable people, check client reuse restrictions, and exclude copyrighted music from delivered clips. The current batches need a full review against that rule before any commercial license is granted.

The sampled frames identify these review items:

| Files                                            | Observed item                                                        | Review needed                                                                                                                                                                                |
| ------------------------------------------------ | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Batch 30 `04-C2590.MOV`; batch 34 `07-C2590.MOV` | Blue personal-care bottles in the shower recess                      | These visible products conflict with the intended product-neutral library rule, even though the sampled labels are blurred.                                                                  |
| Batch 30 `19-C1309.MOV`, `20-C1307.MOV`          | Scooping bath material from a bowl                                   | Confirm the material, client origin and whether this is neutral ritual context or product-specific footage.                                                                                  |
| Batch 30 `25-C1043.MOV`                          | Labeled bottled water poured into a drinking glass beside the bath   | Review visible branding and client origin. This is not a confirmed beauty product.                                                                                                           |
| Batch 34 `03-C2596.MOV`                          | Framed “Splash!” artwork is a main subject                           | Confirm permission for the artwork and location use.                                                                                                                                         |
| Batch 34 `31-C1495.MOV`                          | A person carries a surfboard near the camera; the face is visible    | Confirm the subject's identity and commercial release. Do not assume this is the creator or an unrecognizable bystander.                                                                     |
| Batch 34 `32-C1491.MOV`, `33-C1475.MOV`          | A book, visible bag markings and a recognizable _The Barbizon_ cover | Review the book artwork, bag branding and whether those elements remain suitable for a reusable pack. The white item in `32-C1491.MOV` appears to be a book, not confirmed beauty packaging. |
| All files                                        | Source audio tracks                                                  | Original audio is not cleared for commercial reuse. Confirm music, speech, incidental recordings and permissions before licensing or promise a separately prepared silent delivery.          |

The sampled frames do not certify the absence of people, products, logos, artwork or restricted audio elsewhere in a clip. This audit did not review every frame or listen to every audio track. It does not certify copyright ownership, model or property releases, client-contract reuse rights, or camera-original provenance. The test bundles preserve all supplied files; no review flag removes or transforms a source file.

## Prior planning and current scope

- [UGC B-Roll Storefront Market Scan — B-Roll plan](https://docs.google.com/document/d/1u9_72qoQ2gLJEqKtLEtPca_STNWxiy0ksZpIuIPlP7Y/edit?tab=t.ti5ibikbyp8) proposes a $99 founding price, a later $149 one-brand price, and a $249 Partner tier. These remain ideas. Its earlier product/application concepts differ from the stricter Commercial document.
- The proposed one-brand license is worldwide, perpetual and nonexclusive, with commercial editing and marketing use. It is not the approved license for these bundles. The storefront must continue to state that license terms are pending.
- [Issue #17](https://github.com/frankstallone/skin-schema/issues/17) records the simple purchase flow: Stripe-hosted Checkout, server verification of the paid Session, and a short-lived link to a private R2 archive. The current request expands the original one-package catalog to two bundles.
- Keep Stripe in test mode. Keep the storefront out of public navigation and search indexing. Do not add a cart, accounts, email recovery, a commerce database, webhooks or release versioning.

## Deployment and purchase-flow evidence

The source audit is complete. Record the one-off Netlify preview URL, private R2 archive keys and sizes, Stripe test Products and Prices, build result, and test purchase/download results here after verification. Do not store secrets, private Apple URLs, permanent storage access URLs or bearer Checkout Session URLs in this document. A one-off preview publication does not merge or publish these changes to the production site.
