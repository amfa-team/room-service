import React, { useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useJoin, useToken } from "../../api/useApi";
import { LoadingFallback } from "../../components/Loading/Loading";
import ParticipantList from "../../components/ParticipantList/ParticipantList";
import type { IRoom } from "../../entities/Room";
import type { IUser } from "../../entities/User";
import { useConnectTwilioRoom } from "../hooks/useTwilioRoom";

interface TwilioRoomPagePropsContainer {
  user: IUser;
  spaceId: string;
}
interface TwilioRoomPageProps extends TwilioRoomPagePropsContainer {
  token: string;
}

function TwilioRoomPage(props: TwilioRoomPageProps) {
  const params = useParams<{ roomName: string }>();
  const { isLoading, data } = useConnectTwilioRoom(props.token);
  const { join, isJoining } = useJoin(props.user.id, props.spaceId, true);
  const history = useHistory();

  const onShuffleClicked = useCallback(async () => {
    const roomName = await join();
    history.push(`./${roomName}`);
  }, [join, history]);

  if (isJoining || isLoading || data === null) {
    return <LoadingFallback />;
  }

  // Room type from twilio is badly written ==> need PR on @types/twilio-video
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const room: IRoom = data as any;

  return (
    <div>
      <div>{params.roomName}</div>
      <ParticipantList room={room} onShuffle={onShuffleClicked} />
    </div>
  );
}

export default function TwilioRoomPageContainer(
  props: TwilioRoomPagePropsContainer,
) {
  const token = useToken();
  const history = useHistory();

  if (!token) {
    history.push("..");
    return null;
  }

  return (
    <TwilioRoomPage token={token} user={props.user} spaceId={props.spaceId} />
  );
}
