import React, { useEffect, useState } from "react";
import {
  generateRawLocalParticipant,
  generateRawRemoteParticipant,
} from "../../entities/fixtures/participants.fixture";
import { generateRawVideoPublication } from "../../entities/fixtures/publications.fixture";
import {
  generateLocalVideoTrack,
  generateRemoteVideoTrack,
} from "../../entities/fixtures/tracks.fixture";
import type {
  RawLocalParticipant,
  RawRemoteParticipant,
} from "../../entities/Participant";
import { SquareDiv } from "../ParticipantInfo/SquareDiv/SquareDiv";
import Participant from "./Participant";

export default {
  title: "Participant",
  component: Participant,
  decorators: [
    (Story: React.FC) => (
      <SquareDiv>
        <Story />
      </SquareDiv>
    ),
  ],
};

export function NoVideo(): JSX.Element | null {
  return (
    <Participant
      participant={generateRawLocalParticipant()}
      participants={[]}
    />
  );
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

  return (
    <Participant
      participant={participant}
      isLocalParticipant
      participants={[]}
    />
  );
}

export function ScreenShare(): JSX.Element | null {
  const [participant, setParticipant] = useState<RawRemoteParticipant | null>(
    null,
  );
  useEffect(() => {
    generateRemoteVideoTrack({
      name: "screen",
    })
      .then((videoTrack) => {
        setParticipant(
          generateRawRemoteParticipant({
            identity: "moroine",
            networkQualityLevel: 3,
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

  return <Participant participant={participant} participants={[]} />;
}

export function Hide(): JSX.Element | null {
  const [participant, setParticipant] = useState<RawRemoteParticipant | null>(
    null,
  );
  useEffect(() => {
    generateRemoteVideoTrack()
      .then((videoTrack) => {
        setParticipant(
          generateRawRemoteParticipant({
            identity: "moroine",
            networkQualityLevel: 2,
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

  return (
    <Participant participant={participant} hideParticipant participants={[]} />
  );
}

export function AsyncVideo(): JSX.Element | null {
  const [participant, setParticipant] = useState<RawRemoteParticipant | null>(
    null,
  );
  useEffect(() => {
    const p = generateRawRemoteParticipant({
      identity: "moroine",
      networkQualityLevel: 0,
    });
    setParticipant(p);

    const t1 = setInterval(() => {
      if (p.networkQualityLevel === 4) {
        p.setNetworkQualityLevel(0);
      } else {
        const l = p.networkQualityLevel ?? 0;
        p.setNetworkQualityLevel(l + 1);
      }
    }, 2000);

    let t2: NodeJS.Timeout | null = null;

    generateRemoteVideoTrack()
      .then((videoTrack) => {
        let added = false;
        const videoTrackPublication = generateRawVideoPublication({
          track: videoTrack,
        });
        t2 = setInterval(() => {
          if (added) {
            p.addVideoTrack(videoTrackPublication);
          } else {
            p.removeVideoTrack(videoTrackPublication);
          }
          added = !added;
        }, 5000);
      })
      .catch(console.error);

    return () => {
      clearInterval(t1);
      if (t2) {
        clearInterval(t2);
      }
    };
  }, []);

  if (!participant) {
    return null;
  }

  return <Participant participant={participant} participants={[]} />;
}

export function SeatAvailable(): JSX.Element | null {
  return <Participant participant={null} participants={[]} />;
}

export function Loading(): JSX.Element | null {
  return <Participant participant={null} loading participants={[]} />;
}

export function Reconnecting(): JSX.Element | null {
  const participant = generateRawRemoteParticipant();
  participant.setState("reconnecting");

  return <Participant participant={participant} participants={[]} />;
}
