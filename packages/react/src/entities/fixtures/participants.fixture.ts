import { RawLocalParticipant, RawRemoteParticipant } from "../Participant";
import type {
  ILocalVideoTrackPublication,
  IRemoteVideoTrackPublication,
  IVideoTrackPublication,
} from "../Publication";

interface GenerateRawParticipantOptions<V extends IVideoTrackPublication> {
  identity?: string;
  videoTrackPublication?: V;
  networkQualityLevel?: number | null;
}

export function generateRawLocalParticipant(
  options?: GenerateRawParticipantOptions<ILocalVideoTrackPublication>,
): RawLocalParticipant {
  const identity = options?.identity ?? "someone";
  const participant = new RawLocalParticipant(identity);
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

export function generateRawRemoteParticipant(
  options?: GenerateRawParticipantOptions<IRemoteVideoTrackPublication>,
): RawRemoteParticipant {
  const identity = options?.identity ?? "me";
  const participant = new RawRemoteParticipant(identity);
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
