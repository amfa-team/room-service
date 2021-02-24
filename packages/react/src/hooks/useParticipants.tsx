import isEqual from "lodash.isequal";
import { useEffect, useState } from "react";
import type { IRemoteParticipant } from "../entities/Participant";
import type { IRoom } from "../entities/Room";

export default function useParticipants(
  room: IRoom | null,
): IRemoteParticipant[] {
  const [participants, setParticipants] = useState(
    Array.from(room?.participants.values() ?? []),
  );

  useEffect(() => {
    setParticipants((prevParticipants) => {
      const newParticipants = Array.from(room?.participants.values() ?? []);
      return isEqual(prevParticipants, newParticipants)
        ? prevParticipants
        : newParticipants;
    });

    const participantConnected = (participant: IRemoteParticipant) =>
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    const participantDisconnected = (participant: IRemoteParticipant) =>
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant),
      );
    room?.on("participantConnected", participantConnected);
    room?.on("participantDisconnected", participantDisconnected);
    return () => {
      room?.removeListener("participantConnected", participantConnected);
      room?.removeListener("participantDisconnected", participantDisconnected);
    };
  }, [room]);

  return participants;
}
