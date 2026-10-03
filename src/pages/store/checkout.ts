import type { APIRoute } from 'astro';
import { getStorefrontProduct } from '../../lib/storefront/catalog';
import { getStorefrontConfig } from '../../lib/storefront/config';
import {
  createStripeClient,
  isCheckoutSessionId,
} from '../../lib/storefront/server';

export const prerender = false;

const headers = {
  'Cache-Control': 'no-store',
  'Referrer-Policy': 'no-referrer',
};

export const POST: APIRoute = async ({ request }) => {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return new Response('This checkout request is invalid.', {
      status: 400,
      headers,
    });
  }

  const productId = formData.get('product_id');
  const product =
    typeof productId === 'string' ? getStorefrontProduct(productId) : undefined;

  if (!product) {
    return new Response('This package is not available.', {
      status: 404,
      headers,
    });
  }

  try {
    const config = getStorefrontConfig();
    const successUrl = `${new URL('/store/success', request.url)}?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = new URL('/store?checkout=cancelled', request.url);
    const session = await createStripeClient().checkout.sessions.create({
      mode: 'payment',
      line_items: [
        { price: config.products[product.id].stripePriceId, quantity: 1 },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl.toString(),
      client_reference_id: product.id,
      metadata: { storefrontProductId: product.id },
    });

    if (
      !session.url ||
      session.livemode !== false ||
      !isCheckoutSessionId(session.id)
    ) {
      throw new Error('Stripe did not return a test Checkout Session.');
    }

    return new Response(null, {
      status: 303,
      headers: { ...headers, Location: session.url },
    });
  } catch {
    console.error('Unable to create storefront test Checkout Session.');
    return new Response(
      'Checkout is temporarily unavailable. Please try again.',
      {
        status: 503,
        headers,
      },
    );
  }
};
