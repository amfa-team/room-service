import { ParticipantSetup as ParticipantSetupUI } from "@amfa-team/theme-service";
import debounce from "lodash.debounce";
import React, { useCallback } from "react";
import type { ILocalAudioTrack, ILocalVideoTrack } from "../../entities";
import type { IParticipant } from "../../entities/Participant";
import useIsTrackEnabled from "../../hooks/useIsTrackEnabled";
import useIsTrackSwitchedOff from "../../hooks/useIsTrackSwitchedOff";
import {
  useParticipantAudioTrack,
  useParticipantVideoTrack,
} from "../../hooks/useParticipantTracks";

export interface ParticipantSetupProps {
  participant: IParticipant | null;
  isLoading?: boolean;
}

function ParticipantSetup({
  participant,
  isLoading = false,
}: ParticipantSetupProps) {
  const audio = useParticipantAudioTrack(
    participant,
  ) as ILocalAudioTrack | null;
  const video = useParticipantVideoTrack(
    participant,
  ) as ILocalVideoTrack | null;

  const isFrontFacing =
    video?.mediaStreamTrack?.getSettings().facingMode !== "environment";
  const isVideoSwitchedOff = useIsTrackSwitchedOff(video);
  const isAudioSwitchedOff = useIsTrackSwitchedOff(audio);
  const isVideoEnabled = useIsTrackEnabled(video);
  const isAudioEnabled = useIsTrackEnabled(audio);

  const attachAudioEffect = useCallback(
    (el: HTMLAudioElement | null) => {
      if (el) {
        audio?.attach(el);
      }
      return () => {
        if (el) {
          audio?.detach(el);
        }
      };
    },
    [audio],
  );
  const attachVideoEffect = useCallback(
    (el: HTMLVideoElement | null) => {
      if (el) {
        video?.attach(el);
      }
      return () => {
        if (el) {
          video?.detach(el);
        }
      };
    },
    [video],
  );

  const toggleAudio = useCallback(
    debounce(() => {
      audio?.enable(!audio.isEnabled);
    }, 300),
    [audio],
  );

  const toggleVideo = useCallback(
    debounce(() => {
      video?.enable(!video.isEnabled);
    }, 300),
    [video],
  );

  return (
    <ParticipantSetupUI
      isFrontFacing={isFrontFacing}
      isVideoSwitchedOff={isVideoSwitchedOff}
      isAudioSwitchedOff={isAudioSwitchedOff}
      isVideoEnabled={isVideoEnabled}
      isAudioEnabled={isAudioEnabled}
      attachAudioEffect={attachAudioEffect}
      attachVideoEffect={attachVideoEffect}
      toggleAudio={toggleAudio}
      toggleVideo={toggleVideo}
      isLoading={isLoading}
    />
  );
}

export default React.memo<ParticipantSetupProps>(ParticipantSetup);
