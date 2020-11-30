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
  const [isAcquiringVideoTracks, setIsAcquiringVideoTracks] = useState(false);
  const [isAcquiringAudioTracks, setIsAcquiringAudioTracks] = useState(false);
  const [audioError, setAudioError] = useState<Error | null>(null);
  const [videoError, setVideoError] = useState<Error | null>(null);

  const hasAudio = useHasAudioInputDevices();
  const hasVideo = useHasVideoInputDevices();

  useEffect(() => {
    if (!hasAudio) return;

    setAudioError(null);

    setIsAcquiringAudioTracks(true);
    Video.createLocalAudioTrack()
      .then((track) => {
        setAudioTrack((previous) => {
          previous?.stop();
          return track;
        });
      })
      .catch((e) => setAudioError(e))
      .finally(() => setIsAcquiringAudioTracks(false));
  }, [hasAudio, setAudioTrack]);

  useEffect(() => {
    if (!hasVideo) return;

    setVideoError(null);

    setIsAcquiringVideoTracks(true);
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
      .finally(() => setIsAcquiringVideoTracks(false));
  }, [hasVideo, setVideoTrack]);

  return {
    audioTrack,
    videoTrack,
    isAcquiringLocalTracks: isAcquiringVideoTracks || isAcquiringAudioTracks,
    videoError,
    audioError,
  };
}
