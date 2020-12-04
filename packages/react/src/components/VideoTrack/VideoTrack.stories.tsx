import React, { useEffect, useState } from "react";
import {
  VideoSrc,
  generateRemoteVideoTrack,
} from "../../entities/fixtures/tracks.fixture";
import type { IVideoTrack } from "../../entities/Track";
import VideoTrack from "./VideoTrack";

export default {
  title: "VideoTrack",
  component: VideoTrack,
};

export function Default(): JSX.Element | null {
  const [track, setTrack] = useState<IVideoTrack | null>(null);
  useEffect(() => {
    generateRemoteVideoTrack().then(setTrack).catch(console.error);
  }, []);

  return track ? <VideoTrack track={track} /> : null;
}

export function Local(): JSX.Element | null {
  const [track, setTrack] = useState<IVideoTrack | null>(null);
  useEffect(() => {
    generateRemoteVideoTrack({ src: VideoSrc.camera })
      .then(setTrack)
      .catch(console.error);
  }, []);

  return track ? <VideoTrack track={track} isLocal /> : null;
}
