export interface StorefrontProduct {
  id: string;
  name: string;
  priceLabel: string;
  clipCount: number;
  durationLabel: string;
  resolution: string;
  orientation: string;
  format: string;
  downloadSize: string;
  downloadFilename: string;
}

/** The only package available in the first storefront release. */
export const storefrontProducts = [
  {
    id: 'bathroom-rituals',
    name: 'Bathroom Rituals',
    priceLabel: '$24 USD',
    clipCount: 1,
    durationLabel: '22 seconds',
    resolution: 'HD · 720 × 1280',
    orientation: 'Vertical',
    format: 'MP4',
    downloadSize: '7.7 MB',
    downloadFilename: 'skin-schema-bathroom-rituals-poc.mp4',
  },
] as const satisfies readonly StorefrontProduct[];

export type StorefrontProductId = (typeof storefrontProducts)[number]['id'];

export function getStorefrontProduct(
  id: string,
): StorefrontProduct | undefined {
  return storefrontProducts.find((product) => product.id === id);
}
