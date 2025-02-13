import { Consumer } from "sqs-consumer";
import { Message, SQSClient } from "@aws-sdk/client-sqs";
import { S3ClientRepository } from "./infra/repositories/s3-client.repository";
import { FfmpegRepository } from "./infra/repositories/ffmpeg.repository";
import { ZipRepository } from "./infra/repositories/zip.repository";
import { VideoProcessingMessage } from "./core/entities/video-processing-message";
import { logger } from "./core/utils/logger";
import ApiService from "./infra/service/api.service";
import SQSService from "./infra/aws/sqs.service";
import { log } from "node:console";

require("dotenv").config();

const handleMessage = async (message: Message) => {
  const videoData: VideoProcessingMessage = JSON.parse(message?.Body || "");

  const apiService = new ApiService(process.env.VIDEO_SERVICE_URL || "");

  const sqsService = new SQSService();

  try {
    logger.info(`📦 Initializing new message ${JSON.stringify(message)}`);
    const s3Repository = new S3ClientRepository(
      process.env.AWS_REGION!,
      process.env.AWS_ACCESS_KEY_ID!,
      process.env.AWS_SECRET_ACCESS_KEY!,
      process.env.AWS_SESSION_TOKEN!
    );

    const filePath: string = await s3Repository.download(
      process.env.VIDEOS_BUCKET_NAME!,
      videoData.s3Key
    );

    logger.info(`📦 Downloaded file from S3: ${filePath}`);
    const framesDir = await FfmpegRepository.extractFrames(filePath, 1);

    logger.info(`📦 Extracted frames to: ${framesDir}`);
    const zipPath = await ZipRepository.zipDirectory(framesDir);

    await s3Repository.uploadFile({
      bucket: process.env.FRAMES_BUCKET_NAME!,
      key: `${videoData.userId}/${videoData.videoId}/frames.zip`,
      filePath: zipPath,
    });


    const response = await apiService.put(
      `/videos`,
      {
        id: videoData.videoId,
        userId: videoData.userId,
        s3Key: videoData.s3Key,
        status: "completed",
        s3ZipKey: `${videoData.userId}/${videoData.videoId}/frames.zip`,
      }
    );
    logger.info(`📦 Updated video status: ${JSON.stringify(response)}`);


    await sqsService.sendMessage({
      userId: response.userId,
      s3Key: response.s3Key,
      s3ZipKey: response.s3ZipKey,
      typeEmail: "videoCompleted",
      subject: "Video Processed",
    });

    logger.info(`📦 Uploaded zip file to S3: ${zipPath}`);
  } catch (error) {
    logger.error(`📦 Error processing message: ${error}`);

    apiService.put('videos', {
      userId: videoData.userId,
      id: videoData.videoId,
      s3Key: videoData.s3Key,
      status: 'failed',
    });
    logger.info(`📦 Updated video status to failed`);

    await sqsService.sendMessage({
      userId: videoData.userId,
      s3Key: videoData.s3Key,
      typeEmail: "videoError",
      subject: "Video with error",
    });

    logger.info(`📦 Sent email to user when video is failed`);

    throw error;
  }
};

const app = Consumer.create({
  queueUrl: process.env.VIDEO_PROCESSING_QUEUE_URL!,
  handleMessage,
  sqs: new SQSClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      sessionToken: process.env.AWS_SESSION_TOKEN || "",
    },
  }),
});

app.on("error", (err) => console.error(err));
app.on("processing_error", (err) => console.error(err));

app.start();

app.on("error", (err) => {
  console.error(err);
  console.log(
    process.env.AWS_ACCESS_KEY_ID,
    process.env.SECRET_ACCESS_KEY,
    process.env.SESSION_TOKEN
  );
});

app.on("processing_error", (err) => {
  console.error(err);
});

app.start();
