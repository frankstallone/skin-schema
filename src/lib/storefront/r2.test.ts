import assert from 'node:assert/strict';
import test from 'node:test';
import { createDownloadUrl } from './r2';

const r2 = {
  region: 'auto',
  endpoint: 'https://example.r2.cloudflarestorage.com',
  credentials: { accessKeyId: 'example', secretAccessKey: 'example' },
  bucket: 'private-bundles',
};

test('signs the selected private R2 object for a five-minute attachment download', async () => {
  const result = await createDownloadUrl(
    r2,
    'archives/second-bundle.zip',
    'second-bundle.zip',
    Math.floor(Date.now() / 1000) + 86_400,
  );
  assert.ok(result);
  const signed = new URL(result);

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

test('R2 links cannot outlive the purchase window or be issued after its deadline', async (context) => {
  context.mock.timers.enable({
    apis: ['Date'],
    now: Date.parse('2026-10-04T11:59:40Z'),
  });
  const expiresAt = Date.parse('2026-10-04T12:00:00Z') / 1000;
  const result = await createDownloadUrl(
    r2,
    'bundle.zip',
    'bundle.zip',
    expiresAt,
  );
  assert.ok(result);
  const signed = new URL(result);
  assert.equal(signed.searchParams.get('X-Amz-Expires'), '20');
  assert.equal(signed.searchParams.get('X-Amz-Date'), '20261004T115940Z');

  context.mock.timers.tick(20_000);
  assert.equal(
    await createDownloadUrl(r2, 'bundle.zip', 'bundle.zip', expiresAt),
    null,
  );
});
