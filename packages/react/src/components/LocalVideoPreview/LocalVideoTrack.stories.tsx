import React, { useEffect, useState } from "react";
import {
  generateLocalAudioTrack,
  generateLocalVideoTrack,
} from "../../entities/fixtures/tracks.fixture";
import type { IAudioTrack, IVideoTrack } from "../../entities/Track";
import LocalVideoPreview from "./LocalVideoPreview";

export default {
  title: "LocalVideoPreview",
  component: LocalVideoPreview,
};

export function NoVideo(): JSX.Element | null {
  const [audioTrack, setAudioTrack] = useState<IAudioTrack | null>(null);
  useEffect(() => {
    generateLocalAudioTrack().then(setAudioTrack).catch(console.error);
  }, []);

  return <LocalVideoPreview audioTrack={audioTrack} videoTrack={null} />;
}

export function WithVideoAndAudio(): JSX.Element | null {
  const [audioTrack, setAudioTrack] = useState<IAudioTrack | null>(null);
  useEffect(() => {
    generateLocalAudioTrack().then(setAudioTrack).catch(console.error);
  }, []);
  const [track, setTrack] = useState<IVideoTrack | null>(null);
  useEffect(() => {
    generateLocalVideoTrack().then(setTrack).catch(console.error);
  }, []);

  return <LocalVideoPreview audioTrack={audioTrack} videoTrack={track} />;
}

export function WithoutAudio(): JSX.Element | null {
  const [track, setTrack] = useState<IVideoTrack | null>(null);
  useEffect(() => {
    generateLocalVideoTrack().then(setTrack).catch(console.error);
  }, []);

  return <LocalVideoPreview audioTrack={null} videoTrack={track} />;
}
