import React from "react";
import type { IParticipant } from "../../entities/Participant";
import ParticipantInfo from "../ParticipantInfo/ParticipantInfo";
import ParticipantTracks from "../ParticipantTracks/ParticipantTracks";

interface ParticipantProps {
  participant: IParticipant;
  onClick: () => void;
  isSelected: boolean;
  isLocalParticipant: boolean;
  hideParticipant: boolean;
}

export default function Participant({
  participant,
  onClick,
  isSelected,
  isLocalParticipant,
  hideParticipant,
}: ParticipantProps) {
  return (
    <ParticipantInfo
      participant={participant}
      onClick={onClick}
      isSelected={isSelected}
      isLocalParticipant={isLocalParticipant}
      hideParticipant={hideParticipant}
    >
      <ParticipantTracks participant={participant} />
    </ParticipantInfo>
  );
}

Participant.defaultProps = {
  isSelected: false,
  isLocalParticipant: false,
  hideParticipant: false,
};
