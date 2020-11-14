import React, { useEffect, useState } from "react";
import { generateRawLocalParticipant } from "../../entities/fixtures/participants.fixture";
import { generateRawVideoPublication } from "../../entities/fixtures/publications.fixture";
import { generateLocalVideoTrack } from "../../entities/fixtures/tracks.fixture";
import type { RawLocalParticipant } from "../../entities/Participant";
import Controls from "./Controls";

export default {
  title: "Controls",
  component: Controls,
};

export function NoVideoNoAudio(): JSX.Element | null {
  return <Controls localParticipant={generateRawLocalParticipant()} />;
}

export function VideoOnlyNoAudio(): JSX.Element | null {
  const [participant, setParticipant] = useState<RawLocalParticipant | null>(
    null,
  );
  useEffect(() => {
    const abortController = new AbortController();
    generateLocalVideoTrack()
      .then((videoTrack) => {
        if (!abortController.signal.aborted) {
          setParticipant(
            generateRawLocalParticipant({
              identity: "moroine",
              videoTrackPublication: generateRawVideoPublication({
                track: videoTrack,
              }),
            }),
          );
        }
      })
      .catch(console.error);

    return () => {
      abortController.abort();
    };
  }, []);

  return <Controls localParticipant={participant} />;
}

export function VideoOnlyDisabledNoAudio(): JSX.Element | null {
  const [participant, setParticipant] = useState<RawLocalParticipant | null>(
    null,
  );
  useEffect(() => {
    const abortController = new AbortController();
    generateLocalVideoTrack()
      .then((videoTrack) => {
        if (!abortController.signal.aborted) {
          videoTrack.disable();
          setParticipant(
            generateRawLocalParticipant({
              identity: "moroine",
              videoTrackPublication: generateRawVideoPublication({
                track: videoTrack,
              }),
            }),
          );
        }
      })
      .catch(console.error);

    return () => {
      abortController.abort();
    };
  }, []);

  return <Controls localParticipant={participant} />;
}

export function ChangingVideoDisabledNoAudio(): JSX.Element | null {
  const [participant, setParticipant] = useState<RawLocalParticipant | null>(
    null,
  );
  useEffect(() => {
    const abortController = new AbortController();
    generateLocalVideoTrack()
      .then((videoTrack) => {
        const { signal } = abortController;
        if (!abortController.signal.aborted) {
          const id = setTimeout(() => {
            videoTrack.enable(!videoTrack.isEnabled);
          }, 3000);
          signal.onabort = () => clearTimeout(id);
          setParticipant(
            generateRawLocalParticipant({
              identity: "moroine",
              videoTrackPublication: generateRawVideoPublication({
                track: videoTrack,
              }),
            }),
          );
        }
      })
      .catch(console.error);

    return () => {
      abortController.abort();
    };
  }, []);

  return <Controls localParticipant={participant} />;
}
