import type { APIRoute } from 'astro';
import { getStorefrontConfig } from '../../lib/storefront/config';
import { createDownloadUrl } from '../../lib/storefront/r2';
import {
  getVerifiedPurchase,
  isCheckoutSessionId,
} from '../../lib/storefront/server';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const sessionId = url.searchParams.get('session_id');
  if (!isCheckoutSessionId(sessionId)) {
    return new Response('This download link is invalid.', { status: 400 });
  }

  try {
    const purchase = await getVerifiedPurchase(sessionId);
    if (!purchase.eligible) {
      return new Response('This purchase is not eligible for download.', {
        status: 403,
      });
    }

    const downloadUrl = await createDownloadUrl(
      getStorefrontConfig().r2,
      purchase.product.downloadFilename,
    );
    return Response.redirect(downloadUrl, 303);
  } catch (error) {
    console.error('Unable to authorize storefront download.', error);
    return new Response(
      'Download is temporarily unavailable. Please try again.',
      {
        status: 503,
      },
    );
  }
};
