import type { APIRoute } from 'astro';
import { getStorefrontConfig } from '../../lib/storefront/config';
import { createDownloadUrl } from '../../lib/storefront/r2';
import {
  getVerifiedPurchase,
  isCheckoutSessionId,
} from '../../lib/storefront/server';

export const prerender = false;

const headers = {
  'Cache-Control': 'no-store',
  'Referrer-Policy': 'no-referrer',
};
const expiredMessage =
  'This download link has expired. Email glow@skinschema.com to request a new timed link.';

export const GET: APIRoute = async ({ url }) => {
  const sessionId = url.searchParams.get('session_id');
  const accessToken = url.searchParams.get('access_token');
  if (!isCheckoutSessionId(sessionId)) {
    return new Response('This download link is invalid.', {
      status: 400,
      headers,
    });
  }

  try {
    const purchase = await getVerifiedPurchase(sessionId, accessToken);
    if (!purchase.eligible) {
      return new Response(
        purchase.reason === 'expired'
          ? expiredMessage
          : 'This purchase is not eligible for download.',
        { status: purchase.reason === 'expired' ? 410 : 403, headers },
      );
    }

    const downloadUrl = await createDownloadUrl(
      getStorefrontConfig().r2,
      purchase.objectKey,
      purchase.product.downloadFilename,
      purchase.accessExpiresAt,
    );
    if (!downloadUrl) {
      return new Response(expiredMessage, { status: 410, headers });
    }
    return new Response(null, {
      status: 303,
      headers: { ...headers, Location: downloadUrl },
    });
  } catch {
    console.error('Unable to authorize storefront download.');
    return new Response(
      'Download is temporarily unavailable. Please try again.',
      {
        status: 503,
        headers,
      },
    );
  }
};
