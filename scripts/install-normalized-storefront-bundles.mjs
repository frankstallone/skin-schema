// Temporary, branch-only media installation. Remove after verified read-backs.
import {
  createHash,
  createCipheriv,
  publicEncrypt,
  randomBytes,
} from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { setTimeout } from 'node:timers/promises';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

function requireCondition(condition, code) {
  if (!condition) throw new Error(code);
}

async function main() {
  requireCondition(process.env.CONTEXT === 'branch-deploy', 'WRONG_CONTEXT');
  requireCondition(
    process.env.BRANCH === 'f4/storefront-video-bundles',
    'WRONG_BRANCH',
  );
  requireCondition(
    process.env.R2_ACCOUNT_ID === '644c55bbf3045a10a042f15da89b26ad',
    'WRONG_ACCOUNT',
  );
  requireCondition(
    process.env.R2_BUCKET === 'skin-schema-storefront-poc',
    'WRONG_BUCKET',
  );
  requireCondition(
    /^(sk|rk)_test_[A-Za-z0-9]+$/.test(process.env.STRIPE_SECRET_KEY ?? ''),
    'TEST_KEY_REQUIRED',
  );
  const plan = JSON.parse(
    await readFile(
      new URL('./normalized-storefront-upload.json', import.meta.url),
      'utf8',
    ),
  );
  const catalog = JSON.parse(process.env.STOREFRONT_PRODUCTS_JSON ?? '{}');
  const ids = ['bathroom-rituals', 'coastal-skin'];
  requireCondition(
    plan.bundles.length === 2 && Object.keys(catalog).length === 2,
    'WRONG_CATALOG',
  );
  for (const [index, row] of plan.bundles.entries()) {
    requireCondition(
      row.id === ids[index] && row.key === `bundles/${ids[index]}.zip`,
      'WRONG_OBJECT',
    );
    requireCondition(
      catalog[row.id]?.objectKey === row.key,
      'WRONG_PRODUCT_MAPPING',
    );
    requireCondition(
      /^[a-f0-9]{64}$/.test(row.sha256) &&
        /^[a-f0-9]{64}$/.test(row.previousSha256),
      'INVALID_HASH',
    );
    requireCondition(
      Number.isSafeInteger(row.bytes) &&
        row.bytes > 0 &&
        row.bytes < row.previousBytes,
      'INVALID_SIZE',
    );
    row.stageKey = `staging/normalize-${row.sha256}/${row.id}.zip`;
  }
  requireCondition(
    process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY,
    'R2_KEYS_REQUIRED',
  );
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  });
  const Bucket = process.env.R2_BUCKET;
  const directory = await mkdtemp(join(tmpdir(), 'skin-schema-normalized-'));

  async function readObject(Key, path) {
    const response = await client.send(new GetObjectCommand({ Bucket, Key }));
    const hash = createHash('sha256');
    let bytes = 0;
    const counter = new Transform({
      transform(chunk, encoding, callback) {
        bytes += chunk.length;
        hash.update(chunk, encoding);
        callback(null, chunk);
      },
    });
    await pipeline(response.Body, counter, createWriteStream(path));
    return { response, bytes, sha256: hash.digest('hex'), path };
  }

  try {
    const originals = new Map();
    const pending = [];
    for (const row of plan.bundles) {
      const current = await readObject(
        row.key,
        join(directory, `${row.id}-before.zip`),
      );
      const isFinal =
        current.sha256 === row.sha256 && current.bytes === row.bytes;
      requireCondition(
        isFinal ||
          (current.sha256 === row.previousSha256 &&
            current.bytes === row.previousBytes),
        'UNEXPECTED_EXISTING_ARCHIVE',
      );
      originals.set(row.id, current);
      if (!isFinal) pending.push(row);
    }

    if (pending.length) {
      const uploads = [];
      for (const row of pending) {
        const url = await getSignedUrl(
          client,
          new PutObjectCommand({
            Bucket,
            Key: row.stageKey,
            ContentType: 'application/zip',
            ContentLength: row.bytes,
            ContentMD5: row.md5,
            Metadata: { sha256: row.sha256 },
          }),
          { expiresIn: 900 },
        );
        uploads.push({
          id: row.id,
          url,
          bytes: row.bytes,
          sha256: row.sha256,
          headers: {
            'Content-Type': 'application/zip',
            'Content-Length': String(row.bytes),
            'Content-MD5': row.md5,
          },
        });
      }
      // Only this workstation can decrypt these temporary upload capabilities.
      const key = randomBytes(32);
      const iv = randomBytes(12);
      const cipher = createCipheriv('aes-256-gcm', key, iv);
      const ciphertext = Buffer.concat([
        cipher.update(JSON.stringify(uploads)),
        cipher.final(),
      ]);
      console.log(
        JSON.stringify({
          kind: 'normalization-upload',
          wrappedKey: publicEncrypt(
            { key: plan.publicKey, oaepHash: 'sha256' },
            key,
          ).toString('base64'),
          iv: iv.toString('base64'),
          tag: cipher.getAuthTag().toString('base64'),
          ciphertext: ciphertext.toString('base64'),
        }),
      );

      const deadline = Date.now() + 10 * 60 * 1000;
      for (const row of pending) {
        let uploaded = false;
        while (Date.now() < deadline) {
          try {
            const head = await client.send(
              new HeadObjectCommand({ Bucket, Key: row.stageKey }),
            );
            requireCondition(
              head.ContentLength === row.bytes &&
                head.Metadata?.sha256 === row.sha256,
              'INCORRECT_STAGED_UPLOAD',
            );
            uploaded = true;
            break;
          } catch (error) {
            if (error.$metadata?.httpStatusCode !== 404) throw error;
          }
          await setTimeout(5000);
        }
        requireCondition(uploaded, 'UPLOAD_TIMEOUT');
        row.staged = await readObject(
          row.stageKey,
          join(directory, `${row.id}-staged.zip`),
        );
        requireCondition(
          row.staged.bytes === row.bytes && row.staged.sha256 === row.sha256,
          'STAGED_HASH_MISMATCH',
        );
      }

      // Verify both complete staged archives before replacing either download.
      for (const row of pending) {
        const previous = originals.get(row.id).response;
        await client.send(
          new PutObjectCommand({
            Bucket,
            Key: row.key,
            Body: createReadStream(row.staged.path),
            ContentLength: row.bytes,
            ContentMD5: row.md5,
            ContentType: 'application/zip',
            ContentDisposition: `attachment; filename="skin-schema-${row.id}.zip"`,
            CacheControl: previous.CacheControl,
            ContentLanguage: previous.ContentLanguage,
            Metadata: { ...previous.Metadata, sha256: row.sha256 },
            IfMatch: previous.ETag,
          }),
        );
      }
    }

    const verified = [];
    for (const row of plan.bundles) {
      const result = await readObject(
        row.key,
        join(directory, `${row.id}-readback.zip`),
      );
      requireCondition(
        result.bytes === row.bytes && result.sha256 === row.sha256,
        'READBACK_MISMATCH',
      );
      verified.push({
        id: row.id,
        key: row.key,
        bytes: result.bytes,
        sha256: result.sha256,
        fullReadbackVerified: true,
        uploaded: pending.some((item) => item.id === row.id),
      });
    }
    for (const row of plan.bundles) {
      await client.send(new DeleteObjectCommand({ Bucket, Key: row.stageKey }));
    }
    console.log(
      JSON.stringify({
        kind: 'normalization-complete',
        ok: true,
        stagingRemoved: true,
        archives: verified,
      }),
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
    client.destroy();
  }
}

try {
  await main();
} catch (error) {
  // SDK errors can contain request details. Emit only a bounded identifier.
  const code = /^[A-Z_]+$/.test(error.message)
    ? error.message
    : String(error.name ?? 'ERROR');
  console.error(
    JSON.stringify({
      kind: 'normalization-failed',
      code,
      status: error.$metadata?.httpStatusCode ?? null,
    }),
  );
  process.exitCode = 1;
}
