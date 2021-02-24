import type { BlameDictionary } from "@amfa-team/user-service";
import React from "react";
import type { IParticipant } from "../../entities/Participant";
import ParticipantInfo from "../ParticipantInfo/ParticipantInfo";
import ParticipantTracks from "../ParticipantTracks/ParticipantTracks";

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
  hideParticipant = false,
  loading = false,
  blameDictionary,
}: ParticipantProps) {
  return (
    <ParticipantInfo
      participant={participant}
      participants={participants}
      hideParticipant={hideParticipant}
      loading={loading}
      isLocalParticipant={isLocalParticipant}
      blameDictionary={blameDictionary}
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

export default React.memo<ParticipantProps>(Participant);
