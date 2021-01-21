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
    setParticipants(Array.from(room?.participants.values() ?? []));

    const participantConnected = (participant: IRemoteParticipant) =>
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    const participantDisconnected = (participant: IRemoteParticipant) =>
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant),
      );
    room?.on("participantConnected", participantConnected);
    room?.on("participantDisconnected", participantDisconnected);
    return () => {
      // TODO
      // room?.off("participantConnected", participantConnected);
      // room?.off("participantDisconnected", participantDisconnected);
    };
  }, [room]);

  return participants;
}
