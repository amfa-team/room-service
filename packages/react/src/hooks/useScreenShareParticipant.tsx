import { useEffect, useState } from "react";
import type { IParticipant } from "../entities/Participant";
import type { IVideoTrackPublication } from "../entities/Publication";
import type { IRoom } from "../entities/Room";

/*
  Returns the participant that is sharing their screen (if any). This hook assumes that only one participant
  can share their screen at a time.
*/
export default function useScreenShareParticipant(
  room: IRoom,
): IParticipant | null {
  const [
    screenShareParticipant,
    setScreenShareParticipant,
  ] = useState<IParticipant | null>(null);

  useEffect(() => {
    if (room.state === "connected") {
      const updateScreenShareParticipant = () => {
        const p = Array.from<IParticipant>(room.participants.values())
          // the screenshare participant could be the localParticipant
          .concat(room.localParticipant)
          .find((participant: IParticipant) =>
            Array.from<IVideoTrackPublication>(
              participant.videoTracks.values(),
            ).find((track) => track.trackName.includes("screen")),
          );

        setScreenShareParticipant(p ?? null);
      };
      updateScreenShareParticipant();

      room.on("trackPublished", updateScreenShareParticipant);
      room.on("trackUnpublished", updateScreenShareParticipant);
      room.on("participantDisconnected", updateScreenShareParticipant);

      // the room object does not emit 'trackPublished' events for the localParticipant,
      // so we need to listen for them here.
      room.localParticipant.on("trackPublished", updateScreenShareParticipant);
      room.localParticipant.on(
        "trackUnpublished",
        updateScreenShareParticipant,
      );
      return () => {
        // TODO
        // room.off("trackPublished", updateScreenShareParticipant);
        // room.off("trackUnpublished", updateScreenShareParticipant);
        // room.off("participantDisconnected", updateScreenShareParticipant);
        // room.localParticipant.off(
        //   "trackPublished",
        //   updateScreenShareParticipant,
        // );
        // room.localParticipant.off(
        //   "trackUnpublished",
        //   updateScreenShareParticipant,
        // );
      };
    }

    return () => {
      // no-op
    };
  }, [room]);

  return screenShareParticipant;
}
