import React, { useEffect, useState } from "react";
import {
  VideoSrc,
  generateVideoTrack,
} from "../../entities/fixtures/videoTracks.fixture";
import type { IVideoTrack } from "../../entities/VideoTrack";
import VideoTrack from "./VideoTrack";

export default {
  title: "VideoTrack",
  component: VideoTrack,
};

export function Default(): JSX.Element | null {
  const [track, setTrack] = useState<IVideoTrack | null>(null);
  useEffect(() => {
    generateVideoTrack().then(setTrack).catch(console.error);
  }, []);

  return track ? <VideoTrack track={track} /> : null;
}

export function Local(): JSX.Element | null {
  const [track, setTrack] = useState<IVideoTrack | null>(null);
  useEffect(() => {
    generateVideoTrack({ src: VideoSrc.camera })
      .then(setTrack)
      .catch(console.error);
  }, []);

  return track ? <VideoTrack track={track} isLocal /> : null;
}
