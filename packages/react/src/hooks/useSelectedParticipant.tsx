import { useCallback, useState } from "react";
import type { IParticipant } from "../entities/Participant";

type SelectedParticipantContextType = [
  IParticipant | null,
  (participant: IParticipant | null) => void,
];

export function useSelectedParticipant(): SelectedParticipantContextType {
  const [selectedParticipant, _setSelectedParticipant] = useState(null);

  const setSelectedParticipant = useCallback(
    (p) => _setSelectedParticipant(p),
    [],
  );

  return [selectedParticipant, setSelectedParticipant];
}
