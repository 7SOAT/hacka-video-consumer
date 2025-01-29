using System.Net;
using Amazon.SQS;
using Amazon.SQS.Model;

namespace hacka_video_consumer;

public class SqsConsumerService : BackgroundService
{
    private readonly IAmazonSQS _sqs;
    public SqsConsumerService(IAmazonSQS sqs){
        _sqs = sqs;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var receiveRequest = new ReceiveMessageRequest{
            QueueUrl = "https://localhost.localstack.cloud:4566/000000000000/frame-extractor-queue",
            MessageAttributeNames = new List<string>{"All"},
            AttributeNames = new List<string>{"All"}
        };

        while(!stoppingToken.IsCancellationRequested) {
            var messageResponse = await _sqs.ReceiveMessageAsync(receiveRequest, stoppingToken);

            if (messageResponse.HttpStatusCode != HttpStatusCode.OK) {
                continue;
            }

            foreach (var message in messageResponse.Messages)
            {
                Console.WriteLine(message.Body);
                await _sqs.DeleteMessageAsync(receiveRequest.QueueUrl, message.ReceiptHandle, stoppingToken);
            }
        }
    }
}
