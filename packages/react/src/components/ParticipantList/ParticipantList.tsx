import classnames from "classnames";
import React from "react";
import type { IRoom } from "../../entities/Room";
import useParticipants from "../../hooks/useParticipants";
import useScreenShareParticipant from "../../hooks/useScreenShareParticipant";
import { useSelectedParticipant } from "../../hooks/useSelectedParticipant";
import Participant from "../Participant/Participant";
import styles from "./participantList.module.css";

export interface ParticipantListProps {
  room: IRoom;
}

export default function ParticipantList(
  props: ParticipantListProps,
): JSX.Element | null {
  const {
    room,
    room: { localParticipant },
  } = props;
  const participants = useParticipants(room);
  const [
    selectedParticipant,
    setSelectedParticipant,
  ] = useSelectedParticipant();
  const screenShareParticipant = useScreenShareParticipant(room);
  const isRemoteParticipantScreenSharing =
    screenShareParticipant && screenShareParticipant !== localParticipant;

  return (
    <aside
      className={classnames(styles.container, {
        [styles.transparentBackground]: !isRemoteParticipantScreenSharing,
      })}
    >
      <div className={styles.scrollContainer}>
        <Participant
          participant={localParticipant}
          isLocalParticipant
          onClick={() => {
            setSelectedParticipant(localParticipant);
          }}
        />
        {participants.map((participant) => {
          return (
            <Participant
              key={participant.sid}
              participant={participant}
              isSelected={participant === selectedParticipant}
              onClick={() => {
                setSelectedParticipant(participant);
              }}
            />
          );
        })}
      </div>
    </aside>
  );
}
