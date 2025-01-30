namespace hacka_video_consumer.lib.application.use_cases.ports;

public interface IDownloadVideoUseCase
{
    Task Execute(string s3Key, string bucketName);
}