import { action } from "@storybook/addon-actions";
import React, { useEffect, useState } from "react";
import {
  generateLocalAudioTrack,
  generateLocalVideoTrack,
} from "../../entities/fixtures/tracks.fixture";
import type { ILocalAudioTrack, ILocalVideoTrack } from "../../entities/Track";
import WaitingPage from "./WaitingPage";

export default {
  title: "WaitingPage",
  component: WaitingPage,
};

export function NoVideo(): JSX.Element | null {
  const [audioTrack, setAudioTrack] = useState<ILocalAudioTrack | null>(null);
  useEffect(() => {
    generateLocalAudioTrack().then(setAudioTrack).catch(console.error);
  }, []);

  return (
    <WaitingPage
      videoTrack={null}
      join={action("join")}
      audioTrack={audioTrack}
      isAcquiringLocalTracks={audioTrack === null}
    />
  );
}

export function WithVideoAndAudio(): JSX.Element | null {
  const [audioTrack, setAudioTrack] = useState<ILocalAudioTrack | null>(null);
  useEffect(() => {
    generateLocalAudioTrack().then(setAudioTrack).catch(console.error);
  }, []);
  const [videoTrack, setVideoTrack] = useState<ILocalVideoTrack | null>(null);
  useEffect(() => {
    generateLocalVideoTrack().then(setVideoTrack).catch(console.error);
  }, []);

  return (
    <WaitingPage
      videoTrack={videoTrack}
      join={action("join")}
      audioTrack={audioTrack}
      isAcquiringLocalTracks={audioTrack === null || videoTrack === null}
    />
  );
}

export function NoAudio(): JSX.Element | null {
  const [videoTrack, setVideoTrack] = useState<ILocalVideoTrack | null>(null);
  useEffect(() => {
    generateLocalVideoTrack().then(setVideoTrack).catch(console.error);
  }, []);

  return (
    <WaitingPage
      videoTrack={videoTrack}
      join={action("join")}
      audioTrack={null}
      isAcquiringLocalTracks={videoTrack === null}
    />
  );
}

export function Disabled(): JSX.Element | null {
  const [track, setTrack] = useState<ILocalVideoTrack | null>(null);
  useEffect(() => {
    generateLocalVideoTrack().then(setTrack).catch(console.error);
  }, []);

  return (
    <WaitingPage
      videoTrack={track}
      join={action("join")}
      audioTrack={null}
      disabled
      isAcquiringLocalTracks={track === null}
    />
  );
}

export function Joining(): JSX.Element | null {
  const [track, setTrack] = useState<ILocalVideoTrack | null>(null);
  useEffect(() => {
    generateLocalVideoTrack().then(setTrack).catch(console.error);
  }, []);

  return (
    <WaitingPage
      videoTrack={track}
      join={action("join")}
      audioTrack={null}
      disabled
      isJoining
      isAcquiringLocalTracks={track === null}
    />
  );
}

export function WithAudioError(): JSX.Element | null {
  const [track, setTrack] = useState<ILocalVideoTrack | null>(null);
  useEffect(() => {
    generateLocalVideoTrack().then(setTrack).catch(console.error);
  }, []);

  return (
    <WaitingPage
      videoTrack={track}
      join={action("join")}
      audioTrack={null}
      audioError={new Error()}
      disabled
      isAcquiringLocalTracks={track === null}
    />
  );
}

export function WithVideoError(): JSX.Element | null {
  const [audioTrack, setAudioTrack] = useState<ILocalAudioTrack | null>(null);
  useEffect(() => {
    generateLocalAudioTrack().then(setAudioTrack).catch(console.error);
  }, []);

  return (
    <WaitingPage
      videoTrack={null}
      join={action("join")}
      audioTrack={audioTrack}
      videoError={new Error()}
      isAcquiringLocalTracks={audioTrack === null}
    />
  );
}

export function WithAllErrors(): JSX.Element | null {
  return (
    <WaitingPage
      videoTrack={null}
      join={action("join")}
      audioTrack={null}
      videoError={new Error()}
      audioError={new Error()}
      roomFull
      disabled
    />
  );
}
