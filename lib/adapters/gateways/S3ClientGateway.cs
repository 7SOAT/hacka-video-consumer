using Amazon.S3;

namespace hacka_video_consumer.lib.adapters.gateways;

public interface S3ClientGateway
{
    Task GetS3Object(string bucketName, string key);
}