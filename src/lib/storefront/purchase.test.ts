import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test, { afterEach, beforeEach, mock } from 'node:test';
import { storefrontProducts } from './catalog';
import type { StorefrontProductConfig } from './config';
import { verifyPurchase, type StorefrontStripeClient } from './purchase';

const products: Record<string, StorefrontProductConfig> = Object.fromEntries(
  storefrontProducts.map((product, index) => [
    product.id,
    {
      stripePriceId: `price_bundle${index + 1}`,
      objectKey: `archives/bundle${index + 1}.zip`,
    },
  ]),
);
const firstProduct = storefrontProducts[0];
const firstConfig = products[firstProduct.id];
const paidAt = Date.parse('2026-10-03T12:00:00Z') / 1000;
const replacementToken = 'a'.repeat(64);
const replacementMetadata = {
  storefront_download_token_sha256: createHash('sha256')
    .update(replacementToken)
    .digest('hex'),
  storefront_download_expires_at: '2026-10-05T12:00:00Z',
};

beforeEach(() => {
  mock.timers.enable({ apis: ['Date'], now: paidAt * 1000 });
});

afterEach(() => mock.timers.reset());

function stripeFor({
  paymentStatus = 'paid',
  priceId = firstConfig.stripePriceId,
  quantity = 1,
  refunded = false,
  amountRefunded = 0,
  disputed = false,
  liveSession = false,
  liveIntent = false,
  liveCharge = false,
  chargeCreated = paidAt,
  intentMetadata = {},
}: {
  paymentStatus?: string;
  priceId?: string;
  quantity?: number;
  refunded?: boolean;
  amountRefunded?: number;
  disputed?: boolean;
  liveSession?: boolean;
  liveIntent?: boolean;
  liveCharge?: boolean;
  chargeCreated?: number;
  intentMetadata?: Record<string, string>;
} = {}): StorefrontStripeClient {
  return {
    checkout: {
      sessions: {
        async retrieve(sessionId) {
          return {
            id: sessionId,
            livemode: liveSession,
            mode: 'payment',
            status: 'complete',
            payment_status: paymentStatus,
            payment_intent: 'pi_example',
            client_reference_id: firstProduct.id,
            metadata: { storefrontProductId: firstProduct.id },
          };
        },
        async listLineItems() {
          return {
            data: [{ price: { id: priceId }, quantity }],
            has_more: false,
          };
        },
      },
    },
    paymentIntents: {
      async retrieve() {
        return {
          livemode: liveIntent,
          status: 'succeeded',
          metadata: intentMetadata,
          latest_charge: {
            created: chargeCreated,
            amount: 2400,
            amount_refunded: amountRefunded,
            refunded,
            disputed,
            livemode: liveCharge,
            status: 'succeeded',
          },
        };
      },
    },
  };
}

async function verify(
  stripe: StorefrontStripeClient,
  sessionId = 'cs_test_purchase',
  accessToken?: string,
) {
  return verifyPurchase({ stripe, sessionId, products, accessToken });
}

for (const product of storefrontProducts) {
  test(`authorizes only the purchased ${product.name} bundle and its R2 object`, async () => {
    const config = products[product.id];
    assert.deepEqual(
      await verify(stripeFor({ priceId: config.stripePriceId })),
      {
        eligible: true,
        sessionId: 'cs_test_purchase',
        product,
        objectKey: config.objectKey,
        accessExpiresAt: Date.parse('2026-10-04T12:00:00Z') / 1000,
      },
    );
  });
}

test('rejects unpaid Checkout Sessions, including free checkouts', async () => {
  for (const paymentStatus of ['unpaid', 'no_payment_required']) {
    assert.deepEqual(await verify(stripeFor({ paymentStatus })), {
      eligible: false,
      reason: 'unpaid',
    });
  }
});

test('rejects unknown prices and purchases outside the single-bundle contract', async () => {
  const cases = [
    { data: [{ price: 'price_unknown', quantity: 1 }], has_more: false },
    {
      data: [{ price: firstConfig.stripePriceId, quantity: 2 }],
      has_more: false,
    },
    { data: [], has_more: false },
    {
      data: [
        { price: firstConfig.stripePriceId, quantity: 1 },
        { price: 'price_extra', quantity: 1 },
      ],
      has_more: false,
    },
    {
      data: [{ price: firstConfig.stripePriceId, quantity: 1 }],
      has_more: true,
    },
  ];

  for (const lineItems of cases) {
    const stripe = stripeFor();
    stripe.checkout.sessions.listLineItems = async () => lineItems;
    assert.deepEqual(await verify(stripe), {
      eligible: false,
      reason: 'wrong-price',
    });
  }
});

test('rejects fully refunded payments and permits partial refunds', async () => {
  for (const refund of [{ refunded: true }, { amountRefunded: 2400 }]) {
    assert.deepEqual(await verify(stripeFor(refund)), {
      eligible: false,
      reason: 'fully-refunded',
    });
  }

  assert.equal(
    (await verify(stripeFor({ amountRefunded: 1200 }))).eligible,
    true,
  );
});

test('rejects disputed payments', async () => {
  assert.deepEqual(await verify(stripeFor({ disputed: true })), {
    eligible: false,
    reason: 'disputed',
  });
});

test('rejects live and malformed session IDs before calling Stripe', async () => {
  const stripe = stripeFor();
  let lookups = 0;
  stripe.checkout.sessions.retrieve = async () => {
    lookups++;
    throw new Error('Unexpected Stripe lookup');
  };

  for (const sessionId of ['cs_live_purchase', 'cs_test_', 'invalid']) {
    assert.deepEqual(await verify(stripe, sessionId), {
      eligible: false,
      reason: 'invalid-session',
    });
  }
  assert.equal(lookups, 0);
});

test('rejects live Stripe sessions, payment intents, and charges', async () => {
  for (const mode of [
    { liveSession: true },
    { liveIntent: true },
    { liveCharge: true },
  ]) {
    assert.deepEqual(await verify(stripeFor(mode)), {
      eligible: false,
      reason: 'not-test-mode',
    });
  }
});

test('rejects an unknown Stripe Checkout Session', async () => {
  const stripe = stripeFor();
  stripe.checkout.sessions.retrieve = async () => {
    throw Object.assign(new Error('No such checkout session'), {
      code: 'resource_missing',
    });
  };

  assert.deepEqual(await verify(stripe), {
    eligible: false,
    reason: 'invalid-session',
  });
});

test('propagates temporary Stripe lookup failures for retry handling', async () => {
  const stripe = stripeFor();
  const failure = new Error('Stripe connection interrupted');
  stripe.checkout.sessions.retrieve = async () => {
    throw failure;
  };

  await assert.rejects(verify(stripe), (error) => error === failure);
});

test('rejects a purchase without an expanded latest charge', async () => {
  const stripe = stripeFor();
  stripe.paymentIntents.retrieve = async () => ({
    livemode: false,
    status: 'succeeded',
    metadata: {},
    latest_charge: 'ch_example',
  });

  assert.deepEqual(await verify(stripe), {
    eligible: false,
    reason: 'invalid-session',
  });
});

test('purchase access expires exactly 24 hours after the charge and cannot refresh itself', async () => {
  const stripe = stripeFor();
  mock.timers.setTime(Date.parse('2026-10-04T11:59:59Z'));
  assert.equal((await verify(stripe)).eligible, true);

  mock.timers.tick(1000);
  assert.deepEqual(await verify(stripe), {
    eligible: false,
    reason: 'expired',
  });

  mock.timers.tick(60_000);
  assert.deepEqual(await verify(stripe), {
    eligible: false,
    reason: 'expired',
  });
});

test('replacement access requires the current token and expires at its stored deadline', async () => {
  const stripe = stripeFor({ intentMetadata: replacementMetadata });
  mock.timers.setTime(Date.parse('2026-10-05T11:59:59Z'));

  for (const token of [undefined, 'b'.repeat(64)]) {
    assert.deepEqual(await verify(stripe, 'cs_test_purchase', token), {
      eligible: false,
      reason: 'invalid-session',
    });
  }

  const purchase = await verify(stripe, 'cs_test_purchase', replacementToken);
  assert.ok(purchase.eligible);
  assert.equal(
    purchase.accessExpiresAt,
    Date.parse('2026-10-05T12:00:00Z') / 1000,
  );

  mock.timers.tick(1000);
  assert.deepEqual(await verify(stripe, 'cs_test_purchase', replacementToken), {
    eligible: false,
    reason: 'expired',
  });
});

test('rotating replacement access invalidates old links without reopening the original page', async () => {
  const metadata = { ...replacementMetadata };
  const stripe = stripeFor({ intentMetadata: metadata });
  assert.equal(
    (await verify(stripe, 'cs_test_purchase', replacementToken)).eligible,
    true,
  );

  const newToken = 'b'.repeat(64);
  metadata.storefront_download_token_sha256 = createHash('sha256')
    .update(newToken)
    .digest('hex');

  for (const token of [undefined, replacementToken]) {
    assert.deepEqual(await verify(stripe, 'cs_test_purchase', token), {
      eligible: false,
      reason: 'invalid-session',
    });
  }
  assert.equal(
    (await verify(stripe, 'cs_test_purchase', newToken)).eligible,
    true,
  );
});

test('incomplete or malformed replacement settings never fall back to initial access', async () => {
  const cases: Record<string, string>[] = [
    {
      storefront_download_token_sha256:
        replacementMetadata.storefront_download_token_sha256,
    },
    {
      storefront_download_expires_at:
        replacementMetadata.storefront_download_expires_at,
    },
    { ...replacementMetadata, storefront_download_token_sha256: 'invalid' },
    { ...replacementMetadata, storefront_download_expires_at: 'invalid' },
    {
      ...replacementMetadata,
      storefront_download_expires_at: '2026-10-05T12:00:00',
    },
    {
      ...replacementMetadata,
      storefront_download_expires_at: '2027-02-31T12:00:00Z',
    },
    {
      ...replacementMetadata,
      storefront_download_expires_at: '2026-10-05T24:00:00Z',
    },
    { ...replacementMetadata, storefront_download_expires_at: '' },
  ];

  for (const intentMetadata of cases) {
    assert.deepEqual(
      await verify(
        stripeFor({ intentMetadata }),
        'cs_test_purchase',
        replacementToken,
      ),
      { eligible: false, reason: 'invalid-session' },
    );
  }

  assert.deepEqual(
    await verify(stripeFor(), 'cs_test_purchase', replacementToken),
    { eligible: false, reason: 'invalid-session' },
  );
});

test('replacement access does not override refund or dispute restrictions', async () => {
  for (const [state, reason] of [
    [{ refunded: true }, 'fully-refunded'],
    [{ disputed: true }, 'disputed'],
  ] as const) {
    assert.deepEqual(
      await verify(
        stripeFor({ ...state, intentMetadata: replacementMetadata }),
        'cs_test_purchase',
        replacementToken,
      ),
      { eligible: false, reason },
    );
  }
});
