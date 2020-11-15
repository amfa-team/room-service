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
  const [audioError, setAudioError] = useState<Error | null>(null);
  const [videoError, setVideoError] = useState<Error | null>(null);

  const hasAudio = useHasAudioInputDevices();
  const hasVideo = useHasVideoInputDevices();

  useEffect(() => {
    if (!hasAudio) return;

    setAudioError(null);

    setIsAcquiringLocalTracks(true);
    Video.createLocalAudioTrack()
      .then((track) => {
        setAudioTrack((previous) => {
          previous?.stop();
          return track;
        });
      })
      .catch((e) => setAudioError(e))
      .finally(() => setIsAcquiringLocalTracks(false));
  }, [hasAudio, setAudioTrack]);

  useEffect(() => {
    if (!hasVideo) return;

    setVideoError(null);

    setIsAcquiringLocalTracks(true);
    Video.createLocalVideoTrack({
      ...(DEFAULT_VIDEO_CONSTRAINTS as Record<string, unknown>),
      name: `camera-${Date.now()}`,
    })
      .then((track) => {
        setVideoTrack((previous) => {
          previous?.stop();
          return track;
        });
      })
      .catch((e) => setVideoError(e))
      .finally(() => setIsAcquiringLocalTracks(false));
  }, [hasVideo, setVideoTrack]);

  return {
    audioTrack,
    videoTrack,
    isAcquiringLocalTracks,
    videoError,
    audioError,
  };
}
