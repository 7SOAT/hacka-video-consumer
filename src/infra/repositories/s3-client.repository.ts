import {GetObjectCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage';
import fs from 'fs-extra';
import * as path from "node:path";

export class S3ClientRepository {    
    private _s3Client: S3Client;

    constructor(
        private _region: string,
        private _accessKeyID: string,
        private _secretAccessKey: string,
        private _sessionToken: string,
    ) { 
        this._s3Client = new S3Client({
            region: this._region,
            credentials: {
                accessKeyId: this._accessKeyID || '',
                secretAccessKey: this._secretAccessKey || '',
                sessionToken: this._sessionToken || ''
            }
        });
    }
    
    private async streamToBuffer(stream: any) {
        const chunks = [];
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        return Buffer.concat(chunks);
    }

    async download(bucket: string, objectKey: string): Promise<string> {
        console.log(`⬇️ Baixando video: ${bucket}/${objectKey} `);
        const tempDir = path.join(process.cwd(), "temp");
        await fs.ensureDir(tempDir);
        const filePath = path.join(tempDir, path.basename(objectKey));        

        const input = {
            "Bucket": bucket,
            "Key": objectKey
        };
        const command = new GetObjectCommand(input);
        const { Body } = await this._s3Client.send(command);

        const buffer = await this.streamToBuffer(Body);

        fs.writeFileSync(filePath, buffer);

        console.log(`✅ Video salvo em: ${filePath}`);
        return filePath;
    }

    async uploadFile({ bucket, key, filePath }: UploadParams): Promise<void> {
        console.log(`⬆️ Iniciando upload do .zip: ${bucket}/${key}`)
        const fileStream = fs.createReadStream(filePath);

        const upload = new Upload({
            client: this._s3Client,
            params: {
                Bucket: bucket,
                Key: key,
                Body: fileStream,
                ContentType: 'application/zip'
            }
        })

        upload.on("httpUploadProgress", (progress) => {
            console.log("🚀 Upload Progress:", JSON.stringify(progress));
        });
        
        try {
        const result = await upload.done();
            console.log(`✅ .zip salvo no S3: ${bucket}/${key}`, JSON.stringify(result));
        } catch (error) {
            console.error("😿 Upload Error:", JSON.stringify(error));
        }        
    }
}