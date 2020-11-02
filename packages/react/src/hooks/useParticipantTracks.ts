import { useEffect, useState } from "react";
import type { IParticipant } from "../entities/Participant";
import type { ITrackPublication } from "../entities/Publication";
import type { IVideoTrack } from "../entities/VideoTrack";

export function useParticipantVideoTrack(
  participant: IParticipant,
): IVideoTrack | null {
  const [videoTrack, setVideoTrack] = useState<IVideoTrack | null>(null);

  useEffect(() => {
    const trackPublished = (publication: ITrackPublication) => {
      if (publication.kind === "video") {
        setVideoTrack(publication.track);
      }
    };
    const trackUnpublished = (publication: ITrackPublication) => {
      if (publication.kind === "video") {
        setVideoTrack(null);
      }
    };

    const [publication = null] = participant.videoTracks.values();
    if (publication) {
      trackPublished(publication);
    }

    participant.on("trackPublished", trackPublished);
    participant.on("trackUnpublished", trackUnpublished);
    return () => {
      participant.off("trackPublished", trackPublished);
      participant.off("trackUnpublished", trackUnpublished);
    };
  }, [participant]);

  return videoTrack;
}
