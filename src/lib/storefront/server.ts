import Stripe from 'stripe';
import { getStorefrontProduct } from './catalog';
import { getStorefrontConfig } from './config';
import { verifyPurchase } from './purchase';

export function createStripeClient() {
  const config = getStorefrontConfig();
  return new Stripe(config.stripeSecretKey);
}

export async function getVerifiedPurchase(sessionId: string) {
  const product = getStorefrontProduct('bathroom-rituals');

  if (!product || !isCheckoutSessionId(sessionId)) {
    return { eligible: false as const, reason: 'invalid-session' as const };
  }

  const config = getStorefrontConfig();
  return verifyPurchase({
    stripe: new Stripe(config.stripeSecretKey),
    sessionId,
    product,
    stripePriceId: config.stripePriceId,
  });
}

export function isCheckoutSessionId(value: string | null): value is string {
  return Boolean(value && /^cs_[A-Za-z0-9_]+$/.test(value));
}
