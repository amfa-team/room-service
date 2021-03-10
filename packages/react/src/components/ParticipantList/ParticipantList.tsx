import type { BlameDictionary } from "@amfa-team/user-service";
import { Grid } from "@chakra-ui/react";
import React from "react";
import type { IRoom } from "../../entities/Room";
import useParticipants from "../../hooks/useParticipants";
import Participant from "../Participant/Participant";

export interface ParticipantListProps {
  room: IRoom | null;
  isJoining: boolean;
  blameDictionary: BlameDictionary;
}

export default function ParticipantList(
  props: ParticipantListProps,
): JSX.Element | null {
  const { room, isJoining, blameDictionary } = props;

  const localParticipant = room?.localParticipant ?? null;
  const participants = useParticipants(room);

  const loading = room === null || isJoining;

  return (
    <Grid templateColumns="50% 50%" templateRows="50% 50%" w="full" h="full">
      {participants.map((participant) => (
        <Participant
          key={participant.sid}
          participant={participant}
          participants={participants}
          loading={loading}
          blameDictionary={blameDictionary}
        />
      ))}
      <Participant
        participants={participants}
        participant={localParticipant}
        isLocalParticipant
        loading={loading}
        blameDictionary={blameDictionary}
      />
      {["0", "1", "2"]
        .filter((d) => !Object.keys(participants).includes(d))
        .map((index) => (
          <Participant
            key={index}
            participants={participants}
            participant={null}
            loading={loading}
            blameDictionary={blameDictionary}
          />
        ))}
    </Grid>
  );
}
ParticipantList.defaultProps = {
  isJoining: false,
};
