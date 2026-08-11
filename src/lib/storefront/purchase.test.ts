import assert from 'node:assert/strict';
import test from 'node:test';
import { getStorefrontProduct, type StorefrontProduct } from './catalog';
import { verifyPurchase, type StorefrontStripeClient } from './purchase';

const product: StorefrontProduct = (() => {
  const demoProduct = getStorefrontProduct('bathroom-rituals');
  if (!demoProduct) throw new Error('Expected storefront demo product.');
  return demoProduct;
})();

function stripeFor({
  paymentStatus = 'paid',
  priceId = 'price_demo',
  refunded = false,
  amountRefunded = 0,
}: {
  paymentStatus?: string;
  priceId?: string;
  refunded?: boolean;
  amountRefunded?: number;
} = {}): StorefrontStripeClient {
  return {
    checkout: {
      sessions: {
        async retrieve(sessionId) {
          return {
            id: sessionId,
            payment_status: paymentStatus,
            payment_intent: 'pi_demo',
          };
        },
        async listLineItems() {
          return { data: [{ price: priceId, quantity: 1 }] };
        },
      },
    },
    paymentIntents: {
      async retrieve() {
        return {
          latest_charge: {
            amount: 2400,
            amount_refunded: amountRefunded,
            refunded,
          },
        };
      },
    },
  };
}

async function verify(stripe: StorefrontStripeClient) {
  return verifyPurchase({
    stripe,
    sessionId: 'cs_test_demo',
    product,
    stripePriceId: 'price_demo',
  });
}

test('authorizes a paid Checkout Session with the configured price', async () => {
  assert.deepEqual(await verify(stripeFor()), {
    eligible: true,
    sessionId: 'cs_test_demo',
    product,
  });
});

test('rejects unpaid Checkout Sessions', async () => {
  assert.deepEqual(await verify(stripeFor({ paymentStatus: 'unpaid' })), {
    eligible: false,
    reason: 'unpaid',
  });
});

test('rejects a paid Checkout Session with a different price', async () => {
  assert.deepEqual(await verify(stripeFor({ priceId: 'price_other' })), {
    eligible: false,
    reason: 'wrong-price',
  });
});

test('rejects a Checkout Session with extra line items', async () => {
  const stripe = stripeFor();
  stripe.checkout.sessions.listLineItems = async () => ({
    data: [
      { price: 'price_demo', quantity: 1 },
      { price: 'price_other', quantity: 1 },
    ],
  });

  assert.deepEqual(await verify(stripe), {
    eligible: false,
    reason: 'wrong-price',
  });
});

test('rejects fully refunded payments and permits partial refunds', async () => {
  assert.deepEqual(await verify(stripeFor({ refunded: true })), {
    eligible: false,
    reason: 'fully-refunded',
  });

  assert.equal(
    (await verify(stripeFor({ amountRefunded: 1200 }))).eligible,
    true,
  );
});

test('rejects a malformed or unknown Stripe Checkout Session', async () => {
  const stripe = stripeFor();
  stripe.checkout.sessions.retrieve = async () => {
    throw new Error('No such checkout session');
  };

  assert.deepEqual(await verify(stripe), {
    eligible: false,
    reason: 'invalid-session',
  });
});

test('rejects a purchase when Stripe does not expand the latest charge', async () => {
  const stripe = stripeFor();
  stripe.paymentIntents.retrieve = async () => ({ latest_charge: 'ch_demo' });

  assert.deepEqual(await verify(stripe), {
    eligible: false,
    reason: 'invalid-session',
  });
});
