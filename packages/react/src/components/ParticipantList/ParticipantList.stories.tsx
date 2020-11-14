import { action } from "@storybook/addon-actions";
import React, { useEffect } from "react";
import { generateRawRemoteParticipant } from "../../entities/fixtures/participants.fixture";
import { generateRawVideoPublication } from "../../entities/fixtures/publications.fixture";
import { generateRawRoom } from "../../entities/fixtures/rooms.fixture";
import { generateRemoteVideoTrack } from "../../entities/fixtures/tracks.fixture";
import ParticipantList from "./ParticipantList";

export default {
  title: "ParticipantList",
  component: ParticipantList,
};

export function NoVideo(): JSX.Element | null {
  const room = generateRawRoom();
  return <ParticipantList room={room} onShuffle={action("onShuffle")} />;
}

export function SingleParticipant(): JSX.Element | null {
  const room = generateRawRoom();
  room.addParticipant(generateRawRemoteParticipant({ identity: "antoine" }));

  return <ParticipantList room={room} onShuffle={action("onShuffle")} />;
}

export function TwoParticipant(): JSX.Element | null {
  const room = generateRawRoom();

  room.addParticipant(generateRawRemoteParticipant({ identity: "antoine" }));

  useEffect(() => {
    generateRemoteVideoTrack()
      .then((videoTrack) => {
        room.addParticipant(
          generateRawRemoteParticipant({
            identity: "moroine",
            videoTrackPublication: generateRawVideoPublication({
              track: videoTrack,
            }),
          }),
        );
      })
      .catch(console.error);
  }, [room]);

  return <ParticipantList room={room} onShuffle={action("onShuffle")} />;
}
