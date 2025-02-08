import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';

type UploadParams = {
    bucket: string;
    key: string;
    filePath: string;
};

export class UploadRepository {
    private static s3Client = new S3Client({
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
            sessionToken: process.env.SESSION_TOKEN || ''
        }
    });

    static async uploadFile({ bucket, key, filePath }: UploadParams): Promise<void> {
        const fileStream = fs.createReadStream(filePath);

        const uploadParams = {
            Bucket: bucket,
            Key: key,
            Body: fileStream,
            ContentType: 'application/zip'
        };

        await this.s3Client.send(new PutObjectCommand(uploadParams));
        console.log(`✅ Arquivo ${key} enviado para o S3 (${bucket}).`);
    }
}
