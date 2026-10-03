import assert from 'node:assert/strict';
import test from 'node:test';
import { storefrontProducts } from './catalog';
import { getStorefrontConfig } from './config';

const products = Object.fromEntries(
  storefrontProducts.map((product, index) => [
    product.id,
    {
      stripePriceId: `price_bundle${index + 1}`,
      objectKey: `archives/bundle${index + 1}.zip`,
    },
  ]),
);

function withEnvironment(overrides: Record<string, string>, run: () => void) {
  const environment = {
    STRIPE_SECRET_KEY: 'sk_test_example',
    STOREFRONT_PRODUCTS_JSON: JSON.stringify(products),
    R2_ACCOUNT_ID: 'example',
    R2_ACCESS_KEY_ID: 'example',
    R2_SECRET_ACCESS_KEY: 'example',
    R2_BUCKET: 'private-bundles',
    ...overrides,
  };
  const saved = Object.fromEntries(
    Object.keys(environment).map((key) => [key, process.env[key]]),
  );

  try {
    Object.assign(process.env, environment);
    run();
  } finally {
    for (const [key, value] of Object.entries(saved)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test('accepts secret and restricted Stripe test keys with the catalog mappings', () => {
  for (const key of ['sk_test_example', 'rk_test_example']) {
    withEnvironment({ STRIPE_SECRET_KEY: key }, () => {
      const config = getStorefrontConfig();
      assert.equal(config.stripeSecretKey, key);
      assert.deepEqual(config.products, products);
    });
  }
});

test('rejects live, public, empty, and malformed Stripe keys', () => {
  for (const key of [
    'sk_live_example',
    'rk_live_example',
    'pk_test_example',
    'sk_test_',
    '',
  ]) {
    withEnvironment({ STRIPE_SECRET_KEY: key }, () => {
      assert.throws(() => getStorefrontConfig());
    });
  }
});

test('rejects invalid, missing, and unknown product mappings', () => {
  const [firstProduct] = storefrontProducts;
  const invalidMappings = [
    'invalid json',
    '[]',
    '{}',
    JSON.stringify({ ...products, unknown: products[firstProduct.id] }),
    JSON.stringify({
      ...products,
      [firstProduct.id]: { objectKey: 'bundle.zip' },
    }),
    JSON.stringify({
      ...products,
      [firstProduct.id]: { stripePriceId: 'price_bundle1', objectKey: '' },
    }),
  ];

  for (const mapping of invalidMappings) {
    withEnvironment({ STOREFRONT_PRODUCTS_JSON: mapping }, () => {
      assert.throws(() => getStorefrontConfig());
    });
  }
});

test('rejects ambiguous price or R2 mappings across bundles', () => {
  for (const duplicate of ['stripePriceId', 'objectKey'] as const) {
    const invalid = structuredClone(products);
    const [first, second] = Object.keys(invalid);
    assert.ok(second, 'This contract requires more than one catalog bundle.');
    invalid[second][duplicate] = invalid[first][duplicate];

    withEnvironment(
      { STOREFRONT_PRODUCTS_JSON: JSON.stringify(invalid) },
      () => {
        assert.throws(() => getStorefrontConfig());
      },
    );
  }
});
