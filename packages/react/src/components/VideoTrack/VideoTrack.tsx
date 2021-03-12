import { VideoTrack as ThemeVideoTrack } from "@amfa-team/theme-service";
import React, { useCallback } from "react";
import type { IVideoTrack } from "../../entities/Track";
import useIsTrackEnabled from "../../hooks/useIsTrackEnabled";

export interface VideoTrackProps {
  isLocal?: boolean;
  track: IVideoTrack;
}

export default function VideoTrack({
  track,
  isLocal = false,
}: VideoTrackProps) {
  const media = track.mediaStreamTrack;
  const isFrontFacing = media?.getSettings().facingMode !== "environment";
  const isVideoEnabled = useIsTrackEnabled(track);

  const attachEffect = useCallback(
    (el: HTMLVideoElement | null) => {
      if (el) {
        track.attach(el);
      }
      return () => {
        if (el) {
          track.detach(el);
        }
      };
    },
    [track],
  );

  return (
    <ThemeVideoTrack
      isLocal={isLocal}
      isFrontFacing={isFrontFacing}
      isVideoEnabled={isVideoEnabled}
      attachEffect={attachEffect}
    />
  );
}
