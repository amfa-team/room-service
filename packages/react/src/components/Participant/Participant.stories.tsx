import { action } from "@storybook/addon-actions";
import React, { useEffect, useState } from "react";
import { generateRawParticipant } from "../../entities/fixtures/participants.fixture";
import { generateRawVideoPublication } from "../../entities/fixtures/publications.fixture";
import { generateVideoTrack } from "../../entities/fixtures/videoTracks.fixture";
import type { RawParticipant } from "../../entities/Participant";
import Participant from "./Participant";

export default {
  title: "Participant",
  component: Participant,
};

export function NoVideo(): JSX.Element | null {
  return (
    <Participant
      onClick={action("onClick")}
      participant={generateRawParticipant()}
    />
  );
}

export function Local(): JSX.Element | null {
  const [participant, setParticipant] = useState<RawParticipant | null>(null);
  useEffect(() => {
    generateRawVideoPublication()
      .then((videoTrackPublication) => {
        setParticipant(
          generateRawParticipant({
            identity: "moroine",
            videoTrackPublication,
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
      onClick={action("onClick")}
      participant={participant}
      isLocalParticipant
    />
  );
}

export function Selected(): JSX.Element | null {
  const [participant, setParticipant] = useState<RawParticipant | null>(null);
  useEffect(() => {
    generateRawVideoPublication()
      .then((videoTrackPublication) => {
        setParticipant(
          generateRawParticipant({
            identity: "moroine",
            videoTrackPublication,
            networkQualityLevel: 3,
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
      onClick={action("onClick")}
      participant={participant}
      isSelected
    />
  );
}

export function ScreenShare(): JSX.Element | null {
  const [participant, setParticipant] = useState<RawParticipant | null>(null);
  useEffect(() => {
    generateVideoTrack({
      name: "screen",
    })
      .then(async (track) => {
        return generateRawVideoPublication({ track });
      })
      .then((videoTrackPublication) => {
        setParticipant(
          generateRawParticipant({
            identity: "moroine",
            videoTrackPublication,
            networkQualityLevel: 3,
          }),
        );
      })
      .catch(console.error);
  }, []);

  if (!participant) {
    return null;
  }

  return <Participant onClick={action("onClick")} participant={participant} />;
}

export function Hide(): JSX.Element | null {
  const [participant, setParticipant] = useState<RawParticipant | null>(null);
  useEffect(() => {
    generateRawVideoPublication()
      .then((videoTrackPublication) => {
        setParticipant(
          generateRawParticipant({
            identity: "moroine",
            videoTrackPublication,
            networkQualityLevel: 2,
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
      onClick={action("onClick")}
      participant={participant}
      hideParticipant
    />
  );
}

export function AsyncVideo(): JSX.Element | null {
  const [participant, setParticipant] = useState<RawParticipant | null>(null);
  useEffect(() => {
    const p = generateRawParticipant({
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

    generateRawVideoPublication()
      .then((videoTrackPublication) => {
        let added = false;
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

  return <Participant onClick={action("onClick")} participant={participant} />;
}
