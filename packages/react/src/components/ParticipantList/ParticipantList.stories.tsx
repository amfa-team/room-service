import React, { useEffect } from "react";
import { generateRawParticipant } from "../../entities/fixtures/participants.fixture";
import { generateRawVideoPublication } from "../../entities/fixtures/publications.fixture";
import { generateRawRoom } from "../../entities/fixtures/rooms.fixture";
import ParticipantList from "./ParticipantList";

export default {
  title: "ParticipantList",
  component: ParticipantList,
};

export function NoVideo(): JSX.Element | null {
  const room = generateRawRoom();
  return <ParticipantList room={room} />;
}

export function SingleParticipant(): JSX.Element | null {
  const room = generateRawRoom();
  room.addParticipant(generateRawParticipant({ identity: "antoine" }));

  return <ParticipantList room={room} />;
}

export function TwoParticipant(): JSX.Element | null {
  const room = generateRawRoom();

  room.addParticipant(generateRawParticipant({ identity: "antoine" }));

  useEffect(() => {
    generateRawVideoPublication()
      .then((videoTrackPublication) => {
        room.addParticipant(
          generateRawParticipant({
            identity: "moroine",
            videoTrackPublication,
          }),
        );
      })
      .catch(console.error);
  }, [room]);

  return <ParticipantList room={room} />;
}
