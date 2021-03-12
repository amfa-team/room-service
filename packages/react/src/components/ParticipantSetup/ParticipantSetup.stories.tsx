import React, { useEffect, useState } from "react";
import { generateRawLocalParticipant } from "../../entities/fixtures/participants.fixture";
import { generateRawVideoPublication } from "../../entities/fixtures/publications.fixture";
import { generateLocalVideoTrack } from "../../entities/fixtures/tracks.fixture";
import type { RawLocalParticipant } from "../../entities/Participant";
import ParticipantSetup from "./ParticipantSetup";

export default {
  title: "ParticipantSetup",
  component: ParticipantSetup,
};

export function NoVideo(): JSX.Element | null {
  return <ParticipantSetup participant={generateRawLocalParticipant()} />;
}

export function Local(): JSX.Element | null {
  const [participant, setParticipant] = useState<RawLocalParticipant | null>(
    null,
  );
  useEffect(() => {
    generateLocalVideoTrack()
      .then((videoTrack) => {
        setParticipant(
          generateRawLocalParticipant({
            identity: "moroine",
            videoTrackPublication: generateRawVideoPublication({
              track: videoTrack,
            }),
          }),
        );
      })
      .catch(console.error);
  }, []);

  if (!participant) {
    return null;
  }

  return <ParticipantSetup participant={participant} />;
}
