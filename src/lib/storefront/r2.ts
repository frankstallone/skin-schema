import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const DOWNLOAD_TTL_SECONDS = 300;

export async function createDownloadUrl(
  r2: {
    region: string;
    endpoint: string;
    credentials: { accessKeyId: string; secretAccessKey: string };
    bucket: string;
  },
  objectKey: string,
  filename: string,
  accessExpiresAt: number,
) {
  const signingDate = new Date();
  const expiresIn = Math.min(
    DOWNLOAD_TTL_SECONDS,
    Math.floor(accessExpiresAt - signingDate.getTime() / 1000),
  );
  if (!Number.isFinite(expiresIn) || expiresIn < 1) return null;

  const client = new S3Client({
    region: r2.region,
    endpoint: r2.endpoint,
    credentials: r2.credentials,
  });

  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: r2.bucket,
      Key: objectKey,
      ResponseContentDisposition: `attachment; filename="${filename}"`,
    }),
    { expiresIn, signingDate },
  );
}
