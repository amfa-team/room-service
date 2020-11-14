import { RawVideoTrackPublication } from "../Publication";
import type { RawLocalVideoTrack, RawRemoteVideoTrack } from "../VideoTrack";

interface GenerateRawVideoPublicationOptions<
  T extends RawLocalVideoTrack | RawRemoteVideoTrack
> {
  trackName?: string;
  track: T;
}

export function generateRawVideoPublication<
  T extends RawLocalVideoTrack | RawRemoteVideoTrack
>(options: GenerateRawVideoPublicationOptions<T>): RawVideoTrackPublication<T> {
  const trackName = options.trackName ?? "default-video";
  const videoTrackPublication = new RawVideoTrackPublication(
    trackName,
    options.track,
  );

  return videoTrackPublication;
}
