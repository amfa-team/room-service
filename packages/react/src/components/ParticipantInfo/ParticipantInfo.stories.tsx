import React, { useEffect, useState } from "react";
import { generateRawRemoteParticipant } from "../../entities/fixtures/participants.fixture";
import { generateRawVideoPublication } from "../../entities/fixtures/publications.fixture";
import { generateRemoteVideoTrack } from "../../entities/fixtures/tracks.fixture";
import type { RawRemoteParticipant } from "../../entities/Participant";
import ParticipantInfo from "./ParticipantInfo";

export default {
  title: "ParticipantInfo",
  component: ParticipantInfo,
};

export function NoVideo(): JSX.Element | null {
  return (
    <ParticipantInfo participant={generateRawRemoteParticipant()}>
      <div
        style={{ backgroundColor: "blueviolet", width: "100%", height: "100%" }}
      />
    </ParticipantInfo>
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

  return (
    <ParticipantInfo participant={participant}>
      <div
        style={{ backgroundColor: "blueviolet", width: "100%", height: "100%" }}
      />
    </ParticipantInfo>
  );
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
    <ParticipantInfo participant={participant} hideParticipant>
      <div
        style={{ backgroundColor: "blueviolet", width: "100%", height: "100%" }}
      />
    </ParticipantInfo>
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

  return (
    <ParticipantInfo participant={participant}>
      <div
        style={{ backgroundColor: "blueviolet", width: "100%", height: "100%" }}
      />
    </ParticipantInfo>
  );
}
