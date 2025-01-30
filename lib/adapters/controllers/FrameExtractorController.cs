using hacka_video_consumer.lib.adapters.controllers.ports;
using hacka_video_consumer.lib.adapters.gateways;
using hacka_video_consumer.lib.core.entities;

namespace hacka_video_consumer.lib.adapters.controllers;

public class FrameExtractorController : IFrameExtractorControllerPorts
{
    private readonly S3ClientGateway _s3Client;
    public FrameExtractorController( S3ClientGateway s3Client)
    {
        _s3Client = s3Client;
    }

    public async Task Execute(IVideoData input)
    {
        await _s3Client.GetS3Object("frame-extractor-storage", input.S3Key);
    }
}