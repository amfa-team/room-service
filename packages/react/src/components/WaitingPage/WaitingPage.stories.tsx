import { action } from "@storybook/addon-actions";
import React, { useEffect, useState } from "react";
import {
  generateLocalAudioTrack,
  generateRemoteVideoTrack,
} from "../../entities/fixtures/tracks.fixture";
import type { IAudioTrack, IVideoTrack } from "../../entities/Track";
import WaitingPage from "./WaitingPage";

export default {
  title: "WaitingPage",
  component: WaitingPage,
};

export function NoVideo(): JSX.Element | null {
  const [audioTrack, setAudioTrack] = useState<IAudioTrack | null>(null);
  useEffect(() => {
    generateLocalAudioTrack().then(setAudioTrack).catch(console.error);
  }, []);

  return (
    <WaitingPage
      videoTrack={null}
      join={action("join")}
      audioTrack={audioTrack}
    />
  );
}

export function WithVideoAndAudio(): JSX.Element | null {
  const [audioTrack, setAudioTrack] = useState<IAudioTrack | null>(null);
  useEffect(() => {
    generateLocalAudioTrack().then(setAudioTrack).catch(console.error);
  }, []);
  const [videoTrack, setVideoTrack] = useState<IVideoTrack | null>(null);
  useEffect(() => {
    generateRemoteVideoTrack().then(setVideoTrack).catch(console.error);
  }, []);

  return (
    <WaitingPage
      videoTrack={videoTrack}
      join={action("join")}
      audioTrack={audioTrack}
    />
  );
}

export function NoAudio(): JSX.Element | null {
  const [videoTrack, setVideoTrack] = useState<IVideoTrack | null>(null);
  useEffect(() => {
    generateRemoteVideoTrack().then(setVideoTrack).catch(console.error);
  }, []);

  return (
    <WaitingPage
      videoTrack={videoTrack}
      join={action("join")}
      audioTrack={null}
    />
  );
}

export function Disabled(): JSX.Element | null {
  const [track, setTrack] = useState<IVideoTrack | null>(null);
  useEffect(() => {
    generateRemoteVideoTrack().then(setTrack).catch(console.error);
  }, []);

  return (
    <WaitingPage
      videoTrack={track}
      join={action("join")}
      audioTrack={null}
      disabled
    />
  );
}
