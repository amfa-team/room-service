import React, { useEffect, useState } from "react";
import {
  VideoSrc,
  generateRemoteAudioTrack,
} from "../../entities/fixtures/tracks.fixture";
import type { IAudioTrack } from "../../entities/Track";
import AudioTrack from "./AudioTrack";

export default {
  title: "AudioTrack",
  component: AudioTrack,
};

export function Default(): JSX.Element | null {
  const [track, setTrack] = useState<IAudioTrack | null>(null);
  useEffect(() => {
    generateRemoteAudioTrack().then(setTrack).catch(console.error);
  }, []);

  return track ? <AudioTrack track={track} /> : null;
}

export function Local(): JSX.Element | null {
  const [track, setTrack] = useState<IAudioTrack | null>(null);
  useEffect(() => {
    generateRemoteAudioTrack({ src: VideoSrc.camera })
      .then(setTrack)
      .catch(console.error);
  }, []);

  return track ? <AudioTrack track={track} /> : null;
}
