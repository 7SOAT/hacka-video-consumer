using Amazon.S3;
using Amazon.SQS;
using hacka_video_consumer;
using hacka_video_consumer.lib.adapters.controllers;
using hacka_video_consumer.lib.adapters.controllers.ports;
using hacka_video_consumer.lib.adapters.gateways;
using hacka_video_consumer.lib.application.services;
using hacka_video_consumer.lib.application.use_cases;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHostedService<SqsClientRepository>();
builder.Services.AddSingleton<IAmazonSQS>(_ => {
    var awsCredentials = new Amazon.Runtime.BasicAWSCredentials("sua-access-key-id", "sua-secret-access-key");
    var sqsConfig = new AmazonSQSConfig
        {
            ServiceURL = "https://localhost.localstack.cloud:4566",
            UseHttp = true
        };

    return new AmazonSQSClient(awsCredentials, sqsConfig);
});
builder.Services.AddSingleton<IAmazonS3>(_ =>
{
    var awsCredentials = new Amazon.Runtime.BasicAWSCredentials("sua-access-key-id", "sua-secret-access-key");
    var s3Config = new AmazonS3Config
    {
        ServiceURL = "https://localhost.localstack.cloud:4566",
        UseHttp = true
    };
    return new AmazonS3Client(awsCredentials, s3Config);
});
builder.Services.AddSingleton<S3ClientGateway, S3ClientRepository>();
builder.Services.AddSingleton<IFrameExtractorControllerPorts, FrameExtractorController>();
builder.Services.AddSingleton<ExtractVideoFrames>(provider =>
{
    var logger = provider.GetRequiredService<ILogger<ExtractVideoFrames>>();
    return new ExtractVideoFrames("/usr/bin/ffmpeg", logger);
});
builder.Services.AddSingleton<UploadFileToS3Async>(provider =>
{
    var s3Client = provider.GetRequiredService<IAmazonS3>();
    var logger = provider.GetRequiredService<ILogger<UploadFileToS3Async>>();
    string bucketName = "https://localhost.localstack.cloud:4566/frame-extractor-storage/";
    return new UploadFileToS3Async(s3Client, logger, bucketName);
});
builder.Services.AddSingleton<ProcessVideoUseCase>();

var app = builder.Build();

app.Run();
