using hacka_video_consumer.lib.core.entities;

namespace hacka_video_consumer.lib.adapters.controllers.ports;

public interface IFrameExtractorControllerPorts
{
    Task Execute(IVideoData input);
}