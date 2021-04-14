import { useEffect, useState } from "react";
import type {
  ILocalTrackPublication,
  ITrackPublication,
} from "../entities/Publication";
import type { ILocalTrack, IRemoteTrack, ITrack } from "../entities/Track";

export default function useTrack<P extends ITrackPublication>(
  publication: P | undefined,
) {
  const [track, setTrack] = useState<null | ITrack>(publication?.track ?? null);

  useEffect(() => {
    // Reset the track when the 'publication' variable changes.
    setTrack(publication?.track ?? null);

    if (publication) {
      const removeTrack = () => setTrack(null);

      publication.on("subscribed", setTrack);
      publication.on("unsubscribed", removeTrack);
      return () => {
        publication.removeListener("subscribed", setTrack);
        publication.removeListener("unsubscribed", removeTrack);
      };
    }

    return () => {
      // no-op
    };
  }, [publication]);

  return track as P extends ILocalTrackPublication
    ? ILocalTrack | null
    : IRemoteTrack | null;
}
