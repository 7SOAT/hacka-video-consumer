import path from 'path';
import { Consumer } from 'sqs-consumer';
import { SQSClient } from "@aws-sdk/client-sqs";
import { S3ClientRepository } from "./infra/repositories/s3-client.repository";
import { FfmpegRepository } from "./infra/repositories/ffmpeg.repository";
import { ZipRepository } from "./infra/repositories/video-frames-zip.repository";
import { UploadRepository } from "./infra/repositories/upload-s3-client.repository";

require('dotenv').config();

const handleMessage = async (message: any) => {
    try {
        console.log(message);
        const body = JSON.parse(message.Body);
        const filePath: string = await S3ClientRepository.download(body.s3Key);
        const framesDir = await FfmpegRepository.extractFrames(filePath, 1);
        const zipPath = path.join(process.cwd(), "temp", "frames.zip");

        await ZipRepository.zipDirectory(framesDir, zipPath);

        await UploadRepository.uploadFile({
            bucket: process.env.VIDEOS_BUCKET_NAME!,
            key: `processed/${path.basename(zipPath)}`,
            filePath: zipPath
        });

        console.log("✅ Processo finalizado com sucesso!");
    } catch (error) {
        console.error("❌ Erro no processamento:", error);
    }
};

const app = Consumer.create({
    queueUrl: process.env.SQS_QUEUE_URL!,
    handleMessage,
    sqs: new SQSClient({
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
            sessionToken: process.env.SESSION_TOKEN || ''
        }
    })
});

app.on('error', (err) => console.error(err));
app.on("processing_error", (err) => console.error(err));

app.start();


app.on('error', (err) => {
    console.error(err)
    console.log(process.env.AWAWS_ACCESS_KEY_ID, process.env.SECRET_ACCESS_KEY, process.env.SESSION_TOKEN)
})

app.on("processing_error", (err) => {
    console.error(err)
})

app.start()