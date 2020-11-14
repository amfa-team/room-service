import { useEffect, useState } from "react";
import type { ITrackPublication } from "../entities/Publication";
import type { ITrack } from "../entities/Track";

export default function useTrack(publication: ITrackPublication | undefined) {
  const [track, setTrack] = useState<null | ITrack>(publication?.track ?? null);

  useEffect(() => {
    // Reset the track when the 'publication' variable changes.
    setTrack(publication?.track ?? null);

    if (publication) {
      const removeTrack = () => setTrack(null);

      publication.on("subscribed", setTrack);
      publication.on("unsubscribed", removeTrack);
      return () => {
        publication.off("subscribed", setTrack);
        publication.off("unsubscribed", removeTrack);
      };
    }

    return () => {
      // no-op
    };
  }, [publication]);

  return track;
}
