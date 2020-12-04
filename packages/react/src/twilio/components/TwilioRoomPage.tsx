import React, { useCallback } from "react";
import { useJoin } from "../../api/useApi";
import RoomPage from "../../components/RoomPage/RoomPage";
import type { IRoom } from "../../entities/Room";
import { useConnectTwilioRoom } from "../hooks/useTwilioRoom";

interface TwilioRoomPageProps {
  userJwtToken: string;
  spaceId: string;
  token: string;
  roomName: string;
  onRoomChanged: (roomName: string) => void;
}

export default function TwilioRoomPage(props: TwilioRoomPageProps) {
  const { token, onRoomChanged, spaceId, userJwtToken, roomName } = props;
  const { data } = useConnectTwilioRoom(token);
  const { join, isJoining } = useJoin(spaceId, true, roomName);

  const onShuffleClicked = useCallback(async () => {
    const r = await join(userJwtToken);
    if (r !== null) {
      onRoomChanged(r);
    }
  }, [join, onRoomChanged, userJwtToken]);

  // Room type from twilio is badly written ==> need PR on @types/twilio-video
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const room: IRoom | null = data as any;

  return (
    <RoomPage room={room} onShuffle={onShuffleClicked} isJoining={isJoining} />
  );
}
