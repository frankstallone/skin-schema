function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }

  return value;
}

export function getStorefrontConfig() {
  const accountId = required('R2_ACCOUNT_ID');

  return {
    stripeSecretKey: required('STRIPE_SECRET_KEY'),
    stripePriceId: required('STOREFRONT_STRIPE_PRICE_ID'),
    r2: {
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: required('R2_ACCESS_KEY_ID'),
        secretAccessKey: required('R2_SECRET_ACCESS_KEY'),
      },
      bucket: required('R2_BUCKET'),
      objectKey: required('STOREFRONT_R2_OBJECT_KEY'),
    },
  };
}
