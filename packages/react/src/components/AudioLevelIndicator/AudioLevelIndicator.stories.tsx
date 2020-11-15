import React, { useEffect, useState } from "react";
import { generateRemoteAudioTrack } from "../../entities/fixtures/tracks.fixture";
import type { IAudioTrack } from "../../entities/Track";
import { AudioLevelIndicator } from "./AudioLevelIndicator";

export default {
  title: "AudioLevelIndicator",
  component: AudioLevelIndicator,
};

export function Default(): JSX.Element | null {
  const [track, setTrack] = useState<IAudioTrack | null>(null);
  useEffect(() => {
    generateRemoteAudioTrack().then(setTrack).catch(console.error);
  }, []);

  return <AudioLevelIndicator audioTrack={track} />;
}

export function NoTrack(): JSX.Element | null {
  return <AudioLevelIndicator audioTrack={null} />;
}
