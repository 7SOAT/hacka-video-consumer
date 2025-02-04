using System.Diagnostics;
using System.IO.Compression;

namespace hacka_video_consumer.lib.application.use_cases;

public class ExtractVideoFrames
{

    private readonly string _ffmpegPath;
    private readonly ILogger<ExtractVideoFrames> _logger;
    
    public ExtractVideoFrames(string ffmpegPath, ILogger<ExtractVideoFrames> logger)
    {
        _ffmpegPath = ffmpegPath;
        _logger = logger;
    }
        
    public async Task<string?> ExtractFramesAsync(string videoPath, string videoId)
    {
        string framesDir = "/tmp/frames";
        string tmpPath = "/tmp/";

        if (!Directory.Exists(framesDir))
            Directory.CreateDirectory(framesDir);

        try
        {
            _logger.LogInformation($"Extracting frames from: {videoPath}");

            string outputPattern = Path.Combine(framesDir, "frame_%04d.jpg");
            string arguments = $"-i {videoPath} -vf fps=1 -vsync vfr {outputPattern}";

            var processStartInfo = new ProcessStartInfo
            {
                FileName = _ffmpegPath,
                Arguments = arguments,
                RedirectStandardError = true,
                UseShellExecute = false
            };

            using (var process = Process.Start(processStartInfo))
            {
                await process.WaitForExitAsync();
                string output = await process.StandardError.ReadToEndAsync();
                _logger.LogInformation($"FFmpeg Output: {output}");
            }

            string zipFilePath = Path.Combine(tmpPath, $"{videoId}.zip");
            ZipFile.CreateFromDirectory(framesDir, zipFilePath);

            _logger.LogInformation($"Frames saved at: {zipFilePath}");
            return zipFilePath;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error extracting frames: {ex.Message}");
            return null;
        }
    }
}
