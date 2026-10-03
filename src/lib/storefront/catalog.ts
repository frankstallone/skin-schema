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
  frameRate: string;
  audio: string;
  colorSpace: string;
  downloadSize: string;
  downloadFilename: string;
}

/** Two collections for the private Stripe test purchase workflow. */
export const storefrontProducts = [
  {
    id: 'resort-glow',
    name: 'Resort Glow',
    description:
      'Ocean views, palms, beach walks, and quiet moments around the resort. Coastal details alongside robes and indoor rituals.',
    previewSrc: '/media/storefront/resort-glow-preview.mp4',
    posterSrc: '/media/storefront/resort-glow-poster.jpg',
    qualityNote:
      'Three clips were upscaled from sources below Full HD. Includes 5 clips also in Hotel Bathroom Glow.',
    priceLabel: '$99 USD',
    clipCount: 30,
    durationLabel: '2 minutes',
    resolution: '1080 × 1920',
    orientation: 'Vertical · 9:16',
    format: 'MP4 · H.264',
    frameRate: '29.97 fps · constant',
    audio: 'Silent · no audio tracks',
    colorSpace: 'SDR · Rec.709',
    downloadSize: '187 MB · ZIP',
    downloadFilename: 'skin-schema-resort-glow.zip',
  },
  {
    id: 'hotel-bathroom-glow',
    name: 'Hotel Bathroom Glow',
    description:
      'Robes, soft towels, shower details, and mirror routines. A collection of close-up moments from hotel bathrooms.',
    previewSrc: '/media/storefront/hotel-bathroom-glow-preview.mp4',
    posterSrc: '/media/storefront/hotel-bathroom-glow-poster.jpg',
    qualityNote:
      'Two clips were upscaled from sources below Full HD. Includes 5 clips also in Resort Glow.',
    priceLabel: '$99 USD',
    clipCount: 29,
    durationLabel: '1 minute 56 seconds',
    resolution: '1080 × 1920',
    orientation: 'Vertical · 9:16',
    format: 'MP4 · H.264',
    frameRate: '29.97 fps · constant',
    audio: 'Silent · no audio tracks',
    colorSpace: 'SDR · Rec.709',
    downloadSize: '160 MB · ZIP',
    downloadFilename: 'skin-schema-hotel-bathroom-glow.zip',
  },
] as const satisfies readonly StorefrontProduct[];

export type StorefrontProductId = (typeof storefrontProducts)[number]['id'];

export function getStorefrontProduct(
  id: string,
): StorefrontProduct | undefined {
  return storefrontProducts.find((product) => product.id === id);
}
