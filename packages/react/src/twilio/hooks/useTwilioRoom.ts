import { captureException } from "@sentry/react";
import { useEffect, useState } from "react";
import { atom, useRecoilState } from "recoil";
import type { Room } from "twilio-video";
import Video from "twilio-video";
import useTwilioLocalTracks from "./useTwilioLocalTracks";

const twilioRoom = atom<Room | null>({
  key: "room-service/twilio/room",
  default: null,
  dangerouslyAllowMutability: true,
});

async function connect(token: string): Promise<Room> {
  const newRoom = await Video.connect(token, {
    audio: false,
    video: false,
  });
  const disconnect = () => newRoom.disconnect();

  newRoom.once("disconnected", () => {
    window.removeEventListener("beforeunload", disconnect);

    // if (isMobile) {
    //   window.removeEventListener('pagehide', disconnect);
    // }
  });

  // Add a listener to disconnect from the room when a user closes their browser
  window.addEventListener("beforeunload", disconnect);

  // if (isMobile) {
  //   // Add a listener to disconnect from the room when a mobile user closes their browser
  //   window.addEventListener('pagehide', disconnect);
  // }

  return newRoom;
}

type AsyncData<T> =
  | { data: null; isLoading: true }
  | { data: T; isLoading: false };

export function useConnectTwilioRoom(token: string): AsyncData<Room> {
  const [room, setRoom] = useRecoilState(twilioRoom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { videoTrack, audioTrack } = useTwilioLocalTracks();
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setRetryCount(0);
  }, [token]);

  useEffect(() => {
    const abortController = new AbortController();
    if (!token) {
      setRoom((prevRoom) => {
        if (prevRoom && prevRoom.state !== "disconnected") {
          prevRoom.disconnect();
        }
        return null;
      });
      return () => {
        // no-op
      };
    }

    setIsLoading(true);
    connect(token)
      .then((newRoom) => {
        if (abortController.signal.aborted) {
          newRoom.disconnect();
          return;
        }

        const disconnect = () => {
          newRoom.disconnect();
          abortController.signal.removeEventListener("abort", disconnect);
        };
        abortController.signal.addEventListener("abort", disconnect);

        setRoom((prevRoom) => {
          if (prevRoom && prevRoom.state !== "disconnected") {
            prevRoom.disconnect();
          }
          return newRoom;
        });

        setIsLoading(false);
      })
      .catch((err) => {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
          if (retryCount > 3) {
            captureException(err);
            setError(err);
          } else {
            setRetryCount(retryCount + 1);
          }
        }
      });

    return () => {
      abortController.abort();
    };
  }, [token, setRoom, retryCount]);

  useEffect(() => {
    const abortController = new AbortController();
    if (room && videoTrack) {
      room.localParticipant.publishTrack(videoTrack).catch((e) => {
        if (!abortController.signal.aborted) {
          setError(e);
        }
      });
    }
    return () => {
      abortController.abort();
      if (room && videoTrack) {
        room.localParticipant.unpublishTrack(videoTrack);
      }
    };
  }, [room, videoTrack]);

  useEffect(() => {
    const abortController = new AbortController();
    if (room && audioTrack) {
      room.localParticipant.publishTrack(audioTrack).catch((e) => {
        if (!abortController.signal.aborted) {
          setError(e);
        }
      });
    }
    return () => {
      abortController.abort();
      if (room && audioTrack) {
        room.localParticipant.unpublishTrack(audioTrack);
      }
    };
  }, [room, audioTrack]);

  if (error) {
    throw error;
  }

  return isLoading || room === null
    ? { isLoading: true, data: null }
    : { isLoading: false, data: room };
}
