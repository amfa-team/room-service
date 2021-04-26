import {
  AvailableSeat,
  Participant as ParticipantUI,
} from "@amfa-team/theme-service";
import type { BlameDictionary } from "@amfa-team/user-service";
import { BlameAction } from "@amfa-team/user-service";
import React, { useCallback, useMemo } from "react";
import type { IParticipant } from "../../entities/Participant";
import useIsTrackEnabled from "../../hooks/useIsTrackEnabled";
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
const emptyParticipantList: IParticipant[] = [];

function Participant({
  participant,
  participants = emptyParticipantList,
  isLocalParticipant = false,
  // hideParticipant = false,
  loading = false,
  blameDictionary,
}: ParticipantProps) {
  const dictionary = useDictionary("participantInfo");

  const audio = useParticipantAudioTrack(participant);
  const video = useParticipantVideoTrack(participant);

  const isFrontFacing =
    video?.mediaStreamTrack?.getSettings().facingMode !== "environment";
  const isVideoEnabled = useIsTrackEnabled(video);
  const isAudioEnabled = useIsTrackEnabled(audio);
  const isParticipantReconnecting = useParticipantIsReconnecting(participant);

  const witnesses = useMemo(
    () =>
      participants
        .filter((p) => p.identity !== participant?.identity)
        .map((p) => p.identity),
    [participants, participant],
  );

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
        onClick={async () => {
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return navigator.clipboard.writeText(
            `${window.location.origin}${window.location.pathname}`,
          );
        }}
      />
    );
  }

  return (
    <ParticipantUI
      isLocal={isLocalParticipant}
      isFrontFacing={isFrontFacing}
      isVideoEnabled={isVideoEnabled}
      isAudioEnabled={isAudioEnabled}
      attachAudioEffect={attachAudioEffect}
      attachVideoEffect={attachVideoEffect}
      name=""
      isLoading={loading}
      isReconnecting={isParticipantReconnecting}
      reportIcon={
        <BlameAction
          accusedId={participant.identity}
          witnesses={witnesses}
          dictionary={blameDictionary}
        />
      }
    />
  );
}

export default React.memo<ParticipantProps>(Participant);
