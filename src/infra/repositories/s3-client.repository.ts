import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import fs from "fs-extra";
import * as path from "node:path";
import { logger } from "../../core/utils/logger";

export class S3ClientRepository {
  private _s3Client: S3Client;

  constructor(
    private _region: string,
    private _accessKeyID: string,
    private _secretAccessKey: string,
    private _sessionToken: string
  ) {
    this._s3Client = new S3Client({
      region: this._region,
      credentials: {
        accessKeyId: this._accessKeyID || "",
        secretAccessKey: this._secretAccessKey || "",
        sessionToken: this._sessionToken || "",
      },
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
    logger.info(`⬇️ Initializing video download: ${bucket}/${objectKey}`);
    const tempDir = path.join(process.cwd(), "temp");
    await fs.ensureDir(tempDir);
    const filePath = path.join(tempDir, path.basename(objectKey));

    const input = {
      Bucket: bucket,
      Key: objectKey,
    };
    const command = new GetObjectCommand(input);
    const { Body } = await this._s3Client.send(command);

    const buffer = await this.streamToBuffer(Body);

    fs.writeFileSync(filePath, buffer);

    logger.info(`✅ Video downloaded to: ${filePath}`);
    return filePath;
  }

  async uploadFile({ bucket, key, filePath }: UploadParams): Promise<void> {
    logger.info(`🚀 Initializing upload: ${bucket}/${key}`);
    const fileStream = fs.createReadStream(filePath);

    const upload = new Upload({
      client: this._s3Client,
      params: {
        Bucket: bucket,
        Key: key,
        Body: fileStream,
        ContentType: "application/zip",
      },
    });

    upload.on("httpUploadProgress", (progress) => {
      console.log("🚀 Upload Progress:", JSON.stringify(progress));
    });

    try {
      const result = await upload.done();
      logger.info(`✅ File uploaded: ${result.Key}`);
    } catch (error) {
      console.error("😿 Upload Error:", JSON.stringify(error));
    }
  }
}
