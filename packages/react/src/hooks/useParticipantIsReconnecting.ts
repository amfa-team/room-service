import { useEffect, useState } from "react";
import type { IParticipant } from "../entities/Participant";

export default function useParticipantIsReconnecting(
  participant: IParticipant | null,
) {
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    const handleReconnecting = () => setIsReconnecting(true);
    const handleReconnected = () => setIsReconnecting(false);

    setIsReconnecting(participant?.state === "reconnecting");

    participant?.on("reconnecting", handleReconnecting);
    participant?.on("reconnected", handleReconnected);

    return () => {
      participant?.removeListener("reconnecting", handleReconnecting);
      participant?.removeListener("reconnected", handleReconnected);
    };
  }, [participant]);

  return isReconnecting;
}
