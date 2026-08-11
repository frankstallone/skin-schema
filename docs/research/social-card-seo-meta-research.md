# Social card and home-page metadata research

Date: 2026-08-11

## Decision

Make two practical changes: publish a 1200×630 JPEG below 500 KB, and add explicit locale, image type, and X image alt text. Add home-page-only `WebSite` and `Organization` JSON-LD. Do not invent an X account for `twitter:site`.

The image change is good defensive engineering, but the score report overstates two claims:

- No current first-party WhatsApp source found documents a 500 KB Open Graph image limit. Treat `< 500 KB` as a conservative interoperability target, not a verified WhatsApp requirement.
- 1200×630 is not an Open Graph protocol requirement. OGP defines `og:image` and optional type, width, height, and alt properties, but no required dimensions. The current 1731×909 image already has nearly the same 1.91:1 ratio as 1200×630. Resizing is still useful because it cuts transfer size without losing useful social-card resolution. [Open Graph protocol](https://ogp.me/)

Repo facts checked:

- `public/media/og-image.png` is 1,664,712 bytes and 1731×909.
- The only business social profile found is [Instagram `@skinschema`](https://www.instagram.com/skinschema/).
- No X profile or X handle is present in the repository.
- `public/apple-touch-icon.png` is a 180×180 Skin Schema logo. This clears Google's 112×112 minimum for an organization logo. [Google Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)

## Finding by issue

### Image size and dimensions

Export the existing design as `public/media/og-image.jpg` at 1200×630 and tune JPEG quality until the file is below 500 KB. JPEG is the lowest-risk format for a photographic social card. Preserve the focal content and text safe area.

The current image ratio is about 1.904:1; 1200×630 is about 1.905:1. This is effectively a resize, not a redesign or meaningful crop. OGP allows publishers to declare the image MIME type and dimensions. [Open Graph structured image properties](https://ogp.me/#structured)

Current X Ads documentation accepts a 1.91:1 website-card asset, requires at least 800 px width, and allows JPEG or PNG. This is a different X card pipeline, so it supports—but does not prove—the organic link-card recommendation. [X Ads creative image specifications](https://docs.x.com/x-ads-api/creatives)

### `og:locale`

Add `<meta property="og:locale" content="en_US" />`. It is optional, and OGP already defaults to `en_US`; adding it is explicit and satisfies the scanner without changing behavior. Use another locale only if the page's actual language/region changes. [Open Graph optional metadata](https://ogp.me/#optional)

### `twitter:site`

Do not add `twitter:site` now. It attributes the card to an X account; the repo has no Skin Schema X account to verify. `@skinschema` is verified only as an Instagram handle and must not be assumed to exist or be owned on X. Add the tag later only after the business supplies its actual X handle.

Add `twitter:image:alt`, which is currently missing. Remove `twitter:domain` and `twitter:url`: they are not needed for the summary card, while canonical URL and `og:url` already identify the page.

### Structured data

Use a small `@graph` on the canonical home page:

- `WebSite` tells Google the preferred site name. Google requires `name` and `url` for this use and says the markup belongs on the home page. [Google site-name documentation](https://developers.google.com/search/docs/appearance/site-names)
- `Organization` describes Skin Schema as the entity behind the site. Google recommends organization markup on the home page or one organization-description page, with accurate applicable fields. [Google Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)

Do not add ratings, FAQs, address, telephone, or other facts the visible site does not establish. Google says structured data must represent visible page content and must not be misleading. JSON-LD is Google's recommended format. [Google structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies), [structured data introduction](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)

A generic `WebPage` object is valid Schema.org, but it does not address the strongest Google opportunities here: site-name selection and organization disambiguation. `WebSite` plus `Organization` is more useful and still simple.

## Recommended home-page head markup

Use the page's current Astro variables in implementation; literal values below show the expected rendered HTML. Keep existing favicon, manifest, sitemap, generator, and analytics tags around this block.

```html
<meta charset="UTF-8" />
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, viewport-fit=cover"
/>
<title>Skin Schema | Premium Beauty Content for Skincare Brands</title>
<meta
  name="description"
  content="Premium short-form video, product storytelling, texture visuals, and photo sets for skincare, makeup, and wellness brands."
/>
<link rel="canonical" href="https://skinschema.com/" />
<meta name="theme-color" content="#171717" />

<meta property="og:site_name" content="Skin Schema" />
<meta property="og:locale" content="en_US" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://skinschema.com/" />
<meta
  property="og:title"
  content="Skin Schema | Premium Beauty Content for Skincare Brands"
/>
<meta
  property="og:description"
  content="Premium short-form video, product storytelling, texture visuals, and photo sets for skincare, makeup, and wellness brands."
/>
<meta property="og:image" content="https://skinschema.com/media/og-image.jpg" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta
  property="og:image:alt"
  content="Skin Schema premium beauty content for skincare brands"
/>

<meta name="twitter:card" content="summary_large_image" />
<meta
  name="twitter:title"
  content="Skin Schema | Premium Beauty Content for Skincare Brands"
/>
<meta
  name="twitter:description"
  content="Premium short-form video, product storytelling, texture visuals, and photo sets for skincare, makeup, and wellness brands."
/>
<meta
  name="twitter:image"
  content="https://skinschema.com/media/og-image.jpg"
/>
<meta
  name="twitter:image:alt"
  content="Skin Schema premium beauty content for skincare brands"
/>
<!-- Add twitter:site only when Skin Schema has a verified X handle. -->

<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://skinschema.com/#website",
        "url": "https://skinschema.com/",
        "name": "Skin Schema",
        "publisher": { "@id": "https://skinschema.com/#organization" }
      },
      {
        "@type": "Organization",
        "@id": "https://skinschema.com/#organization",
        "name": "Skin Schema",
        "url": "https://skinschema.com/",
        "description": "Premium short-form video, product storytelling, texture visuals, and photo sets for skincare, makeup, and wellness brands.",
        "logo": {
          "@type": "ImageObject",
          "url": "https://skinschema.com/apple-touch-icon.png",
          "width": 180,
          "height": 180
        },
        "sameAs": ["https://www.instagram.com/skinschema/"]
      }
    ]
  }
</script>
```

The document should continue to use `<html lang="en">`; that attribute sits outside `<head>`.

## Performance assessment

The reported 121 ms HTML response and 32 KB HTML document do not indicate a performance problem. No head-level performance rewrite is justified from those numbers. The 1.59 MiB social image is the clear optimization target because social crawlers must fetch it. After deployment, verify:

1. The new URL returns `200`, `Content-Type: image/jpeg`, and a byte size below 500 KB.
2. Rendered metadata reports 1200×630 and uses the new absolute image URL.
3. The JSON-LD passes the Schema Markup Validator; use Google URL Inspection after deployment because site-name markup is not supported by the Rich Results Test. [Google site-name testing guidance](https://developers.google.com/search/docs/appearance/site-names#test-structured-data)
