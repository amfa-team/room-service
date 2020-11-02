import React, { useEffect, useState } from "react";
import { generateRawParticipant } from "../../entities/fixtures/participants.fixture";
import type { RawParticipant } from "../../entities/Participant";
import NetworkQualityLevel from "./NetworkQualityLevel";

export default {
  title: "NetworkQualityLevel",
  component: NetworkQualityLevel,
  decorators: [
    (Story: () => JSX.Element) => (
      <div style={{ background: "blue", width: "100px", height: "100px" }}>
        <Story />
      </div>
    ),
  ],
};

export function NoQuality(): JSX.Element | null {
  return <NetworkQualityLevel participant={generateRawParticipant()} />;
}

export function ZeroQuality(): JSX.Element | null {
  return (
    <NetworkQualityLevel
      participant={generateRawParticipant({
        networkQualityLevel: 0,
      })}
    />
  );
}

export function OneQuality(): JSX.Element | null {
  return (
    <NetworkQualityLevel
      participant={generateRawParticipant({
        networkQualityLevel: 1,
      })}
    />
  );
}

export function TwoQuality(): JSX.Element | null {
  return (
    <NetworkQualityLevel
      participant={generateRawParticipant({
        networkQualityLevel: 2,
      })}
    />
  );
}

export function ThreeQuality(): JSX.Element | null {
  return (
    <NetworkQualityLevel
      participant={generateRawParticipant({
        networkQualityLevel: 3,
      })}
    />
  );
}

export function FourQuality(): JSX.Element | null {
  return (
    <NetworkQualityLevel
      participant={generateRawParticipant({
        networkQualityLevel: 4,
      })}
    />
  );
}

export function Changing(): JSX.Element | null {
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

    return () => {
      clearInterval(t1);
    };
  }, []);

  if (!participant) {
    return null;
  }

  return <NetworkQualityLevel participant={participant} />;
}
