import { RawParticipant } from "../Participant";
import type { IVideoTrackPublication } from "../Publication";

interface GenerateRawParticipantOptions {
  identity?: string;
  videoTrackPublication?: IVideoTrackPublication;
  networkQualityLevel?: number | null;
}

export function generateRawParticipant(
  options?: GenerateRawParticipantOptions,
): RawParticipant {
  const identity = options?.identity ?? "someone";
  const participant = new RawParticipant(identity);
  const networkQualityLevel = options?.networkQualityLevel ?? null;

  const videoTrackPublication = options?.videoTrackPublication;
  if (videoTrackPublication) {
    participant.addVideoTrack(videoTrackPublication);
  }
  if (networkQualityLevel) {
    participant.setNetworkQualityLevel(networkQualityLevel);
  }

  return participant;
}
