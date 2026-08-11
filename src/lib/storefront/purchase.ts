import type { StorefrontProduct } from './catalog';

type CheckoutSession = {
  id: string;
  payment_status: string;
  payment_intent: string | { id: string } | null;
};

type LineItem = {
  price: string | { id: string } | null;
  quantity: number | null;
};

type PaymentIntent = {
  latest_charge:
    | string
    | { amount: number; amount_refunded: number; refunded: boolean }
    | null;
};

export interface StorefrontStripeClient {
  checkout: {
    sessions: {
      retrieve(sessionId: string): Promise<CheckoutSession>;
      listLineItems(
        sessionId: string,
        options: { limit: number },
      ): Promise<{
        data: LineItem[];
      }>;
    };
  };
  paymentIntents: {
    retrieve(
      paymentIntentId: string,
      options: { expand: string[] },
    ): Promise<PaymentIntent>;
  };
}

export type PurchaseVerification =
  | { eligible: true; sessionId: string; product: StorefrontProduct }
  | {
      eligible: false;
      reason: 'unpaid' | 'wrong-price' | 'fully-refunded' | 'invalid-session';
    };

function stripeId(value: string | { id: string } | null): string | undefined {
  return typeof value === 'string' ? value : value?.id;
}

export async function verifyPurchase({
  stripe,
  sessionId,
  product,
  stripePriceId,
}: {
  stripe: StorefrontStripeClient;
  sessionId: string;
  product: StorefrontProduct;
  stripePriceId: string;
}): Promise<PurchaseVerification> {
  let session: CheckoutSession;

  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return { eligible: false, reason: 'invalid-session' };
  }

  if (session.payment_status !== 'paid') {
    return { eligible: false, reason: 'unpaid' };
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100,
  });
  const [lineItem] = lineItems.data;
  const hasExpectedPrice =
    lineItems.data.length === 1 &&
    stripeId(lineItem?.price ?? null) === stripePriceId &&
    lineItem?.quantity === 1;

  if (!hasExpectedPrice) {
    return { eligible: false, reason: 'wrong-price' };
  }

  const paymentIntentId = stripeId(session.payment_intent);
  if (!paymentIntentId) {
    return { eligible: false, reason: 'invalid-session' };
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
    expand: ['latest_charge'],
  });
  const charge = paymentIntent.latest_charge;

  if (!charge || typeof charge === 'string') {
    return { eligible: false, reason: 'invalid-session' };
  }

  if (charge.refunded || charge.amount_refunded >= charge.amount) {
    return { eligible: false, reason: 'fully-refunded' };
  }

  return { eligible: true, sessionId: session.id, product };
}
