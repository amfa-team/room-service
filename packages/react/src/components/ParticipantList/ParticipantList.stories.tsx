import { action } from "@storybook/addon-actions";
import React, { useCallback, useEffect, useState } from "react";
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

export function Joining(): JSX.Element | null {
  const [room] = useState(generateRawRoom());

  const [isJoining, setIsJoining] = useState(true);

  useEffect(() => {
    room.addParticipant(generateRawRemoteParticipant({ identity: "antoine" }));
    setIsJoining(true);
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
        setIsJoining(false);
      })
      .catch(console.error);
  }, [room]);

  const onShuffle = useCallback((...args) => {
    action("onShuffle")(...args);
    setIsJoining(true);
    setTimeout(() => setIsJoining(false), 3000);
  }, []);

  return (
    <ParticipantList room={room} onShuffle={onShuffle} isJoining={isJoining} />
  );
}

export function LoadingRoom(): JSX.Element | null {
  return <ParticipantList room={null} onShuffle={action("shuffle")} />;
}
