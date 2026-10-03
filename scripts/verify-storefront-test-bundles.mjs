// Temporary branch-only verification. Remove after the remote check passes.
import { createHash } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { spawnSync } from 'node:child_process';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import Stripe from 'stripe';

const bundles = [
  {
    id: 'bathroom-rituals',
    count: 30,
    bytes: 671085692,
    sha256: '6b2a0e315be557c68ecd70417b5185822e0d0ef477a2ac0d22c50d02b3165dc9',
    sourceHash:
      'aabbb2935ed6b43dc97d09b635b9c1ffb313dc1c6c804e040aef4449ae36be31',
  },
  {
    id: 'coastal-skin',
    count: 34,
    bytes: 503874634,
    sha256: '82937fdddba74f9013b3bd596de72766e3c609ffb1dc23351e85a2b2245c0354',
    sourceHash:
      '1b65b876a0afc67256ebbe7e79eb4dd9fbeaae3b90681c200563040260c2d6a8',
  },
];

const inspectZip = String.raw`
import hashlib, json, pathlib, sys, zipfile
with zipfile.ZipFile(sys.argv[1]) as z:
    assert z.testzip() is None
    names = z.namelist()
    assert len(names) == len(set(n.casefold() for n in names))
    clips = [n for n in names if pathlib.PurePosixPath(n).suffix.lower() in ['.mov', '.mp4']]
    hashes = []
    for name in clips:
        assert name.startswith('clips/') and '..' not in pathlib.PurePosixPath(name).parts
        with z.open(name) as source:
            hashes.append(hashlib.file_digest(source, 'sha256').hexdigest())
    assert 'No commercial license' in z.read('README.txt').decode()
    assert 'sha256' in z.read('clip-index.csv').decode()
    print(json.dumps({'count': len(clips), 'sourceHash': hashlib.sha256('\n'.join(sorted(hashes)).encode()).hexdigest()}))
`;

let directory;
let client;
let stage = 'guard';
let currentBundle;
try {
  if (
    process.env.CONTEXT !== 'branch-deploy' ||
    process.env.BRANCH !== 'f4/storefront-video-bundles'
  )
    throw new Error();
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!/^(sk|rk)_test_[A-Za-z0-9]+$/.test(secret ?? '')) throw new Error();
  const products = JSON.parse(process.env.STOREFRONT_PRODUCTS_JSON ?? '');
  const stripe = new Stripe(secret);
  client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  });
  directory = await mkdtemp(join(tmpdir(), 'skin-schema-verify-'));
  for (const bundle of bundles) {
    currentBundle = bundle.id;
    stage = 'read-private-archive';
    const config = products[bundle.id];
    const response = await client.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: config.objectKey,
      }),
    );
    const hash = createHash('sha256');
    let bytes = 0;
    const path = join(directory, `${bundle.id}.zip`);
    await pipeline(
      response.Body,
      new Transform({
        transform(chunk, _encoding, callback) {
          bytes += chunk.length;
          hash.update(chunk);
          callback(null, chunk);
        },
      }),
      createWriteStream(path),
    );
    if (bytes !== bundle.bytes || hash.digest('hex') !== bundle.sha256)
      throw new Error();
    stage = 'compare-every-original';
    const inspection = spawnSync('python3', ['-c', inspectZip, path], {
      encoding: 'utf8',
    });
    if (inspection.status !== 0) throw new Error();
    const result = JSON.parse(inspection.stdout);
    if (
      result.count !== bundle.count ||
      result.sourceHash !== bundle.sourceHash
    )
      throw new Error();
    stage = 'verify-test-price';
    const price = await stripe.prices.retrieve(config.stripePriceId, {
      expand: ['product'],
    });
    if (
      price.livemode !== false ||
      !price.active ||
      price.unit_amount !== 9900 ||
      price.currency !== 'usd' ||
      price.product.livemode !== false ||
      price.product.metadata.storefrontProductId !== bundle.id
    )
      throw new Error();
    console.log(
      JSON.stringify({
        verified: true,
        catalogId: bundle.id,
        objectKey: config.objectKey,
        bytes,
        sha256: bundle.sha256,
        everyOriginalMatchesLocal: true,
        count: result.count,
        stripePriceId: price.id,
        livemode: price.livemode,
      }),
    );
  }
} catch {
  console.error(
    JSON.stringify({ verified: false, stage, catalogId: currentBundle }),
  );
  process.exitCode = 1;
} finally {
  client?.destroy();
  if (directory) await rm(directory, { recursive: true, force: true });
}
