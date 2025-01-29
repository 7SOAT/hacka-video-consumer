using Amazon.SQS;
using hacka_video_consumer;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHostedService<SqsConsumerService>();
builder.Services.AddSingleton<IAmazonSQS>(_ => {
    var awsCredentials = new Amazon.Runtime.BasicAWSCredentials("sua-access-key-id", "sua-secret-access-key");
    var sqsConfig = new AmazonSQSConfig
        {
            ServiceURL = "https://localhost.localstack.cloud:4566",
            UseHttp = true
        };

    return new AmazonSQSClient(awsCredentials, sqsConfig);
});

var app = builder.Build();

app.Run();
