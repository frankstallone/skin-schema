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
      'Three clips were upscaled from smaller source files. Includes 7 clips also in Coastal Skin.',
    priceLabel: '$99 USD',
    clipCount: 30,
    durationLabel: '1 minute 58 seconds',
    resolution: '1080 × 1920 · Full HD',
    orientation: 'Vertical · 9:16',
    format: 'MP4 · H.264',
    frameRate: '29.97 fps · constant',
    audio: 'Silent · no audio tracks',
    colorSpace: 'SDR · Rec.709',
    downloadSize: '111 MB · ZIP',
    downloadFilename: 'skin-schema-bathroom-rituals.zip',
  },
  {
    id: 'coastal-skin',
    name: 'Coastal Skin',
    description:
      'Ocean light, slow beach days, and sunlit resort details, alongside quiet bathroom and indoor rituals.',
    previewSrc: '/media/storefront/coastal-skin-preview.mp4',
    posterSrc: '/media/storefront/coastal-skin-poster.jpg',
    qualityNote:
      'Three clips were upscaled from smaller source files. Includes 7 clips also in Bathroom Rituals.',
    priceLabel: '$99 USD',
    clipCount: 34,
    durationLabel: '2 minutes 23 seconds',
    resolution: '1080 × 1920 · Full HD',
    orientation: 'Vertical · 9:16',
    format: 'MP4 · H.264',
    frameRate: '29.97 fps · constant',
    audio: 'Silent · no audio tracks',
    colorSpace: 'SDR · Rec.709',
    downloadSize: '191 MB · ZIP',
    downloadFilename: 'skin-schema-coastal-skin.zip',
  },
] as const satisfies readonly StorefrontProduct[];

export type StorefrontProductId = (typeof storefrontProducts)[number]['id'];

export function getStorefrontProduct(
  id: string,
): StorefrontProduct | undefined {
  return storefrontProducts.find((product) => product.id === id);
}
