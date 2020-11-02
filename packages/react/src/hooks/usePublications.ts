import { useEffect, useState } from "react";
import type { IParticipant } from "../entities/Participant";
import type { ITrackPublication } from "../entities/Publication";

export default function usePublications(participant: IParticipant) {
  const [publications, setPublications] = useState<ITrackPublication[]>([]);

  useEffect(() => {
    // Reset the publications when the 'participant' variable changes.
    setPublications(Array.from(participant.tracks.values()));

    const publicationAdded = (publication: ITrackPublication) =>
      setPublications((prevPublications) => [...prevPublications, publication]);
    const publicationRemoved = (publication: ITrackPublication) =>
      setPublications((prevPublications) =>
        prevPublications.filter((p) => p !== publication),
      );

    participant.on("trackPublished", publicationAdded);
    participant.on("trackUnpublished", publicationRemoved);
    return () => {
      participant.off("trackPublished", publicationAdded);
      participant.off("trackUnpublished", publicationRemoved);
    };
  }, [participant]);

  return publications;
}
