import { useEffect, useState } from "react";
import type { IParticipant } from "../entities/Participant";
import type { IRoom } from "../entities/Room";

export default function useParticipants(room: IRoom): IParticipant[] {
  const [participants, setParticipants] = useState(
    Array.from(room.participants.values()),
  );

  useEffect(() => {
    const participantConnected = (participant: IParticipant) =>
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    const participantDisconnected = (participant: IParticipant) =>
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant),
      );
    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);
    return () => {
      room.off("participantConnected", participantConnected);
      room.off("participantDisconnected", participantDisconnected);
    };
  }, [room]);

  return participants;
}
