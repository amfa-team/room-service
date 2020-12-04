import React from "react";
import type { IRoom } from "../../entities/Room";
import Controls from "../Controls/Controls";
import ParticipantList from "../ParticipantList/ParticipantList";
import classes from "./room.module.css";

interface RoomPageProps {
  room: IRoom | null;
  onShuffle: () => void;
  isJoining: boolean;
}

export default function RoomPage(props: RoomPageProps) {
  const { room, onShuffle, isJoining } = props;

  return (
    <div className={classes.root}>
      <ParticipantList
        room={room}
        onShuffle={onShuffle}
        isJoining={isJoining}
      />
      <Controls localParticipant={room?.localParticipant ?? null} />
    </div>
  );
}
RoomPage.defaultProps = {
  isJoining: false,
};
