import { Consumer } from 'sqs-consumer';
import { Message, SQSClient } from "@aws-sdk/client-sqs";
import { S3ClientRepository } from "./infra/repositories/s3-client.repository";
import { FfmpegRepository } from "./infra/repositories/ffmpeg.repository";
import { ZipRepository } from "./infra/repositories/zip.repository";
import { VideoProcessingMessage } from './core/entities/video-processing-message';

require('dotenv').config();

const handleMessage = async (message: Message) => {
    try {
        console.log(`✉️ Nova mensagem`, message);

        const s3Repository = new S3ClientRepository(
            process.env.AWS_REGION!,
            process.env.AWS_ACCESS_KEY_ID!,
            process.env.AWS_SECRET_ACCESS_KEY!,
            process.env.AWS_SESSION_TOKEN!
        );
        
        const videoData: VideoProcessingMessage = JSON.parse(message?.Body || "");
                
        const filePath: string = await s3Repository.download(
            process.env.VIDEOS_BUCKET_NAME!,
            videoData.s3key
        );

        const framesDir = await FfmpegRepository.extractFrames(filePath, 1);
        const zipPath = await ZipRepository.zipDirectory(framesDir);

        await s3Repository.uploadFile({
            bucket: process.env.FRAMES_BUCKET_NAME!,
            key: `${videoData.userId}/${videoData.videoId}/frames.zip`,
            filePath: zipPath
        });

        console.log("✅ Processo finalizado com sucesso!");
    } catch (error) {
        console.error("❌ Erro no processamento:", error);
    }
};

const app = Consumer.create({
    queueUrl: process.env.VIDEO_PROCESSING_QUEUE_URL!,
    handleMessage,
    sqs: new SQSClient({
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            sessionToken: process.env.AWS_SESSION_TOKEN || ''
        }
    })
});

app.on('error', (err) => console.error(err));
app.on("processing_error", (err) => console.error(err));

app.start();


app.on('error', (err) => {
    console.error(err)
    console.log(process.env.AWS_ACCESS_KEY_ID, process.env.SECRET_ACCESS_KEY, process.env.SESSION_TOKEN)
})

app.on("processing_error", (err) => {
    console.error(err)
})

app.start()