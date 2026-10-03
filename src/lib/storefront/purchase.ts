import { createHash, timingSafeEqual } from 'node:crypto';
import { getStorefrontProduct, type StorefrontProduct } from './catalog';
import type { StorefrontProductConfig } from './config';

type CheckoutSession = {
  id: string;
  livemode: boolean;
  mode: string;
  status: string | null;
  payment_status: string;
  payment_intent: string | { id: string } | null;
};

type LineItem = {
  price: string | { id: string } | null;
  quantity: number | null;
};

type PaymentIntent = {
  livemode: boolean;
  status: string;
  metadata: Record<string, string>;
  latest_charge:
    | string
    | {
        amount: number;
        created: number;
        amount_refunded: number;
        refunded: boolean;
        disputed: boolean;
        livemode: boolean;
        status: string;
      }
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
        has_more: boolean;
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
  | {
      eligible: true;
      sessionId: string;
      product: StorefrontProduct;
      objectKey: string;
      accessExpiresAt: number;
    }
  | {
      eligible: false;
      reason:
        | 'unpaid'
        | 'wrong-price'
        | 'fully-refunded'
        | 'disputed'
        | 'not-test-mode'
        | 'expired'
        | 'invalid-session';
    };

export function isCheckoutSessionId(value: string | null): value is string {
  return Boolean(value && /^cs_test_[A-Za-z0-9]+$/.test(value));
}

function stripeId(value: string | { id: string } | null): string | undefined {
  return typeof value === 'string' ? value : value?.id;
}

export async function verifyPurchase({
  stripe,
  sessionId,
  products,
  accessToken,
}: {
  stripe: StorefrontStripeClient;
  sessionId: string;
  products: Record<string, StorefrontProductConfig>;
  accessToken?: string | null;
}): Promise<PurchaseVerification> {
  if (!isCheckoutSessionId(sessionId)) {
    return { eligible: false, reason: 'invalid-session' };
  }

  let session: CheckoutSession;

  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'resource_missing'
    ) {
      return { eligible: false, reason: 'invalid-session' };
    }
    throw error;
  }

  if (session.livemode !== false) {
    return { eligible: false, reason: 'not-test-mode' };
  }

  if (session.payment_status !== 'paid') {
    return { eligible: false, reason: 'unpaid' };
  }

  if (
    session.id !== sessionId ||
    session.mode !== 'payment' ||
    session.status !== 'complete'
  ) {
    return { eligible: false, reason: 'invalid-session' };
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 2,
  });
  const [lineItem] = lineItems.data;
  if (
    lineItems.has_more ||
    lineItems.data.length !== 1 ||
    lineItem?.quantity !== 1
  ) {
    return { eligible: false, reason: 'wrong-price' };
  }

  const priceId = stripeId(lineItem.price);
  const configuredProduct = Object.entries(products).find(
    ([, config]) => config.stripePriceId === priceId,
  );
  const product = configuredProduct
    ? getStorefrontProduct(configuredProduct[0])
    : undefined;

  if (!product || !configuredProduct) {
    return { eligible: false, reason: 'wrong-price' };
  }

  const paymentIntentId = stripeId(session.payment_intent);
  if (!paymentIntentId) {
    return { eligible: false, reason: 'invalid-session' };
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
    expand: ['latest_charge'],
  });

  if (paymentIntent.livemode !== false) {
    return { eligible: false, reason: 'not-test-mode' };
  }

  if (paymentIntent.status !== 'succeeded') {
    return { eligible: false, reason: 'unpaid' };
  }

  const charge = paymentIntent.latest_charge;

  if (!charge || typeof charge === 'string') {
    return { eligible: false, reason: 'invalid-session' };
  }

  if (charge.livemode !== false) {
    return { eligible: false, reason: 'not-test-mode' };
  }

  if (charge.status !== 'succeeded') {
    return { eligible: false, reason: 'unpaid' };
  }

  if (charge.disputed) {
    return { eligible: false, reason: 'disputed' };
  }

  if (charge.refunded || charge.amount_refunded >= charge.amount) {
    return { eligible: false, reason: 'fully-refunded' };
  }

  if (!Number.isSafeInteger(charge.created) || charge.created <= 0) {
    return { eligible: false, reason: 'invalid-session' };
  }

  let accessExpiresAt = charge.created + 24 * 60 * 60;
  const tokenHash = paymentIntent.metadata.storefront_download_token_sha256;
  const replacementExpiry =
    paymentIntent.metadata.storefront_download_expires_at;

  // An owner-issued replacement takes over completely, including on invalid
  // metadata. Never let its old or missing token reopen the original window.
  if (tokenHash !== undefined || replacementExpiry !== undefined) {
    if (
      !tokenHash ||
      !/^[a-f0-9]{64}$/.test(tokenHash) ||
      !accessToken ||
      !/^[a-f0-9]{64}$/.test(accessToken) ||
      !replacementExpiry ||
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(
        replacementExpiry,
      )
    ) {
      return { eligible: false, reason: 'invalid-session' };
    }

    const suppliedHash = createHash('sha256').update(accessToken).digest();
    if (!timingSafeEqual(suppliedHash, Buffer.from(tokenHash, 'hex'))) {
      return { eligible: false, reason: 'invalid-session' };
    }

    const replacementDate = new Date(replacementExpiry);
    const normalizedExpiry = replacementExpiry.includes('.')
      ? replacementExpiry
      : replacementExpiry.replace('Z', '.000Z');
    if (
      !Number.isFinite(replacementDate.getTime()) ||
      replacementDate.toISOString() !== normalizedExpiry
    ) {
      return { eligible: false, reason: 'invalid-session' };
    }
    accessExpiresAt = Math.floor(replacementDate.getTime() / 1000);
  } else if (accessToken !== undefined && accessToken !== null) {
    return { eligible: false, reason: 'invalid-session' };
  }

  if (Math.floor(Date.now() / 1000) >= accessExpiresAt) {
    return { eligible: false, reason: 'expired' };
  }

  return {
    eligible: true,
    sessionId: session.id,
    product,
    objectKey: configuredProduct[1].objectKey,
    accessExpiresAt,
  };
}
