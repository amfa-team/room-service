import React, { useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useJoin, useToken } from "../../api/useApi";
import ParticipantList from "../../components/ParticipantList/ParticipantList";
import ParticipantListLoading from "../../components/ParticipantListLoading/ParticipantListLoading";
import type { IRoom } from "../../entities/Room";
import type { IUser } from "../../entities/User";
import { useConnectTwilioRoom } from "../hooks/useTwilioRoom";
import TwilioWaitingPage from "./TwilioWaitingPage";

interface TwilioRoomPagePropsContainer {
  user: IUser;
  spaceId: string;
}
interface TwilioRoomPageProps extends TwilioRoomPagePropsContainer {
  token: string;
  roomName: string;
}

function TwilioRoomPage(props: TwilioRoomPageProps) {
  const { data } = useConnectTwilioRoom(props.token);
  const { join } = useJoin(props.user.id, props.spaceId, true, props.roomName);
  const history = useHistory();

  const onShuffleClicked = useCallback(async () => {
    const roomName = await join();
    history.push(`./${roomName}`);
  }, [join, history]);

  // isJoining || isLoading ||
  if (data === null) {
    return <ParticipantListLoading />;
  }

  // Room type from twilio is badly written ==> need PR on @types/twilio-video
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const room: IRoom = data as any;

  return (
    <div>
      {/* <div>{props.roomName}</div> */}
      <ParticipantList room={room} onShuffle={onShuffleClicked} />
    </div>
  );
}

export default function TwilioRoomPageContainer(
  props: TwilioRoomPagePropsContainer,
) {
  const token = useToken();
  const params = useParams<{ roomName: string }>();

  if (!token) {
    return (
      <TwilioWaitingPage
        user={props.user}
        spaceId={props.spaceId}
        roomName={params.roomName}
      />
    );
  }

  return (
    <TwilioRoomPage
      token={token}
      user={props.user}
      spaceId={props.spaceId}
      roomName={params.roomName}
    />
  );
}
