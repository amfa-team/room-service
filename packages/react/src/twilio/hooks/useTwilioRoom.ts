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
  const newRoom = await Video.connect(token);
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

  useEffect(() => {
    if (!token) {
      setRoom((prevRoom) => {
        if (prevRoom) {
          prevRoom.disconnect();
        }
        return null;
      });
      return;
    }

    setIsLoading(true);

    connect(token)
      .then((newRoom) => {
        setRoom((prevRoom) => {
          if (prevRoom) {
            prevRoom.disconnect();
          }
          return newRoom;
        });
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, [token, setRoom]);

  useEffect(() => {
    if (room && videoTrack) {
      room.localParticipant.publishTrack(videoTrack).catch(setError);
    }
    return () => {
      if (room && videoTrack) {
        room.localParticipant.unpublishTrack(videoTrack);
      }
    };
  }, [room, videoTrack]);

  useEffect(() => {
    if (room && audioTrack) {
      room.localParticipant.publishTrack(audioTrack).catch(setError);
    }
    return () => {
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
