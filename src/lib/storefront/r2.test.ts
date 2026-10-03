import assert from 'node:assert/strict';
import test from 'node:test';
import { createDownloadUrl } from './r2';

test('signs the selected private R2 object for a five-minute attachment download', async () => {
  const r2 = {
    region: 'auto',
    endpoint: 'https://example.r2.cloudflarestorage.com',
    credentials: { accessKeyId: 'example', secretAccessKey: 'example' },
    bucket: 'private-bundles',
  };
  const signed = new URL(
    await createDownloadUrl(
      r2,
      'archives/second-bundle.zip',
      'second-bundle.zip',
    ),
  );

  assert.equal(
    signed.hostname,
    'private-bundles.example.r2.cloudflarestorage.com',
  );
  assert.equal(signed.pathname, '/archives/second-bundle.zip');
  assert.equal(signed.searchParams.get('X-Amz-Expires'), '300');
  assert.equal(
    signed.searchParams.get('response-content-disposition'),
    'attachment; filename="second-bundle.zip"',
  );
  assert.ok(signed.searchParams.get('X-Amz-Signature'));
});
