import { UserModalPage } from "@amfa-team/user-service";
import React, { useCallback } from "react";
import { useJoin } from "../../api/useApi";
import Controls from "../../components/Controls/Controls";
import ParticipantList from "../../components/ParticipantList/ParticipantList";
import ParticipantListLoading from "../../components/ParticipantListLoading/ParticipantListLoading";
import type { IRoom } from "../../entities/Room";
import { useDictionary } from "../../i18n/dictionary";
import { useConnectTwilioRoom } from "../hooks/useTwilioRoom";

interface TwilioRoomPageProps {
  userJwtToken: string;
  spaceId: string;
  token: string;
  roomName: string;
  onRoomChanged: (roomName: string) => void;
}

export default function TwilioRoomPage(props: TwilioRoomPageProps) {
  const userDictionary = useDictionary("userDictionary");
  const { token, onRoomChanged, spaceId, userJwtToken, roomName } = props;
  const { data } = useConnectTwilioRoom(token);
  const { join } = useJoin(spaceId, true, roomName);

  const onShuffleClicked = useCallback(async () => {
    const r = await join(userJwtToken);
    if (r !== null) {
      onRoomChanged(r);
    }
  }, [join, onRoomChanged, userJwtToken]);

  if (data === null) {
    return <ParticipantListLoading />;
  }

  // Room type from twilio is badly written ==> need PR on @types/twilio-video
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const room: IRoom = data as any;

  return (
    <div>
      <UserModalPage dictionary={userDictionary} />
      <ParticipantList room={room} onShuffle={onShuffleClicked} />
      <Controls localParticipant={room.localParticipant} />
    </div>
  );
}
