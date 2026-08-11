import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const DOWNLOAD_TTL_SECONDS = 300;

export async function createDownloadUrl(
  r2: {
    region: string;
    endpoint: string;
    credentials: { accessKeyId: string; secretAccessKey: string };
    bucket: string;
    objectKey: string;
  },
  filename: string,
) {
  const client = new S3Client({
    region: r2.region,
    endpoint: r2.endpoint,
    credentials: r2.credentials,
  });

  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: r2.bucket,
      Key: r2.objectKey,
      ResponseContentDisposition: `attachment; filename="${filename}"`,
    }),
    { expiresIn: DOWNLOAD_TTL_SECONDS },
  );
}
