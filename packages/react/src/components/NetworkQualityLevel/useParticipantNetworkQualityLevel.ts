import { useEffect, useState } from "react";
import type { IParticipant } from "../../entities/Participant";

export default function useParticipantNetworkQualityLevel(
  participant: IParticipant,
): null | number {
  const [networkQualityLevel, setNetworkQualityLevel] = useState(
    participant.networkQualityLevel,
  );

  useEffect(() => {
    const handleNetworkQualityLevelChange = (
      newNetworkQualityLevel: number | null,
    ) => setNetworkQualityLevel(newNetworkQualityLevel);

    setNetworkQualityLevel(participant.networkQualityLevel);
    participant.on(
      "networkQualityLevelChanged",
      handleNetworkQualityLevelChange,
    );
    return () => {
      participant.removeListener(
        "networkQualityLevelChanged",
        handleNetworkQualityLevelChange,
      );
    };
  }, [participant]);

  return networkQualityLevel;
}
