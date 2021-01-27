import type { BlameDictionary } from "@amfa-team/user-service";
import React from "react";
import type { IRoom } from "../../entities/Room";
import Controls from "../Controls/Controls";
import ParticipantList from "../ParticipantList/ParticipantList";
import classes from "./room.module.css";

interface RoomPageProps {
  room: IRoom | null;
  onShuffle: () => void;
  isJoining: boolean;
  blameDictionary: BlameDictionary;
}

export default function RoomPage(props: RoomPageProps) {
  const { room, onShuffle, isJoining, blameDictionary } = props;

  return (
    <div className={classes.root}>
      <ParticipantList
        room={room}
        onShuffle={onShuffle}
        isJoining={isJoining}
        blameDictionary={blameDictionary}
      />
      <Controls localParticipant={room?.localParticipant ?? null} />
    </div>
  );
}
RoomPage.defaultProps = {
  isJoining: false,
};
