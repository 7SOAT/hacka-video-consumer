using System.Net;
using System.Text.Json;
using Amazon.SQS;
using Amazon.SQS.Model;
using hacka_video_consumer.lib.adapters.controllers;
using hacka_video_consumer.lib.adapters.controllers.ports;
using hacka_video_consumer.lib.adapters.gateways;
using hacka_video_consumer.lib.core.entities;

namespace hacka_video_consumer;

public class SqsClientRepository : BackgroundService
{
    private readonly IAmazonSQS _sqs;
    private readonly IFrameExtractorControllerPorts _frameExtractorController;
    public SqsClientRepository(IAmazonSQS sqs, IFrameExtractorControllerPorts frameExtractorController)
    {
        _sqs = sqs;
        _frameExtractorController = frameExtractorController;
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
                IVideoData json = JsonSerializer.Deserialize<IVideoData>(message.Body);
                await _frameExtractorController.Execute(json);
                await _sqs.DeleteMessageAsync(receiveRequest.QueueUrl, message.ReceiptHandle, stoppingToken);
            }
        }
    }
}
