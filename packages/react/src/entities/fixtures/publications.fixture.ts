import { RawVideoTrackPublication } from "../Publication";
import type { IVideoTrack } from "../VideoTrack";
import { generateVideoTrack } from "./videoTracks.fixture";

interface GenerateRawVideoPublicationOptions {
  trackName?: string;
  track?: IVideoTrack;
}

export async function generateRawVideoPublication(
  options?: GenerateRawVideoPublicationOptions,
): Promise<RawVideoTrackPublication> {
  const trackName = options?.trackName ?? "default-video";
  const track = await (options?.track ?? generateVideoTrack());
  const videoTrackPublication = new RawVideoTrackPublication(trackName, track);

  return videoTrackPublication;
}
