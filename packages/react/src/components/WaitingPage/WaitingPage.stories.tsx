import { action } from "@storybook/addon-actions";
import React, { useEffect, useState } from "react";
import { generateRemoteVideoTrack } from "../../entities/fixtures/tracks.fixture";
import type { IVideoTrack } from "../../entities/Track";
import WaitingPage from "./WaitingPage";

export default {
  title: "WaitingPage",
  component: WaitingPage,
};

export function NoVideo(): JSX.Element | null {
  return (
    <WaitingPage identity="Moroine" videoTrack={null} join={action("join")} />
  );
}

export function WithVideo(): JSX.Element | null {
  const [track, setTrack] = useState<IVideoTrack | null>(null);
  useEffect(() => {
    generateRemoteVideoTrack().then(setTrack).catch(console.error);
  }, []);

  return (
    <WaitingPage identity="Moroine" videoTrack={track} join={action("join")} />
  );
}

export function Disabled(): JSX.Element | null {
  const [track, setTrack] = useState<IVideoTrack | null>(null);
  useEffect(() => {
    generateRemoteVideoTrack().then(setTrack).catch(console.error);
  }, []);

  return (
    <WaitingPage
      identity="Moroine"
      videoTrack={track}
      join={action("join")}
      disabled
    />
  );
}
