import path from 'path';
import { Consumer } from 'sqs-consumer'
import {SQSClient} from "@aws-sdk/client-sqs";
import {S3ClientRepository} from "./infra/repositories/s3-client.repository";
import {FfmpegRepository} from "./infra/repositories/ffmpeg.repository";
require('dotenv').config();

const handleMessage = async (message: any) => {
    console.log(message)
    const body = JSON.parse(message.Body)
    const filePath: string = await S3ClientRepository.download(body.s3Key)
    await FfmpegRepository.extractFrames(filePath, 1)
}

const app = Consumer.create({
    queueUrl: 'https://sqs.us-east-1.amazonaws.com/870947314561/frame-extractor-queue',
    handleMessage,
    sqs: new SQSClient({
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
            sessionToken: process.env.SESSION_TOKEN || ''
        }
    })
})

app.on('error', (err) => {
    console.error(err)
    console.log(process.env.AWAWS_ACCESS_KEY_ID, process.env.SECRET_ACCESS_KEY, process.env.SESSION_TOKEN)
})

app.on("processing_error", (err) => {
    console.error(err)
})

app.start()