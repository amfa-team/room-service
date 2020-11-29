import React from "react";
import type { IParticipant } from "../../entities/Participant";
import ParticipantInfo from "../ParticipantInfo/ParticipantInfo";
import ParticipantTracks from "../ParticipantTracks/ParticipantTracks";

interface ParticipantProps {
  participant: IParticipant | null;
  participants: IParticipant[];
  isLocalParticipant: boolean;
  hideParticipant: boolean;
  loading: boolean;
}

export default function Participant({
  participant,
  participants,
  isLocalParticipant,
  hideParticipant,
  loading,
}: ParticipantProps) {
  return (
    <ParticipantInfo
      participant={participant}
      participants={participants}
      hideParticipant={hideParticipant}
      loading={loading}
    >
      {participant && (
        <ParticipantTracks
          participant={participant}
          isLocalParticipant={isLocalParticipant}
        />
      )}
    </ParticipantInfo>
  );
}

Participant.defaultProps = {
  isLocalParticipant: false,
  hideParticipant: false,
  loading: false,
};
