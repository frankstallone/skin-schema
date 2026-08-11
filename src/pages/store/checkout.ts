import type { APIRoute } from 'astro';
import { getStorefrontProduct } from '../../lib/storefront/catalog';
import { getStorefrontConfig } from '../../lib/storefront/config';
import { createStripeClient } from '../../lib/storefront/server';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const productId = formData.get('product_id');
  const product =
    typeof productId === 'string' ? getStorefrontProduct(productId) : undefined;

  if (!product) {
    return new Response('This package is not available.', { status: 404 });
  }

  try {
    const config = getStorefrontConfig();
    const successUrl = `${new URL('/store/success', request.url)}?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = new URL('/store?checkout=cancelled', request.url);
    const session = await createStripeClient().checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: config.stripePriceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl.toString(),
      client_reference_id: product.id,
      metadata: { storefrontProductId: product.id },
    });

    if (!session.url) throw new Error('Stripe did not return a Checkout URL.');

    return Response.redirect(session.url, 303);
  } catch (error) {
    console.error('Unable to create storefront Checkout Session.', error);
    return new Response(
      'Checkout is temporarily unavailable. Please try again.',
      {
        status: 503,
      },
    );
  }
};
