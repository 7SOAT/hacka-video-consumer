namespace hacka_video_consumer.lib.core.entities;

public class IVideoData
{
    public string? UserId { get; set; }
    public string? VideoId { get; set; }
    public string? S3Key { get; set; }
    public string? Status { get; set; }
    public string? CreatedAt { get; set; }
    public string? MessageId { get; set; }
}