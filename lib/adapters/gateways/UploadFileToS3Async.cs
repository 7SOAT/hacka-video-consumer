using Amazon.S3;
using Amazon.S3.Transfer;

namespace hacka_video_consumer.lib.adapters.gateways;

public class UploadFileToS3Async
{
    private readonly IAmazonS3 _s3Client;
    private readonly ILogger<UploadFileToS3Async> _logger;
    private readonly string _bucketName;

    public UploadFileToS3Async(IAmazonS3 s3Client, ILogger<UploadFileToS3Async> logger, string bucketName)
    {
        _s3Client = s3Client;
        _logger = logger;
        _bucketName = bucketName;
    }

    public async Task UploadFileAsync(string filePath, string userId, string videoId)
    {
        try
        {
            string s3Key = $"{userId}/{videoId}/frames.zip";
            _logger.LogInformation($"Uploading {filePath} to S3: {s3Key}");

            var transferUtility = new TransferUtility(_s3Client);
            await transferUtility.UploadAsync(filePath, _bucketName, s3Key);

            _logger.LogInformation($"Upload successful: {s3Key}");
        }
        catch (AmazonS3Exception ex)
        {
            _logger.LogError($"Upload failed: {ex.Message}");
        }
    }
}