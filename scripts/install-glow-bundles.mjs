// Temporary helper for the existing unlisted Stripe test branch.
import { createHash, createCipheriv, publicEncrypt, randomBytes } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { setTimeout } from 'node:timers/promises';
import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import Stripe from 'stripe';

function check(condition, code) {
  if (!condition) throw new Error(code);
}

async function main() {
  check(process.env.CONTEXT === 'branch-deploy', 'WRONG_CONTEXT');
  check(process.env.BRANCH === 'f4/storefront-video-bundles', 'WRONG_BRANCH');
  check(process.env.R2_ACCOUNT_ID === '644c55bbf3045a10a042f15da89b26ad', 'WRONG_ACCOUNT');
  check(process.env.R2_BUCKET === 'skin-schema-storefront-poc', 'WRONG_BUCKET');
  check(/^(sk|rk)_test_[A-Za-z0-9]+$/.test(process.env.STRIPE_SECRET_KEY ?? ''), 'TEST_KEY_REQUIRED');
  check(process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY, 'R2_KEYS_REQUIRED');

  const plan = JSON.parse(await readFile(new URL('./glow-bundle-upload.json', import.meta.url), 'utf8'));
  const expected = [
    ['resort-glow', 'Resort Glow', 30],
    ['hotel-bathroom-glow', 'Hotel Bathroom Glow', 29],
  ];
  check(plan.bundles.length === 2, 'WRONG_BUNDLE_COUNT');
  for (const [index, row] of plan.bundles.entries()) {
    const [id, name, clipCount] = expected[index];
    check(row.id === id && row.name === name && row.clipCount === clipCount, 'WRONG_BUNDLE');
    check(row.key === `bundles/${id}.zip`, 'WRONG_OBJECT_KEY');
    check(/^[a-f0-9]{64}$/.test(row.sha256), 'INVALID_HASH');
    check(Number.isSafeInteger(row.bytes) && row.bytes > 0 && row.bytes < 5_000_000_000, 'INVALID_SIZE');
    row.stageKey = `staging/glow-${row.sha256}/${id}.zip`;
  }

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  });
  const Bucket = process.env.R2_BUCKET;
  const directory = await mkdtemp(join(tmpdir(), 'skin-schema-glow-'));

  async function readObject(Key, path) {
    let response;
    try {
      response = await client.send(new GetObjectCommand({ Bucket, Key }));
    } catch (error) {
      if (error.$metadata?.httpStatusCode === 404) return null;
      throw error;
    }
    const hash = createHash('sha256');
    let bytes = 0;
    const counter = new Transform({ transform(chunk, encoding, callback) {
      bytes += chunk.length;
      hash.update(chunk, encoding);
      callback(null, chunk);
    } });
    await pipeline(response.Body, counter, createWriteStream(path));
    return { bytes, sha256: hash.digest('hex'), path };
  }

  function matches(row, result) {
    return result && result.bytes === row.bytes && result.sha256 === row.sha256;
  }

  try {
    const pending = [];
    for (const row of plan.bundles) {
      const current = await readObject(row.key, join(directory, `${row.id}-existing.zip`));
      check(!current || matches(row, current), 'UNEXPECTED_EXISTING_ARCHIVE');
      if (!current) pending.push(row);
    }
    const uploads = [];
    for (const row of pending) {
      row.staged = await readObject(row.stageKey, join(directory, `${row.id}-staged.zip`));
      if (row.staged) {
        check(matches(row, row.staged), 'STAGED_HASH_MISMATCH');
        continue;
      }
      const url = await getSignedUrl(client, new PutObjectCommand({
        Bucket, Key: row.stageKey, ContentType: 'application/zip', ContentLength: row.bytes, ContentMD5: row.md5,
      }), { expiresIn: 900 });
      uploads.push({ id: row.id, url, bytes: row.bytes, sha256: row.sha256,
        headers: { 'Content-Type': 'application/zip', 'Content-Length': String(row.bytes), 'Content-MD5': row.md5 } });
    }
    if (uploads.length) {
      const key = randomBytes(32);
      const iv = randomBytes(12);
      const cipher = createCipheriv('aes-256-gcm', key, iv);
      const ciphertext = Buffer.concat([cipher.update(JSON.stringify(uploads)), cipher.final()]);
      console.log(JSON.stringify({ kind: 'glow-upload',
        wrappedKey: publicEncrypt({ key: plan.publicKey, oaepHash: 'sha256' }, key).toString('base64'),
        iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), ciphertext: ciphertext.toString('base64') }));
    }
    const deadline = Date.now() + 10 * 60 * 1000;
    for (const row of pending) {
      if (row.staged) continue;
      let uploaded = false;
      while (Date.now() < deadline) {
        try {
          const head = await client.send(new HeadObjectCommand({ Bucket, Key: row.stageKey }));
          check(head.ContentLength === row.bytes, 'STAGED_SIZE_MISMATCH');
          uploaded = true;
          break;
        } catch (error) {
          if (error.$metadata?.httpStatusCode !== 404) throw error;
        }
        await setTimeout(5000);
      }
      check(uploaded, 'UPLOAD_TIMEOUT');
      row.staged = await readObject(row.stageKey, join(directory, `${row.id}-staged.zip`));
      check(matches(row, row.staged), 'STAGED_HASH_MISMATCH');
    }
    // Both complete archives must match the local plan before either is installed.
    for (const row of pending) {
      await client.send(new PutObjectCommand({
        Bucket, Key: row.key, Body: createReadStream(row.staged.path),
        ContentLength: row.bytes, ContentMD5: row.md5, ContentType: 'application/zip',
        ContentDisposition: `attachment; filename="skin-schema-${row.id}.zip"`,
        CacheControl: 'private, no-store', Metadata: { sha256: row.sha256 }, IfNoneMatch: '*',
      }));
    }
    const archives = [];
    for (const row of plan.bundles) {
      const result = await readObject(row.key, join(directory, `${row.id}-readback.zip`));
      check(matches(row, result), 'READBACK_MISMATCH');
      archives.push({ id: row.id, key: row.key, bytes: result.bytes, sha256: result.sha256, fullReadbackVerified: true });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const products = [];
    const productConfig = {};
    for (const row of plan.bundles) {
      const id = `prod_skin_schema_${row.id.replaceAll('-', '_')}_test`;
      const description = `${row.clipCount} silent Full HD MP4 videos (1080 × 1920, H.264, 29.97 fps, SDR Rec.709). Test purchase only. No commercial license or usage rights. The $99 USD price is provisional.`;
      let product;
      try {
        product = await stripe.products.retrieve(id);
      } catch (error) {
        if (error.code !== 'resource_missing') throw error;
        product = await stripe.products.create({
          id, name: row.name, description,
          metadata: { storefrontProductId: row.id, archiveSha256: row.sha256, clipCount: String(row.clipCount) },
          default_price_data: { currency: 'usd', unit_amount: 9900 },
        }, { idempotencyKey: `skin-schema-${row.id}-${row.sha256}` });
      }
      check(!product.deleted && !product.livemode && product.active && product.name === row.name &&
        product.description === description && product.metadata.storefrontProductId === row.id &&
        product.metadata.archiveSha256 === row.sha256, 'UNEXPECTED_TEST_PRODUCT');
      check(typeof product.default_price === 'string', 'MISSING_DEFAULT_PRICE');
      const price = await stripe.prices.retrieve(product.default_price);
      check(!price.livemode && price.active && price.product === id && price.unit_amount === 9900 &&
        price.currency === 'usd' && !price.recurring, 'UNEXPECTED_TEST_PRICE');
      products.push({ id, name: product.name, description: product.description, priceId: price.id, amount: price.unit_amount, currency: price.currency, livemode: false });
      productConfig[row.id] = { stripePriceId: price.id, objectKey: row.key };
    }
    for (const row of plan.bundles) {
      await client.send(new DeleteObjectCommand({ Bucket, Key: row.stageKey }));
    }
    console.log(JSON.stringify({ kind: 'glow-complete', ok: true, stagingRemoved: true, archives, products, productConfig }));
  } finally {
    await rm(directory, { recursive: true, force: true });
    client.destroy();
  }
}

try {
  await main();
} catch (error) {
  const code = /^[A-Z_]+$/.test(error.message) ? error.message : String(error.name ?? 'ERROR');
  console.error(JSON.stringify({ kind: 'glow-failed', code, status: error.$metadata?.httpStatusCode ?? error.statusCode ?? null }));
  process.exitCode = 1;
}
