import {
  AvailableSeat,
  Participant as ParticipantUI,
} from "@amfa-team/theme-service";
import type { BlameDictionary } from "@amfa-team/user-service";
import React, { useCallback } from "react";
import type { IParticipant } from "../../entities/Participant";
import useIsTrackEnabled from "../../hooks/useIsTrackEnabled";
import useIsTrackSwitchedOff from "../../hooks/useIsTrackSwitchedOff";
import useParticipantIsReconnecting from "../../hooks/useParticipantIsReconnecting";
import {
  useParticipantAudioTrack,
  useParticipantVideoTrack,
} from "../../hooks/useParticipantTracks";
import { useDictionary } from "../../i18n/dictionary";

export interface ParticipantProps {
  participant: IParticipant | null;
  participants?: IParticipant[];
  isLocalParticipant?: boolean;
  hideParticipant?: boolean;
  loading?: boolean;
  blameDictionary: BlameDictionary;
}

// Prevent useless re-render
// const emptyParticipantList: IParticipant[] = [];

function Participant({
  participant,
  // participants = emptyParticipantList,
  isLocalParticipant = false,
  // hideParticipant = false,
  loading = false,
}: // blameDictionary,
ParticipantProps) {
  const dictionary = useDictionary("participantInfo");
  const onReportClicked = useCallback(() => {
    alert("todo");
  }, []);

  const audio = useParticipantAudioTrack(participant);
  const video = useParticipantVideoTrack(participant);

  const isFrontFacing =
    video?.mediaStreamTrack?.getSettings().facingMode !== "environment";
  const isVideoSwitchedOff = useIsTrackSwitchedOff(video);
  const isVideoEnabled = useIsTrackEnabled(video);
  const isParticipantReconnecting = useParticipantIsReconnecting(participant);

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

  if (participant === null) {
    return (
      <AvailableSeat
        label={dictionary.availableSeat}
        onClick={() => {
          alert("todo");
        }}
      />
    );
  }

  return (
    <ParticipantUI
      isLocal={isLocalParticipant}
      isFrontFacing={isFrontFacing}
      isVideoSwitchedOff={isVideoSwitchedOff}
      isVideoEnabled={isVideoEnabled}
      isAudioEnabled={audio !== null}
      attachAudioEffect={attachAudioEffect}
      attachVideoEffect={attachVideoEffect}
      name="TODO"
      onReportClicked={onReportClicked}
      isLoading={loading}
      isReconnecting={isParticipantReconnecting}
    />
  );
}

export default React.memo<ParticipantProps>(Participant);
