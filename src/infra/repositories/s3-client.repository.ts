import {GetObjectCommand, S3Client} from '@aws-sdk/client-s3'
import fs from 'fs-extra';
import * as path from "node:path";

export class S3ClientRepository {

    private static async streamToBuffer(stream: any) {
        const chunks = [];
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        return Buffer.concat(chunks);
    }

    static async download(objectKey: string): Promise<string> {
        console.log("Object Key",objectKey);
        const tempDir = path.join(process.cwd(), "temp");
        await fs.ensureDir(tempDir);
        const filePath = path.join(tempDir, path.basename(objectKey));

        const s3Client = new S3Client({
            region: 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
                sessionToken: process.env.SESSION_TOKEN || ''
            }
        })

        const input = {
            "Bucket": process.env.VIDEOS_BUCKET_NAME,
            "Key": objectKey
        };
        const command = new GetObjectCommand(input);
        const { Body } = await s3Client.send(command);

        const buffer = await this.streamToBuffer(Body);

        fs.writeFileSync(filePath, buffer);

        console.log(`✅ Arquivo salvo em: ${filePath}`);
        return filePath;
    }
}