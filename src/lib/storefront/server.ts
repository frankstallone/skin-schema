import Stripe from 'stripe';
import { getStorefrontConfig } from './config';
import { isCheckoutSessionId, verifyPurchase } from './purchase';

export { isCheckoutSessionId } from './purchase';

export function createStripeClient() {
  const config = getStorefrontConfig();
  return new Stripe(config.stripeSecretKey);
}

export async function getVerifiedPurchase(sessionId: string) {
  if (!isCheckoutSessionId(sessionId)) {
    return { eligible: false as const, reason: 'invalid-session' as const };
  }

  const config = getStorefrontConfig();
  return verifyPurchase({
    stripe: new Stripe(config.stripeSecretKey),
    sessionId,
    products: config.products,
  });
}
