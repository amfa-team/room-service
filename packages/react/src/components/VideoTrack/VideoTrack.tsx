import { VideoTrack as ThemeVideoTrack } from "@amfa-team/theme-service";
import React, { useCallback } from "react";
import type { IVideoTrack } from "../../entities/Track";
import useIsTrackEnabled from "../../hooks/useIsTrackEnabled";
import useIsTrackSwitchedOff from "../../hooks/useIsTrackSwitchedOff";

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
  const isVideoSwitchedOff = useIsTrackSwitchedOff(track);
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
      isVideoSwitchedOff={isVideoSwitchedOff}
      isVideoEnabled={isVideoEnabled}
      attachEffect={attachEffect}
    />
  );
}
