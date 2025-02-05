using hacka_video_consumer.lib.adapters.gateways;
using hacka_video_consumer.lib.application.use_cases;

namespace hacka_video_consumer.lib.application.services;

public class ProcessVideoUseCase
{
    private readonly ExtractVideoFrames _extractor;
    private readonly UploadFileToS3Async _uploader;
    private readonly ILogger<ProcessVideoUseCase> _logger;

    public ProcessVideoUseCase(ExtractVideoFrames extractor, UploadFileToS3Async uploader, ILogger<ProcessVideoUseCase> logger)
    {
        _extractor = extractor;
        _uploader = uploader;
        _logger = logger;
    }

    public async Task ProcessAsync(string videoPath, string userId, string videoId)
    {
        try
        {
            _logger.LogInformation($"Processing video: {videoPath}");

            string? zipFilePath = await _extractor.ExtractFramesAsync(videoPath, videoId);

            if (zipFilePath == null)
            {
                _logger.LogError("Failed to extract frames. Stopping process.");
                return;
            }

            _logger.LogInformation($"Frames extracted and saved to {zipFilePath}");

            await _uploader.UploadFileAsync(zipFilePath, userId, videoId);

            _logger.LogInformation("Process completed successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error processing video: {ex.Message}");
        }
    }
}