import { storefrontProducts } from './catalog';

export interface StorefrontProductConfig {
  stripePriceId: string;
  objectKey: string;
}

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }

  return value;
}

function getProductConfig(): Record<string, StorefrontProductConfig> {
  let parsed: unknown;

  try {
    parsed = JSON.parse(required('STOREFRONT_PRODUCTS_JSON'));
  } catch {
    throw new Error(
      'STOREFRONT_PRODUCTS_JSON must contain a valid product map.',
    );
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(
      'STOREFRONT_PRODUCTS_JSON must contain a valid product map.',
    );
  }

  const configured = parsed as Record<string, unknown>;
  const prices = new Set<string>();
  const objectKeys = new Set<string>();
  const entries = storefrontProducts.map((product) => {
    const value = configured[product.id];

    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error(`Missing storefront configuration for ${product.id}.`);
    }

    const { stripePriceId, objectKey } = value as Record<string, unknown>;
    if (
      typeof stripePriceId !== 'string' ||
      !/^price_[A-Za-z0-9_]+$/.test(stripePriceId) ||
      typeof objectKey !== 'string' ||
      !objectKey.trim() ||
      prices.has(stripePriceId) ||
      objectKeys.has(objectKey)
    ) {
      throw new Error(`Invalid storefront configuration for ${product.id}.`);
    }

    prices.add(stripePriceId);
    objectKeys.add(objectKey);
    return [product.id, { stripePriceId, objectKey }] as const;
  });

  if (Object.keys(configured).length !== storefrontProducts.length) {
    throw new Error('STOREFRONT_PRODUCTS_JSON must match the current catalog.');
  }

  return Object.fromEntries(entries);
}

export function getStorefrontConfig() {
  const stripeSecretKey = required('STRIPE_SECRET_KEY');
  if (!/^(sk|rk)_test_[A-Za-z0-9]+$/.test(stripeSecretKey)) {
    throw new Error('The storefront requires a Stripe test secret key.');
  }

  const accountId = required('R2_ACCOUNT_ID');

  return {
    stripeSecretKey,
    products: getProductConfig(),
    r2: {
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: required('R2_ACCESS_KEY_ID'),
        secretAccessKey: required('R2_SECRET_ACCESS_KEY'),
      },
      bucket: required('R2_BUCKET'),
    },
  };
}
