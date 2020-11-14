import React, { useEffect, useState } from "react";
import { generateLocalVideoTrack } from "../../entities/fixtures/videoTracks.fixture";
import type { IVideoTrack } from "../../entities/VideoTrack";
import LocalVideoPreview from "./LocalVideoPreview";

export default {
  title: "LocalVideoPreview",
  component: LocalVideoPreview,
};

export function NoVideo(): JSX.Element | null {
  return <LocalVideoPreview videoTrack={null} identity="Moroine" />;
}

export function WithVideo(): JSX.Element | null {
  const [track, setTrack] = useState<IVideoTrack | null>(null);
  useEffect(() => {
    generateLocalVideoTrack().then(setTrack).catch(console.error);
  }, []);

  return <LocalVideoPreview videoTrack={track} identity="Moroine" />;
}
