import assert from 'node:assert/strict';
import test from 'node:test';
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
          latest_charge: {
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
) {
  return verifyPurchase({ stripe, sessionId, products });
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
    throw new Error('No such checkout session');
  };

  assert.deepEqual(await verify(stripe), {
    eligible: false,
    reason: 'invalid-session',
  });
});

test('rejects a purchase without an expanded latest charge', async () => {
  const stripe = stripeFor();
  stripe.paymentIntents.retrieve = async () => ({
    livemode: false,
    status: 'succeeded',
    latest_charge: 'ch_example',
  });

  assert.deepEqual(await verify(stripe), {
    eligible: false,
    reason: 'invalid-session',
  });
});
