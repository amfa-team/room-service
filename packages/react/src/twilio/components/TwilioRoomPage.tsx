import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useToken } from "../../api/useApi";
import { LoadingFallback } from "../../components/Loading/Loading";
import ParticipantList from "../../components/ParticipantList/ParticipantList";
import type { IRoom } from "../../entities/Room";
import { useConnectTwilioRoom } from "../hooks/useTwilioRoom";

interface TwilioRoomPageProps {
  token: string;
}

function TwilioRoomPage(props: TwilioRoomPageProps) {
  const params = useParams<{ roomName: string }>();
  const { isLoading, data } = useConnectTwilioRoom(props.token);

  if (isLoading || data === null) {
    return <LoadingFallback />;
  }

  // Room type from twilio is badly written ==> need PR on @types/twilio-video
  const room: IRoom = data as any;

  return (
    <div>
      <div>{params.roomName}</div>
      <ParticipantList room={room} />
    </div>
  );
}

export default function TwilioRoomPageContainer(/* props: TwilioRoomPageProps */) {
  const token = useToken();
  const history = useHistory();

  if (!token) {
    history.push("..");
    return null;
  }

  return <TwilioRoomPage token={token} />;
}
