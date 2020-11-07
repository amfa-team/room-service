import { useEffect, useState } from "react";
import type { IParticipant } from "../entities/Participant";
import type {
  ITrackPublication,
  IVideoTrackPublication,
} from "../entities/Publication";
import type { IVideoTrack } from "../entities/VideoTrack";

export function useParticipantVideoTrack(
  participant: IParticipant,
): IVideoTrack | null {
  const [videoTrack, setVideoTrack] = useState<IVideoTrack | null>(null);
  const [
    videoPublication,
    setVideoPublication,
  ] = useState<IVideoTrackPublication | null>(null);

  useEffect(() => {
    const trackPublished = (publication: ITrackPublication) => {
      if (publication.kind === "video") {
        setVideoPublication(publication);
      }
    };
    const trackUnpublished = (publication: ITrackPublication) => {
      if (publication.kind === "video") {
        setVideoPublication(null);
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

  useEffect(() => {
    const onSubscribed = (track: IVideoTrack | null) => {
      setVideoTrack(track);
    };
    const onUnSubscribed = () => {
      setVideoTrack(null);
    };

    onSubscribed(videoPublication?.track ?? null);
    videoPublication?.on("subscribed", onSubscribed);
    videoPublication?.on("unsubscribed", onUnSubscribed);
    return () => {
      videoPublication?.off("subscribed", onSubscribed);
      videoPublication?.off("unsubscribed", onUnSubscribed);
    };
  }, [videoPublication]);

  return videoTrack;
}
