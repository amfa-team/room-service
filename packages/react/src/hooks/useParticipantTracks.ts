import { useEffect, useState } from "react";
import type { IParticipant, IRemoteParticipant } from "../entities/Participant";
import type {
  IAudioTrackPublication,
  ITrackPublication,
  IVideoTrackPublication,
} from "../entities/Publication";
import type {
  IAudioTrack,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
  IVideoTrack,
} from "../entities/Track";

export function useParticipantVideoTrack<T extends IParticipant>(
  participant: T | null,
): T extends IRemoteParticipant
  ? IRemoteVideoTrack | null
  : ILocalVideoTrack | null {
  const [videoTrack, setVideoTrack] = useState<IVideoTrack | null>(null);
  const [
    videoPublication,
    setVideoPublication,
  ] = useState<IVideoTrackPublication | null>(null);

  useEffect(() => {
    if (participant) {
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
        participant.removeListener("trackPublished", trackPublished);
        participant.removeListener("trackUnpublished", trackUnpublished);
      };
    }
    return () => {
      // no-op
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
      videoPublication?.removeListener("subscribed", onSubscribed);
      videoPublication?.removeListener("unsubscribed", onUnSubscribed);
    };
  }, [videoPublication]);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
  return videoTrack as any;
}

export function useParticipantAudioTrack<T extends IParticipant>(
  participant: T | null,
): T extends IRemoteParticipant
  ? IRemoteAudioTrack | null
  : ILocalAudioTrack | null {
  const [audioTrack, setAudioTrack] = useState<IAudioTrack | null>(null);
  const [
    audioPublication,
    setAudioPublication,
  ] = useState<IAudioTrackPublication | null>(null);

  useEffect(() => {
    if (participant) {
      const trackPublished = (publication: ITrackPublication) => {
        if (publication.kind === "audio") {
          setAudioPublication(publication);
        }
      };
      const trackUnpublished = (publication: ITrackPublication) => {
        if (publication.kind === "audio") {
          setAudioPublication(null);
        }
      };

      const [publication = null] = participant.audioTracks.values();
      if (publication) {
        trackPublished(publication);
      }

      participant.on("trackPublished", trackPublished);
      participant.on("trackUnpublished", trackUnpublished);
      return () => {
        participant.removeListener("trackPublished", trackPublished);
        participant.removeListener("trackUnpublished", trackUnpublished);
      };
    }
    return () => {
      // no-op
    };
  }, [participant]);

  useEffect(() => {
    const onSubscribed = (track: IAudioTrack | null) => {
      setAudioTrack(track);
    };
    const onUnSubscribed = () => {
      setAudioTrack(null);
    };

    onSubscribed(audioPublication?.track ?? null);
    audioPublication?.on("subscribed", onSubscribed);
    audioPublication?.on("unsubscribed", onUnSubscribed);
    return () => {
      audioPublication?.removeListener("subscribed", onSubscribed);
      audioPublication?.removeListener("unsubscribed", onUnSubscribed);
    };
  }, [audioPublication]);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
  return audioTrack as any;
}
