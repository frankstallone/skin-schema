// Temporary one-off branch repack helper. Remove after remote verification.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdtemp, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const BUNDLES = [
  {
    id: 'bathroom-rituals',
    count: 30,
    sourceBytes: 671077807,
    objectKey: 'bundles/bathroom-rituals.zip',
    originalBytes: 671085692,
    originalSha256:
      '6b2a0e315be557c68ecd70417b5185822e0d0ef477a2ac0d22c50d02b3165dc9',
    renamedBytes: 671087913,
    renamedSha256:
      'a2759ec9f6479aa350988bfa3d4648817271a23e864cfb97f07fd3ccab9202a0',
  },
  {
    id: 'coastal-skin',
    count: 34,
    sourceBytes: 503865840,
    objectKey: 'bundles/coastal-skin.zip',
    originalBytes: 503874634,
    originalSha256:
      '82937fdddba74f9013b3bd596de72766e3c609ffb1dc23351e85a2b2245c0354',
    renamedBytes: 503876746,
    renamedSha256:
      'f399b65a2b4366058d451ca80dbd3a6fbdbafe38f3ca105671d2b66c2da021ac',
  },
];

const ZIP_SCRIPT = String.raw`
import collections, csv, hashlib, io, json, pathlib, re, sys, zipfile

source_path, destination_path = map(pathlib.Path, sys.argv[1:3])
bundle = json.loads(sys.argv[3])
verify_only = sys.argv[4:] == ['--verify-renamed']

def require(condition, code):
    if not condition:
        raise ValueError(code)

def digest_file(path):
    digest = hashlib.sha256()
    with path.open('rb') as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b''):
            digest.update(chunk)
    return digest.hexdigest()

def clip_digest(archive, info):
    digest = hashlib.sha256()
    size = 0
    with archive.open(info) as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b''):
            digest.update(chunk)
            size += len(chunk)
    require(size == info.file_size, 'clip_size_mismatch')
    return size, digest.hexdigest()

def inventory(path, renamed):
    with zipfile.ZipFile(path) as archive:
        entries = archive.infolist()
        names = [entry.filename for entry in entries]
        require(len(names) == bundle['count'] + 2, 'unexpected_entry_count')
        require(len(set(names)) == len(names), 'duplicate_archive_entry')
        require(names[:2] == ['README.txt', 'clip-index.csv'], 'invalid_document_order')
        require(all(entry.compress_type == zipfile.ZIP_STORED for entry in entries), 'compressed_entry')
        readme = archive.read('README.txt').decode('utf-8')
        rows = list(csv.DictReader(io.StringIO(archive.read('clip-index.csv').decode('utf-8'))))
        require(len(rows) == bundle['count'], 'unexpected_clip_index_count')
        require(list(rows[0]) == ['originalName', 'filename', 'bytes', 'sha256'], 'invalid_clip_index_columns')
        clips = []
        for sequence, (info, row) in enumerate(zip(entries[2:], rows), start=1):
            original_name = row['originalName']
            require(original_name and '/' not in original_name and '\\' not in original_name, 'invalid_original_name')
            extension = pathlib.PurePosixPath(original_name).suffix.lower()
            require(extension in ['.mov', '.mp4'], 'unexpected_clip_extension')
            delivered_name = f"clips/skin-schema-{bundle['id']}-{sequence:03d}{extension}"
            if renamed:
                require(info.filename == delivered_name, 'invalid_delivered_filename')
            else:
                require(re.fullmatch(r'clips/' + f'{sequence:03d}' + r'-.+', info.filename) is not None, 'invalid_original_numbering')
            require(row['filename'] == info.filename, 'index_filename_mismatch')
            size, sha256 = clip_digest(archive, info)
            require(row['bytes'] == str(size) and row['sha256'] == sha256, 'index_content_mismatch')
            clips.append({
                'originalName': original_name,
                'filename': delivered_name,
                'previousFilename': info.filename,
                'bytes': size,
                'sha256': sha256,
            })
        require(sum(clip['bytes'] for clip in clips) == bundle['sourceBytes'], 'source_byte_total_mismatch')
        return readme, clips

def entry(name):
    result = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
    result.compress_type = zipfile.ZIP_STORED
    result.create_system = 3
    result.external_attr = 0o100644 << 16
    return result

try:
    source_sha256 = digest_file(source_path)
    source_bytes = source_path.stat().st_size
    expected_sha256 = bundle['renamedSha256'] if verify_only else bundle['originalSha256']
    expected_bytes = bundle['renamedBytes'] if verify_only else bundle['originalBytes']
    require(source_sha256 == expected_sha256 and source_bytes == expected_bytes, 'source_archive_mismatch')
    source_readme, source_clips = inventory(source_path, renamed=verify_only)
    if verify_only:
        archive_path = source_path
        output_clips = source_clips
    else:
        old_explanation = 'Numeric prefixes prevent duplicate and case-sensitive filename collisions.\nclip-index.csv records original names, archive names, byte sizes, and SHA-256 hashes.\n'
        require(source_readme.count(old_explanation) == 1, 'unexpected_original_readme')
        new_explanation = (
            'Delivered filenames use skin-schema-<bundle-id>-<three-digit-sequence>.<lowercase-original-extension>.\n'
            f"Example: skin-schema-{bundle['id']}-001.mov.\n"
            "Sequence numbers preserve this bundle's clip order; all video bytes are unchanged.\n"
            'clip-index.csv maps each delivered filename to its original source filename, byte size, and SHA-256 hash.\n'
        )
        output_readme = source_readme.replace(old_explanation, new_explanation)
        index = io.StringIO(newline='')
        writer = csv.writer(index, lineterminator='\n')
        writer.writerow(['originalName', 'filename', 'bytes', 'sha256'])
        for clip in source_clips:
            writer.writerow([clip['originalName'], clip['filename'], clip['bytes'], clip['sha256']])
        require(not destination_path.exists(), 'output_already_exists')
        with zipfile.ZipFile(source_path) as source, zipfile.ZipFile(destination_path, 'x', compression=zipfile.ZIP_STORED, allowZip64=True) as target:
            target.writestr(entry('README.txt'), output_readme.encode('utf-8'))
            target.writestr(entry('clip-index.csv'), index.getvalue().encode('utf-8'))
            for clip in source_clips:
                info = entry(clip['filename'])
                info.file_size = clip['bytes']
                with source.open(clip['previousFilename']) as original, target.open(info, 'w', force_zip64=True) as delivered:
                    for chunk in iter(lambda: original.read(1024 * 1024), b''):
                        delivered.write(chunk)
        archive_path = destination_path
        delivered_readme, output_clips = inventory(archive_path, renamed=True)
        require(delivered_readme == output_readme, 'readme_mismatch')
        compare_fields = ['originalName', 'filename', 'bytes', 'sha256']
        require(
            [[clip[field] for field in compare_fields] for clip in source_clips] ==
            [[clip[field] for field in compare_fields] for clip in output_clips],
            'clip_order_or_content_changed',
        )
        require(
            collections.Counter((clip['bytes'], clip['sha256']) for clip in source_clips) ==
            collections.Counter((clip['bytes'], clip['sha256']) for clip in output_clips),
            'video_hash_multiset_changed',
        )
    renamed_bytes = archive_path.stat().st_size
    renamed_sha256 = digest_file(archive_path)
    if bundle['renamedBytes']:
        require(renamed_bytes == bundle['renamedBytes'] and renamed_sha256 == bundle['renamedSha256'], 'renamed_archive_mismatch')
    print(json.dumps({
        'id': bundle['id'],
        'clipCount': len(output_clips),
        'sourceBytes': bundle['sourceBytes'],
        'originalBytes': bundle['originalBytes'],
        'originalSha256': bundle['originalSha256'],
        'renamedBytes': renamed_bytes,
        'renamedSha256': renamed_sha256,
        'videoBytesUnchanged': True,
        'clipOrderUnchanged': True,
        'inventory': source_clips if not verify_only else [
            {key: value for key, value in clip.items() if key != 'previousFilename'}
            for clip in output_clips
        ],
    }))
except Exception:
    print(json.dumps({'ok': False, 'errorCode': 'archive_verification_failed'}), file=sys.stderr)
    sys.exit(1)
`;

class RepackError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

function requireCondition(condition, code) {
  if (!condition) throw new RepackError(code);
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
  requireCondition(
    /^(sk|rk)_test_[A-Za-z0-9]+$/.test(required('STRIPE_SECRET_KEY')),
    'not_a_test_key',
  );
  const accountId = required('R2_ACCOUNT_ID');
  requireCondition(/^[a-f0-9]{32}$/.test(accountId), 'invalid_r2_account');
  requireCondition(
    BUNDLES.every(
      (bundle) =>
        Number.isSafeInteger(bundle.renamedBytes) &&
        bundle.renamedBytes > bundle.sourceBytes &&
        /^[a-f0-9]{64}$/.test(bundle.renamedSha256),
    ),
    'missing_expected_renamed_archive',
  );
  return {
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

function inspectArchive(bundle, sourcePath, outputPath, renamed = false) {
  const packed = spawnSync(
    'python3',
    [
      '-c',
      ZIP_SCRIPT,
      sourcePath,
      outputPath,
      JSON.stringify(bundle),
      ...(renamed ? ['--verify-renamed'] : []),
    ],
    { stdio: 'pipe', maxBuffer: 1024 * 1024 },
  );
  requireCondition(packed.status === 0, 'archive_verification_failed');
  let result;
  try {
    result = JSON.parse(packed.stdout.toString('utf8'));
  } catch {
    throw new RepackError('invalid_archive_verification_result');
  }
  requireCondition(
    result.id === bundle.id &&
      result.clipCount === bundle.count &&
      result.renamedBytes === bundle.renamedBytes &&
      result.renamedSha256 === bundle.renamedSha256 &&
      result.videoBytesUnchanged === true &&
      result.clipOrderUnchanged === true,
    'archive_verification_result_mismatch',
  );
  return result;
}

async function downloadArchive(client, commands, config, bundle, path) {
  const object = await client.send(
    new commands.GetObjectCommand({
      Bucket: config.bucket,
      Key: bundle.objectKey,
    }),
    { abortSignal: AbortSignal.timeout(15 * 60 * 1000) },
  );
  const permittedBytes = [bundle.originalBytes, bundle.renamedBytes];
  requireCondition(
    object.Body && permittedBytes.includes(object.ContentLength),
    'unexpected_r2_archive_size',
  );
  const hash = createHash('sha256');
  let bytes = 0;
  const verifier = new Transform({
    transform(chunk, encoding, callback) {
      bytes += chunk.length;
      if (bytes > object.ContentLength)
        return callback(new RepackError('r2_archive_size_mismatch'));
      hash.update(chunk);
      callback(null, chunk);
    },
  });
  await pipeline(
    object.Body,
    verifier,
    createWriteStream(path, { flags: 'wx' }),
  );
  requireCondition(bytes === object.ContentLength, 'r2_archive_size_mismatch');
  const sha256 = hash.digest('hex');
  const original =
    bytes === bundle.originalBytes && sha256 === bundle.originalSha256;
  const renamed =
    bytes === bundle.renamedBytes && sha256 === bundle.renamedSha256;
  requireCondition(original || renamed, 'unexpected_r2_archive_hash');
  requireCondition(
    !renamed || object.Metadata?.sha256 === bundle.renamedSha256,
    'r2_metadata_hash_mismatch',
  );
  const contentHeaders = Object.fromEntries(
    [
      'CacheControl',
      'ContentDisposition',
      'ContentEncoding',
      'ContentLanguage',
      'ContentType',
      'Expires',
    ]
      .filter((name) => object[name] !== undefined)
      .map((name) => [name, object[name]]),
  );
  return {
    original,
    renamed,
    contentHeaders,
    metadata: { ...object.Metadata, sha256: bundle.renamedSha256 },
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
    const commands = await import('@aws-sdk/client-s3');
    r2Client = new commands.S3Client(config.r2);
    temporaryDirectory = await mkdtemp(join(tmpdir(), 'skin-schema-rename-'));
    const archives = [];
    // Validate and prepare both bundles before the first write.
    for (const bundle of BUNDLES) {
      currentProduct = bundle.id;
      const sourcePath = join(temporaryDirectory, `${bundle.id}-current.zip`);
      const archivePath = join(temporaryDirectory, `${bundle.id}-renamed.zip`);
      stage = 'download-current-archive';
      const current = await downloadArchive(
        r2Client,
        commands,
        config,
        bundle,
        sourcePath,
      );
      stage = 'repack-and-verify-archive';
      const result = inspectArchive(
        bundle,
        sourcePath,
        archivePath,
        current.renamed,
      );
      if (current.original) await rm(sourcePath);
      archives.push({
        bundle,
        path: current.renamed ? sourcePath : archivePath,
        changed: !current.renamed,
        contentHeaders: {
          ...current.contentHeaders,
          ...(current.contentHeaders.ContentDisposition
            ? {
                ContentDisposition: `attachment; filename="skin-schema-${bundle.id}.zip"`,
              }
            : {}),
        },
        metadata: current.metadata,
        result,
      });
    }
    const results = [];
    for (const archive of archives) {
      const { bundle } = archive;
      currentProduct = bundle.id;
      if (archive.changed) {
        stage = 'upload-renamed-archive';
        const file = await stat(archive.path);
        requireCondition(
          file.size === bundle.renamedBytes,
          'prepared_archive_size_mismatch',
        );
        await r2Client.send(
          new commands.PutObjectCommand({
            Bucket: config.bucket,
            Key: bundle.objectKey,
            Body: createReadStream(archive.path),
            ContentLength: bundle.renamedBytes,
            ...archive.contentHeaders,
            Metadata: archive.metadata,
          }),
          { abortSignal: AbortSignal.timeout(15 * 60 * 1000) },
        );
        stage = 'full-readback-verification';
        const verificationPath = join(
          temporaryDirectory,
          `${bundle.id}-readback.zip`,
        );
        const verified = await downloadArchive(
          r2Client,
          commands,
          config,
          bundle,
          verificationPath,
        );
        requireCondition(verified.renamed, 'r2_readback_mismatch');
        requireCondition(
          Object.entries(archive.metadata).every(
            ([name, value]) => verified.metadata[name] === value,
          ) &&
            Object.entries(archive.contentHeaders).every(
              ([name, value]) =>
                String(verified.contentHeaders[name]) === String(value),
            ),
          'r2_preserved_headers_or_metadata_mismatch',
        );
        inspectArchive(bundle, verificationPath, verificationPath, true);
        await rm(verificationPath);
      }
      results.push({
        productId: bundle.id,
        objectKey: bundle.objectKey,
        clipCount: bundle.count,
        sourceBytes: bundle.sourceBytes,
        objectBytes: bundle.renamedBytes,
        sha256: bundle.renamedSha256,
        videoBytesUnchanged: true,
        clipOrderUnchanged: true,
        uploaded: archive.changed,
        fullGetVerified: true,
      });
    }
    stage = 'complete';
    console.log(
      JSON.stringify({ ok: true, stripeTestOnly: true, bundles: results }),
    );
  }
} catch (error) {
  console.error(
    JSON.stringify({
      ok: false,
      stage,
      ...(currentProduct ? { productId: currentProduct } : {}),
      errorCode: error instanceof RepackError ? error.code : 'repack_failed',
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
