import React from "react";
import type { IParticipant } from "../../entities/Participant";
import ParticipantInfo from "../ParticipantInfo/ParticipantInfo";
import ParticipantTracks from "../ParticipantTracks/ParticipantTracks";

interface ParticipantProps {
  participant: IParticipant;
  isLocalParticipant: boolean;
  hideParticipant: boolean;
}

export default function Participant({
  participant,
  isLocalParticipant,
  hideParticipant,
}: ParticipantProps) {
  return (
    <ParticipantInfo
      participant={participant}
      hideParticipant={hideParticipant}
    >
      <ParticipantTracks
        participant={participant}
        isLocalParticipant={isLocalParticipant}
      />
    </ParticipantInfo>
  );
}

Participant.defaultProps = {
  isLocalParticipant: false,
  hideParticipant: false,
};
