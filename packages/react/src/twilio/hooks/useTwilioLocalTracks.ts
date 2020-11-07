import { useEffect, useState } from "react";
import { atom, useRecoilState } from "recoil";
import type { LocalAudioTrack, LocalVideoTrack } from "twilio-video";
import Video from "twilio-video";
import { DEFAULT_VIDEO_CONSTRAINTS } from "../../constants";
import {
  useHasAudioInputDevices,
  useHasVideoInputDevices,
} from "../../hooks/useDevices";

const videoTrackAtom = atom<LocalVideoTrack | null>({
  key: "room-service/useTwilioLocalTracks/videoTrack",
  default: null,
  dangerouslyAllowMutability: true,
});

const audioTrackAtom = atom<LocalAudioTrack | null>({
  key: "room-service/useTwilioLocalTracks/audioTrack",
  default: null,
  dangerouslyAllowMutability: true,
});

export default function useTwilioLocalTracks() {
  const [audioTrack, setAudioTrack] = useRecoilState(audioTrackAtom);
  const [videoTrack, setVideoTrack] = useRecoilState(videoTrackAtom);
  const [isAcquiringLocalTracks, setIsAcquiringLocalTracks] = useState(false);
  const [mediaError, setMediaError] = useState<Error | null>(null);

  const hasAudio = useHasAudioInputDevices();
  const hasVideo = useHasVideoInputDevices();

  useEffect(() => {
    if (!hasAudio && !hasVideo) return;
    if (audioTrack || videoTrack) return;

    setMediaError(null);

    setIsAcquiringLocalTracks(true);
    Video.createLocalTracks({
      video: hasVideo && {
        ...(DEFAULT_VIDEO_CONSTRAINTS as Record<string, unknown>),
        name: `camera-${Date.now()}`,
      },
      audio: hasAudio,
    })
      .then((tracks) => {
        const vt = tracks.find(
          (track) => track.kind === "video",
        ) as LocalVideoTrack | null;
        const at = tracks.find(
          (track) => track.kind === "audio",
        ) as LocalAudioTrack | null;
        if (vt) {
          setVideoTrack(vt);
        }
        if (at) {
          setAudioTrack(at);
        }
      })
      .catch((e) => setMediaError(e))
      .finally(() => setIsAcquiringLocalTracks(false));
  }, [
    hasAudio,
    hasVideo,
    audioTrack,
    videoTrack,
    setAudioTrack,
    setVideoTrack,
  ]);

  return {
    audioTrack,
    videoTrack,
    isAcquiringLocalTracks,
    mediaError,
  };
}
