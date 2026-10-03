// Temporary one-off branch provisioning helper. Remove after verification.
import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, mkdtemp, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { spawnSync } from 'node:child_process';

const BUNDLES = [
  {
    id: 'bathroom-rituals',
    name: 'Bathroom Rituals',
    count: 30,
    sourceBytes: 671077807,
    objectKey: 'bundles/bathroom-rituals.zip',
    lookupKey: 'skin_schema_bathroom_rituals_test_99',
  },
  {
    id: 'coastal-skin',
    name: 'Coastal Skin',
    count: 34,
    sourceBytes: 503865840,
    objectKey: 'bundles/coastal-skin.zip',
    lookupKey: 'skin_schema_coastal_skin_test_99',
  },
];

const ZIP_SCRIPT = String.raw`
import csv, io, json, pathlib, shutil, sys, zipfile
root, archive_path = map(pathlib.Path, sys.argv[1:])
manifest = json.loads((root / 'manifest.json').read_text(encoding='utf-8'))
index = io.StringIO(newline='')
writer = csv.writer(index, lineterminator='\n')
writer.writerow(['originalName', 'filename', 'bytes', 'sha256'])
for clip in manifest['clips']:
    writer.writerow([clip['originalName'], clip['filename'], clip['bytes'], clip['sha256']])
def entry(name):
    result = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
    result.compress_type = zipfile.ZIP_STORED
    result.create_system = 3
    result.external_attr = 0o100644 << 16
    return result
with zipfile.ZipFile(archive_path, 'w', compression=zipfile.ZIP_STORED, allowZip64=True) as archive:
    archive.writestr(entry('README.txt'), manifest['readme'].encode('utf-8'))
    archive.writestr(entry('clip-index.csv'), index.getvalue().encode('utf-8'))
    for clip in manifest['clips']:
        info = entry(clip['filename'])
        info.file_size = clip['bytes']
        with (root / clip['filename']).open('rb') as source, archive.open(info, 'w', force_zip64=True) as target:
            shutil.copyfileobj(source, target, length=1024 * 1024)
`;

class PreparationError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

function requireCondition(condition, code) {
  if (!condition) throw new PreparationError(code);
}

function required(name) {
  const value = process.env[name];
  requireCondition(
    typeof value === 'string' && value.length > 0,
    `missing_${name}`,
  );
  return value;
}

function configuration() {
  requireCondition(process.env.CONTEXT === 'branch-deploy', 'wrong_context');
  requireCondition(
    process.env.BRANCH === 'f4/storefront-video-bundles',
    'wrong_branch',
  );
  const stripeSecretKey = required('STRIPE_SECRET_KEY');
  requireCondition(
    /^(sk|rk)_test_[A-Za-z0-9]+$/.test(stripeSecretKey),
    'not_a_test_key',
  );

  let shares;
  try {
    shares = JSON.parse(required('STOREFRONT_SOURCE_SHARES_JSON'));
  } catch {
    throw new PreparationError('invalid_source_share_map');
  }
  requireCondition(
    shares &&
      typeof shares === 'object' &&
      !Array.isArray(shares) &&
      Object.keys(shares).length === BUNDLES.length &&
      BUNDLES.every(
        (bundle) =>
          typeof shares[bundle.id] === 'string' &&
          /^[A-Za-z0-9_-]+$/.test(shares[bundle.id]),
      ) &&
      new Set(Object.values(shares)).size === BUNDLES.length,
    'invalid_source_share_map',
  );

  const accountId = required('R2_ACCOUNT_ID');
  requireCondition(/^[A-Za-z0-9]+$/.test(accountId), 'invalid_r2_account');
  return {
    stripeSecretKey,
    shares,
    bucket: required('R2_BUCKET'),
    r2: {
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: required('R2_ACCESS_KEY_ID'),
        secretAccessKey: required('R2_SECRET_ACCESS_KEY'),
      },
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
      maxAttempts: 1,
      logger: Object.fromEntries(
        ['trace', 'debug', 'info', 'warn', 'error'].map((name) => [
          name,
          () => {},
        ]),
      ),
    },
  };
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60000),
  });
  requireCondition(response.ok, 'source_request_failed');
  return response.json();
}

async function resolveMasters(shortId, bundle) {
  const response = await postJson(
    'https://ckdatabasews.icloud.com/database/1/com.apple.photos.cloud/production/public/records/resolve',
    { shortGUIDs: [{ value: shortId }] },
  );
  const share = response.results?.[0];
  const access = share?.anonymousPublicAccess;
  requireCondition(
    share?.databaseScope === 'SHARED' &&
      typeof share.containerIdentifier === 'string' &&
      /^[A-Za-z0-9.]+$/.test(share.containerIdentifier) &&
      String(share.environment).toLowerCase() === 'production' &&
      share.zoneID &&
      typeof share.zoneID === 'object' &&
      typeof access?.token === 'string' &&
      access.token.length > 0 &&
      typeof access.databasePartition === 'string',
    'invalid_source_share_response',
  );
  const queryUrl = new URL(
    `${access.databasePartition.replace(/\/+$/, '')}/database/1/${share.containerIdentifier}/production/shared/records/query`,
  );
  requireCondition(
    queryUrl.protocol === 'https:',
    'invalid_source_query_endpoint',
  );
  queryUrl.searchParams.set('publicAccessAuthToken', access.token);
  queryUrl.searchParams.set('sharing_url_key', shortId);
  const result = await postJson(queryUrl, {
    zoneID: share.zoneID,
    query: {
      recordType: 'CPLAssetAndMasterByAssetDateWithoutHiddenOrDeleted',
      filterBy: [
        {
          fieldName: 'direction',
          comparator: 'EQUALS',
          fieldValue: { value: 'ASCENDING', type: 'STRING' },
        },
      ],
    },
    resultsLimit: 200,
  });
  requireCondition(
    Array.isArray(result.records) && !result.continuationMarker,
    'incomplete_source_query',
  );
  const masters = result.records.filter(
    (record) => record.recordType === 'CPLMaster',
  );
  requireCondition(masters.length === bundle.count, 'unexpected_source_count');
  requireCondition(
    masters.every((record) => typeof record.recordName === 'string') &&
      new Set(masters.map((record) => record.recordName)).size === bundle.count,
    'invalid_source_record_names',
  );
  masters.sort((left, right) =>
    left.recordName < right.recordName
      ? -1
      : left.recordName > right.recordName
        ? 1
        : 0,
  );

  const clips = masters.map((record, index) => {
    const encoded = record.fields?.filenameEnc?.value;
    const bytes = Number(record.fields?.resOriginalFileSize?.value);
    const downloadUrl = record.fields?.resOriginalRes?.value?.downloadURL;
    requireCondition(
      typeof encoded === 'string' &&
        Number.isSafeInteger(bytes) &&
        bytes > 0 &&
        typeof downloadUrl === 'string',
      'invalid_source_original',
    );
    const originalName = Buffer.from(encoded, 'base64').toString('utf8');
    requireCondition(
      originalName.length > 0 && !originalName.includes('\0'),
      'invalid_source_filename',
    );
    const safeName = basename(originalName.replaceAll('\\', '/'))
      .normalize('NFC')
      .replace(/[^\p{L}\p{N}._ -]/gu, '_')
      .replace(/^\.+/, '')
      .slice(0, 180);
    requireCondition(
      safeName.length > 0 && new URL(downloadUrl).protocol === 'https:',
      'invalid_source_download',
    );
    return {
      originalName,
      filename: `clips/${String(index + 1).padStart(3, '0')}-${safeName}`,
      bytes,
      downloadUrl,
    };
  });
  requireCondition(
    clips.reduce((sum, clip) => sum + clip.bytes, 0) === bundle.sourceBytes,
    'unexpected_source_byte_total',
  );
  return clips;
}

async function downloadClip(clip, directory) {
  const response = await fetch(clip.downloadUrl, {
    signal: AbortSignal.timeout(15 * 60 * 1000),
  });
  requireCondition(response.ok && response.body, 'original_download_failed');
  let bytes = 0;
  const hash = createHash('sha256');
  const verifyStream = new Transform({
    transform(chunk, encoding, callback) {
      bytes += chunk.length;
      if (bytes > clip.bytes)
        return callback(new PreparationError('original_size_mismatch'));
      hash.update(chunk);
      callback(null, chunk);
    },
  });
  await pipeline(
    Readable.fromWeb(response.body),
    verifyStream,
    createWriteStream(join(directory, clip.filename), { flags: 'wx' }),
  );
  requireCondition(bytes === clip.bytes, 'original_size_mismatch');
  return {
    originalName: clip.originalName,
    filename: clip.filename,
    bytes,
    sha256: hash.digest('hex'),
  };
}

async function downloadOriginals(clips, directory) {
  await mkdir(join(directory, 'clips'), { recursive: true });
  const result = new Array(clips.length);
  let next = 0;
  const workers = await Promise.allSettled(
    Array.from({ length: 4 }, async () => {
      while (next < clips.length) {
        const index = next++;
        result[index] = await downloadClip(clips[index], directory);
      }
    }),
  );
  const failure = workers.find((worker) => worker.status === 'rejected');
  if (failure) throw failure.reason;
  return result;
}

async function digestFile(path) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  return hash.digest('hex');
}

async function prepareArchive(bundle, clips, directory) {
  const readme = `${bundle.name} — Skin Schema test bundle\n\nTEST ONLY. No commercial license or usage rights are granted by this download.\nProduct names and $99 USD test prices are provisional.\nDo not publish, advertise with, or redistribute these files.\n\nThis ZIP contains ${bundle.count} unmodified original video files.\nNumeric prefixes prevent duplicate and case-sensitive filename collisions.\nclip-index.csv records original names, archive names, byte sizes, and SHA-256 hashes.\n`;
  await writeFile(
    join(directory, 'manifest.json'),
    JSON.stringify({ clips, readme }),
  );
  const archivePath = join(directory, `${bundle.id}.zip`);
  const packed = spawnSync(
    'python3',
    ['-c', ZIP_SCRIPT, directory, archivePath],
    { stdio: 'pipe' },
  );
  requireCondition(packed.status === 0, 'archive_creation_failed');
  const { size: bytes } = await stat(archivePath);
  requireCondition(
    bytes > 0 && bytes < 5 * 1024 ** 3,
    'archive_size_not_supported',
  );
  return { path: archivePath, bytes, sha256: await digestFile(archivePath) };
}

async function uploadArchive(client, commands, config, bundle, archive) {
  const object = { Bucket: config.bucket, Key: bundle.objectKey };
  let existing;
  try {
    existing = await client.send(new commands.HeadObjectCommand(object));
  } catch (error) {
    if (error?.$metadata?.httpStatusCode !== 404) throw error;
  }
  if (
    existing?.ContentLength !== archive.bytes ||
    existing?.Metadata?.sha256 !== archive.sha256
  ) {
    await client.send(
      new commands.PutObjectCommand({
        ...object,
        Body: createReadStream(archive.path),
        ContentLength: archive.bytes,
        ContentType: 'application/zip',
        ContentDisposition: `attachment; filename="skin-schema-${bundle.id}.zip"`,
        CacheControl: 'private, no-store',
        Metadata: {
          sha256: archive.sha256,
          sourcecount: String(bundle.count),
          storefrontproductid: bundle.id,
          testonly: 'true',
        },
      }),
    );
  }
  const verified = await client.send(new commands.HeadObjectCommand(object));
  requireCondition(
    verified.ContentLength === archive.bytes &&
      verified.Metadata?.sha256 === archive.sha256,
    'r2_verification_failed',
  );
}

function validateProduct(product, bundle) {
  requireCondition(
    product &&
      !product.deleted &&
      product.active &&
      product.livemode === false &&
      product.metadata?.storefrontProductId === bundle.id,
    'stripe_product_mismatch',
  );
}

async function ensureTestPrice(stripe, bundle) {
  const found = await stripe.prices.list({
    active: true,
    lookup_keys: [bundle.lookupKey],
    limit: 2,
    expand: ['data.product'],
  });
  requireCondition(
    !found.has_more && found.data.length <= 1,
    'ambiguous_stripe_price',
  );
  let price = found.data[0];
  if (!price) {
    const productId = `prod_skin_schema_${bundle.id.replaceAll('-', '_')}_test`;
    let product;
    try {
      product = await stripe.products.retrieve(productId);
    } catch (error) {
      if (error?.code !== 'resource_missing') throw error;
      product = await stripe.products.create(
        {
          id: productId,
          name: `${bundle.name} [TEST ONLY]`,
          description: `${bundle.count} original videos. Test purchase only. No commercial license or usage rights. Name and $99 USD price are provisional.`,
          metadata: { storefrontProductId: bundle.id, testOnly: 'true' },
        },
        { idempotencyKey: `skin-schema:${bundle.id}:test-product:99-usd` },
      );
    }
    validateProduct(product, bundle);
    price = await stripe.prices.create(
      {
        product: product.id,
        currency: 'usd',
        unit_amount: 9900,
        lookup_key: bundle.lookupKey,
        nickname: '$99 USD TEST ONLY — no commercial license',
        metadata: { storefrontProductId: bundle.id, testOnly: 'true' },
      },
      { idempotencyKey: `skin-schema:${bundle.id}:test-price:99-usd` },
    );
  }
  requireCondition(
    price.livemode === false &&
      price.active &&
      price.currency === 'usd' &&
      price.unit_amount === 9900 &&
      price.type === 'one_time' &&
      price.billing_scheme === 'per_unit' &&
      price.lookup_key === bundle.lookupKey,
    'stripe_price_mismatch',
  );
  const product =
    typeof price.product === 'string'
      ? await stripe.products.retrieve(price.product)
      : price.product;
  validateProduct(product, bundle);
  return {
    stripePriceId: price.id,
    productId: product.id,
    livemode: price.livemode,
    productLivemode: product.livemode,
  };
}

let stage = 'guard';
let currentProduct;
let temporaryDirectory;
let r2Client;
try {
  const config = configuration();
  requireCondition(
    process.argv.length <= 3 &&
      (!process.argv[2] || process.argv[2] === '--validate-only'),
    'invalid_arguments',
  );
  const python = spawnSync('python3', ['--version'], { stdio: 'pipe' });
  requireCondition(python.status === 0, 'python3_unavailable');
  if (process.argv[2] === '--validate-only') {
    console.log(
      JSON.stringify({
        ok: true,
        validationOnly: true,
        products: BUNDLES.map((bundle) => bundle.id),
        stripeTestOnly: true,
      }),
    );
  } else {
    stage = 'initialize';
    const [{ default: Stripe }, commands] = await Promise.all([
      import('stripe'),
      import('@aws-sdk/client-s3'),
    ]);
    const stripe = new Stripe(config.stripeSecretKey);
    r2Client = new commands.S3Client(config.r2);
    temporaryDirectory = await mkdtemp(
      join(tmpdir(), 'skin-schema-storefront-'),
    );
    const archives = [];
    for (const bundle of BUNDLES) {
      currentProduct = bundle.id;
      stage = 'resolve-source';
      const clips = await resolveMasters(config.shares[bundle.id], bundle);
      const directory = join(temporaryDirectory, bundle.id);
      stage = 'download-originals';
      const downloaded = await downloadOriginals(clips, directory);
      stage = 'prepare-archive';
      archives.push({
        bundle,
        archive: await prepareArchive(bundle, downloaded, directory),
      });
    }
    for (const { bundle, archive } of archives) {
      currentProduct = bundle.id;
      stage = 'upload-and-verify-r2';
      await uploadArchive(r2Client, commands, config, bundle, archive);
    }
    const products = {};
    const results = [];
    for (const { bundle, archive } of archives) {
      currentProduct = bundle.id;
      stage = 'configure-test-stripe';
      const price = await ensureTestPrice(stripe, bundle);
      products[bundle.id] = {
        stripePriceId: price.stripePriceId,
        objectKey: bundle.objectKey,
      };
      results.push({
        catalogId: bundle.id,
        sourceCount: bundle.count,
        sourceBytes: bundle.sourceBytes,
        objectKey: bundle.objectKey,
        objectBytes: archive.bytes,
        sha256: archive.sha256,
        ...price,
      });
    }
    stage = 'complete';
    console.log(
      JSON.stringify({
        ok: true,
        STOREFRONT_PRODUCTS_JSON: products,
        bundles: results,
      }),
    );
  }
} catch (error) {
  console.error(
    JSON.stringify({
      ok: false,
      stage,
      ...(currentProduct ? { productId: currentProduct } : {}),
      errorCode:
        error instanceof PreparationError ? error.code : 'preparation_failed',
    }),
  );
  process.exitCode = 1;
} finally {
  r2Client?.destroy();
  if (temporaryDirectory)
    await rm(temporaryDirectory, { recursive: true, force: true }).catch(
      () => {},
    );
}
