export interface StorefrontProduct {
  id: string;
  name: string;
  description: string;
  previewSrc: string;
  posterSrc: string;
  qualityNote: string;
  priceLabel: string;
  clipCount: number;
  durationLabel: string;
  resolution: string;
  orientation: string;
  format: string;
  downloadSize: string;
  downloadFilename: string;
}

/** Provisional bundles for the private Stripe test purchase workflow. */
export const storefrontProducts = [
  {
    id: 'bathroom-rituals',
    name: 'Bathroom Rituals',
    description:
      'Water, soft towels, robes, and quiet moments at the mirror. A collection of everyday bathroom rituals.',
    previewSrc: '/media/storefront/bathroom-rituals-preview.mp4',
    posterSrc: '/media/storefront/bathroom-rituals-poster.jpg',
    qualityNote:
      'Mixed source sizes: 8 portrait 4K clips, 18 Full HD clips, and 4 cropped clips. Files retain their downloaded quality.',
    priceLabel: '$99 USD',
    clipCount: 30,
    durationLabel: '1 minute 58 seconds',
    resolution: 'Mixed · up to 2160 × 3840',
    orientation: 'Vertical',
    format: 'MOV · H.264 / HEVC',
    downloadSize: '671 MB',
    downloadFilename: 'skin-schema-bathroom-rituals.zip',
  },
  {
    id: 'coastal-skin',
    name: 'Coastal Skin',
    description:
      'Ocean light, slow beach days, and sunlit resort details. A collection of coastal atmosphere and summer routines.',
    previewSrc: '/media/storefront/coastal-skin-preview.mp4',
    posterSrc: '/media/storefront/coastal-skin-poster.jpg',
    qualityNote:
      'Mixed source sizes: 1 portrait 4K clip, 30 Full HD clips, and 3 cropped clips. Includes 7 clips also in Bathroom Rituals.',
    priceLabel: '$99 USD',
    clipCount: 34,
    durationLabel: '2 minutes 23 seconds',
    resolution: 'Mixed · up to 2160 × 3840',
    orientation: 'Vertical',
    format: 'MOV / MP4 · H.264 / HEVC',
    downloadSize: '504 MB',
    downloadFilename: 'skin-schema-coastal-skin.zip',
  },
] as const satisfies readonly StorefrontProduct[];

export type StorefrontProductId = (typeof storefrontProducts)[number]['id'];

export function getStorefrontProduct(
  id: string,
): StorefrontProduct | undefined {
  return storefrontProducts.find((product) => product.id === id);
}
