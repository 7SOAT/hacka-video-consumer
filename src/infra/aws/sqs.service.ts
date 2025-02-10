import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { logger } from "../../core/utils/logger";

class SQSService {
  private sqs: SQSClient;
  private queueUrl: string = process.env.VIDEO_NOTIFICATION_QUEUE_URL!;

  constructor() {
    this.sqs = new SQSClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        sessionToken: process.env.AWS_SESSION_TOKEN!,
      },
    });
    logger.info("SQSService initialized");
  }

  async sendMessage(message: Record<string, any>): Promise<void> {
    try {
      logger.info(`Sending message to SQS: ${message}`);
      const command = new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: JSON.stringify(message),
      });
      const response = await this.sqs.send(command);
      logger.info(`Message sent with message id: ${response.MessageId}`);
    } catch (error) {
      logger.error("Error sending message to SQS:", error);
      throw error;
    }
  }
}

export default SQSService;
