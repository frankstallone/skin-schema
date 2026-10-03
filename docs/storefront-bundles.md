# Storefront bundle handoff

Updated October 3, 2026. The Shared Albums **B Roll Resort Glow** and **B Roll Hotel Bathroom Glow** define the current offer. They replace the earlier provisional bundle selection. This is an unlisted Stripe test storefront with download archives in private R2 storage.

## Current offer

| Package ID            | Approved name       | Delivered clips | Provisional test price |
| --------------------- | ------------------- | --------------: | ---------------------- |
| `resort-glow`         | Resort Glow         |              30 | $99 USD                |
| `hotel-bathroom-glow` | Hotel Bathroom Glow |              29 | $99 USD                |

The names and album selections come from the user. Prices and commercial license terms remain pending. The $99 price is an earlier founding-price hypothesis, not evidence of buyer demand or an approved sale price. Test Checkout takes no real payment and grants no commercial usage rights.

Five clips occur in both collections, giving 54 unique delivery files across 59 bundle entries. The current albums determine membership; earlier 30- and 34-file batches are source archives, not the current offer. The new filenames run from `skin-schema-resort-glow-001.mp4` through `-030.mp4` and `skin-schema-hotel-bathroom-glow-001.mp4` through `-029.mp4`. Each bundle follows capture-date order, with filenames breaking ties. The preview numbers match those filenames.

## Source selection

All 59 files exported from these Shared Albums were 720 × 1280. They were retained as selection references. Every delivery instead uses a matching higher-resolution file from the NAS or the earlier local source archive.

A separate NAS task recovered seven exact camera originals for Hotel Bathroom Glow. Matching used capture timestamps, every selected frame, visual comparisons, and archived Photos adjustments. The originals were trimmed to the selected intervals. The shower-door clip also retains its crop and straightening; that crop leaves 992 × 1762 pixels. The remaining 52 bundle entries use matching earlier exports. Those exports were compared against the Shared Album selections by duration, sampled-frame correlation, and visual review.

| Source image area used for delivery | Resort Glow | Hotel Bathroom Glow | Total entries |
| ----------------------------------- | ----------: | ------------------: | ------------: |
| Larger than Full HD; downscaled     |           1 |                   9 |            10 |
| Full HD; no enlargement             |          26 |                  18 |            44 |
| Smaller than Full HD; upscaled      |           3 |                   2 |             5 |
| Recovered NAS camera originals      |           0 |                   7 |             7 |

The upscale row counts preserved source image areas, including crops. Resort Glow clips 005, 008 and 012 use 862 × 1532, 1022 × 1820 and 928 × 1650 areas. Hotel Bathroom Glow clips 004 and 010 use 992 × 1762 and 890 × 1582 areas. The store and ZIP READMEs disclose these counts. Normalizing their dimensions cannot recover missing source detail.

No better Resort Glow originals were confirmed in readable NAS locations. The search encountered a restricted Dropbox backup and five unreadable recent camera files; two 4K Photos records had missing media. These limits are recorded in the NAS handoff. The NAS files and permissions were not changed.

Source evidence and preserved media:

- [Current delivery and evidence folder](</Users/starlord/Movies/Skin Schema Storefront/2026-10-03/glow-bundles>)
- [Shared Album inventory](</Users/starlord/Movies/Skin Schema Storefront/2026-10-03/glow-bundles/shared-albums/inventory.json>) and [local source matches](</Users/starlord/Movies/Skin Schema Storefront/2026-10-03/glow-bundles/local-source-matches.json>)
- [NAS handoff](</Users/starlord/Movies/Skin Schema Storefront/2026-10-03/glow-bundles/nas-handoff.md>), [NAS match manifest](</Users/starlord/Movies/Skin Schema Storefront/2026-10-03/glow-bundles/nas-matches.json>), and [copied camera originals](</Users/starlord/Movies/Skin Schema Storefront/2026-10-03/glow-bundles/nas-originals>)
- [Earlier source archive](</Users/starlord/Movies/Skin Schema Storefront/2026-10-02>) and [previous bundle handoff](</Users/starlord/Movies/Skin Schema Storefront/2026-10-03/glow-bundles/previous-storefront-handoff.md>)

## Delivery and quality

Every clip is a silent MP4 containing H.264 High Profile video at 1080 × 1920, 9:16, square pixels, progressive 29.97 fps (`30000/1001`), 8-bit 4:2:0, and SDR Rec.709. Delivered clips have no added preview watermark. Each ZIP includes the clips, a `clip-index.csv`, and a test-only README. The index separates the selection, source, and delivery hashes and records source frame intervals and enlargement.

| Fact                | Resort Glow                     | Hotel Bathroom Glow             |
| ------------------- | ------------------------------- | ------------------------------- |
| Delivered clips     | 30                              | 29                              |
| Decoded frames      | 3,604                           | 3,487                           |
| Total runtime       | 120.253467 seconds              | 116.349567 seconds              |
| Individual runtimes | 1.735067–7.640967 seconds       | 1.601600–11.778433 seconds      |
| ZIP size            | 186,898,443 bytes; about 187 MB | 160,079,484 bytes; about 160 MB |

FFmpeg uses libx264 at CRF 14 with the veryslow preset. Four representative comparisons showed lower compression loss than the prior CRF 16 slow exports. Full-clip VMAF, SSIM and PSNR comparisons use the selected source after the same normalization filters. These measurements assess encoding loss, not camera quality or recovered detail. [Quality comparison](</Users/starlord/Movies/Skin Schema Storefront/2026-10-03/glow-bundles/quality-samples/decision.json>).

Across all 54 exports, per-clip mean VMAF ranges from 94.027 to 99.946, and mean SSIM ranges from 0.998645 to 0.999581. All 59 bundle entries were visually reviewed in contact sheets, and all seven NAS substitutions were compared with their Shared Album references. [Quality and visual-review summary](</Users/starlord/Movies/Skin Schema Storefront/2026-10-03/glow-bundles/quality-summary.json>).

Source-specific transfer and range conversion produces Rec.709 with limited-range signaling. Five sources with unspecified transfer metadata use the documented Rec.709 assumption. No player-specific gamma adjustment or creative grade was added. Source highlight headroom is retained; this is not a broadcast-legalization pass.

Rotation is baked into the pixels. Scaling uses Lanczos. All 6,419 unique selected source pictures remain in order. Each export starts at PTS zero and advances by 1,001 ticks in a 30,000 Hz time base. The movie header also uses 30,000 Hz to avoid millisecond rounding of clip duration. Per-file encoding commands and checks are in [normalized-files.json](</Users/starlord/Movies/Skin Schema Storefront/2026-10-03/glow-bundles/normalized-files.json>). The [bundle manifest](</Users/starlord/Movies/Skin Schema Storefront/2026-10-03/glow-bundles/bundle-manifest.json>) maps all 59 entries to the 54 unique exports.

Both preview reels were rebuilt from these final files. Every clip appears in order, with a Skin Schema watermark and matching three-digit number. Preview encoding uses CRF 20 with the medium preset; purchased clips use the higher-quality delivery settings above. [Preview manifest](</Users/starlord/Movies/Skin Schema Storefront/2026-10-03/glow-bundles/preview-manifest.json>).

| Preview             | Frames | Runtime           |
| ------------------- | ------ | ----------------- |
| resort-glow         | 1,338  | 44.644600 seconds |
| hotel-bathroom-glow | 1,286  | 42.909533 seconds |

## Test deployment

Review URL: [Skin Schema preview store](https://f4-storefront-video-bundles--skinschema.netlify.app/store/).

The branch is `f4/storefront-video-bundles`. The storefront remains absent from site navigation and the sitemap, and its pages use `noindex, nofollow`. The new catalog replaces the earlier bundle IDs. The branch-specific `STOREFRONT_PRODUCTS_JSON` maps the two current IDs to the Price/object pairs below. Production promotion and commercial launch require separate review; production was not changed by this update.

| Bundle              | R2 object in `skin-schema-storefront-poc` | Stripe test Price                |
| ------------------- | ----------------------------------------- | -------------------------------- |
| Resort Glow         | `bundles/resort-glow.zip`                 | `price_1UMXntLpq8LY8QJOoDzYeWP6` |
| Hotel Bathroom Glow | `bundles/hotel-bathroom-glow.zip`         | `price_1UMXntLpq8LY8QJO9no4WuYO` |

Stripe Product IDs are `prod_skin_schema_resort_glow_test` and `prod_skin_schema_hotel_bathroom_glow_test`. Each Price is a one-time 9,900 USD cents. Their descriptions state the correct clip count and delivery format, with the provisional price and test-only usage restrictions. Earlier test products, payments, source archives and previous R2 downloads are retained as historical records; the current catalog does not route to them.

| Archive             | SHA-256                                                            |
| ------------------- | ------------------------------------------------------------------ |
| Resort Glow         | `d2b6e268177ba629b90ce0b364573d489ae999b02c64b58ef585ced8f3d2e8cb` |
| Hotel Bathroom Glow | `85faa3fd7ea51ee27f6fa40ea8497728d61c25ef89eadc3bbdf5e36777afcd26` |

The installation verified both staged archives before publishing either new canonical R2 object. It then read both canonical objects back in full and compared their sizes and SHA-256 hashes. Temporary staging objects and the installation helper were removed. [Remote installation receipt](</Users/starlord/Movies/Skin Schema Storefront/2026-10-03/glow-bundles/remote-installation-receipt.json>).

## Verification

- All 54 unique exports passed full decode, frame-count, every-frame timing, geometry, square-pixel, progressive-scan, codec, color, rotation, fast-start, and zero-audio checks. Container, bitstream, and decoded-frame color descriptions agree. H.264 reference-frame and buffer limits fit Level 4.1.
- Both ZIPs passed CRC integrity checks, and every delivered clip's SHA-256 matches its verification record. All 59 entries map to the intended Shared Album selection. Both complete R2 read-backs match the local archive hashes above.
- Both preview reels passed full decode, frame count, every-frame timing, Rec.709 color, and silent-audio checks. Every preview part records its matching source and delivery hash.
- `npm test` passed all 33 tests, including both renamed products, purchase authorization, the exact 24-hour boundary, replacement-token rotation, malformed settings, refund/dispute restrictions, and R2 deadline limits. `npm run build` passed with zero Astro errors, warnings, or hints.
- The Netlify adapter does not support `astro preview`. Browser playback, responsive layout, console checks, test purchases, full buyer downloads, and the final deployment identity are recorded in the [completion report](</Users/starlord/Movies/Skin Schema Storefront/2026-10-03/glow-bundles/completion-report.json>). Buyer downloads and their hash receipts are retained in [buyer-downloads](</Users/starlord/Movies/Skin Schema Storefront/2026-10-03/glow-bundles/buyer-downloads>).

For manual testing, open the branch storefront and choose either test Checkout. Use Stripe's `4242 4242 4242 4242` test card, a future expiration date, a three-digit CVC, and a test email. Disable saving payment information. Download within 24 hours of the successful charge. After that window, contact `glow@skinschema.com` from the Checkout email address to request another timed link. A test purchase grants no commercial usage rights.

## Download expiry and manual replacements

The initial purchase page and download route expire 24 hours after Stripe's successful charge was created. Refreshing the page does not extend that deadline. The page displays its deadline in UTC and directs buyers to `glow@skinschema.com` for later downloads. An expired download route returns `410 Gone` without an R2 redirect.

A replacement uses a new random token and an explicit deadline stored on the payment's **PaymentIntent metadata**. It replaces the initial access window completely. Old purchase-page links stay invalid, even while the original 24-hour window would otherwise remain open. Refund and dispute restrictions still apply. Previously issued R2 links remain usable until their own expiry, which is at most five minutes; a download already in progress or a saved file cannot be recalled.

To handle a support request:

1. Find the payment in the Stripe Dashboard. Match the sender to the email in **Checkout summary**, verify the purchased bundle and successful payment, and check for a full refund or dispute. The current deployment accepts only Sandbox payments.
2. Find the matching Checkout Session ID in the payment's **A Checkout Session was completed** event or the `/v1/payment_pages/cs_test_…/confirm` log. Keep that ID private. Do not reuse a different buyer's session.
3. Generate 32 cryptographically random bytes and encode them as 64 lowercase hexadecimal characters. Hash the **UTF-8 text of those 64 characters**, without a trailing newline, using SHA-256. Keep the raw token only for the new buyer URL; store its 64-character lowercase hash in Stripe. Codex can prepare these values and the URL for the owner without adding an operator command to the site.
4. In the payment's **Metadata** editor, preserve unrelated entries and set both fields below. Use a deadline 24 hours from issuance for an ordinary replacement. The deadline must be an explicit UTC timestamp such as `2026-10-05T12:00:00Z`; a timezone-free date is rejected.

| PaymentIntent metadata key         | Value                                                                         |
| ---------------------------------- | ----------------------------------------------------------------------------- |
| `storefront_download_token_sha256` | SHA-256 of the new 64-character token text                                    |
| `storefront_download_expires_at`   | UTC expiration in `YYYY-MM-DDTHH:mm:ssZ` or `YYYY-MM-DDTHH:mm:ss.sssZ` format |

5. Build the replacement URL on the deployed storefront origin: `/store/success?session_id=<matching Checkout Session ID>&access_token=<new raw token>`. Check that it shows the correct bundle and deadline, and that the old purchase-page URL no longer offers a download. Send the replacement only to the verified purchase email.
6. For another replacement, rotate the token and update the deadline together. **Keep these metadata fields after expiry.** Deleting both can restore any time remaining in the original 24-hour window. A missing, invalid or incorrect replacement token never falls back to initial access.

Edit the PaymentIntent's metadata, not only the Charge metadata: Stripe copies PaymentIntent metadata to a Charge once, and later updates are not synchronized. See [Stripe's metadata documentation](https://docs.stripe.com/metadata). R2 signed URLs can be reused until they expire; see [Cloudflare's presigned URL documentation](https://developers.cloudflare.com/r2/api/s3/presigned-urls/). Timed links limit ongoing access but do not prevent copying an already downloaded archive.

Do not commit secrets, private Apple URLs, signed download URLs, or bearer Checkout Session URLs.
