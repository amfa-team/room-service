import classnames from "classnames";
import React, { useEffect, useRef } from "react";
import type { IVideoTrack } from "../../entities/VideoTrack";
import style from "./videoTracks.module.css";

interface VideoTrackProps {
  isLocal?: boolean;
  track: IVideoTrack;
}

export default function VideoTrack({ track, isLocal }: VideoTrackProps) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const media = track.mediaStreamTrack;
  const isFrontFacing = media?.getSettings().facingMode !== "environment";

  useEffect(() => {
    const el = ref.current;
    if (el) {
      track.attach(el);
    }
    return () => {
      if (el) {
        track.detach(el);
      }
    };
  }, [track]);

  return (
    <video
      className={classnames(style.video, {
        [style.isFlipped]: isLocal && isFrontFacing,
      })}
      ref={ref}
      muted
      autoPlay
    />
  );
}
VideoTrack.defaultProps = {
  isLocal: false,
};
