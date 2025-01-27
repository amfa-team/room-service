import type { ITrack } from "../entities/Track";

export default function useIsScreenShareTrack(
  track: ITrack | null | undefined,
): boolean {
  if (!track) {
    return false;
  }

  return track.kind === "video" && track.name.includes("screen");
}
