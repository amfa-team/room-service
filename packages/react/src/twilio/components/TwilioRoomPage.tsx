import type { BlameDictionary } from "@amfa-team/user-service";
import React, { useCallback } from "react";
import type { ReactElement } from "react";
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
  onHangUp: () => void;
  blameDictionary: BlameDictionary;
  helpButton: ReactElement;
  featuresViewerButton: any;
}

function TwilioRoomPage(props: TwilioRoomPageProps) {
  const {
    token,
    onRoomChanged,
    onHangUp,
    spaceId,
    userJwtToken,
    roomName,
    blameDictionary,
    helpButton,
    featuresViewerButton,
  } = props;
  const { data } = useConnectTwilioRoom(token);
  const { join, isJoining } = useJoin(spaceId, true, roomName);

  const onShuffleClicked = useCallback(async () => {
    if (!isJoining) {
      // Do not shuffle when joining
      const abortController = new AbortController();
      const joinData = await join(userJwtToken, abortController.signal);
      if (joinData.success) {
        onRoomChanged(joinData.room.name);
      }
    }
  }, [join, onRoomChanged, userJwtToken, isJoining]);

  // Room type from twilio is badly written ==> need PR on @types/twilio-video
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const room: IRoom | null = data as any;

  return (
    <RoomPage
      room={room}
      onShuffle={onShuffleClicked}
      onHangUp={onHangUp}
      isJoining={isJoining}
      blameDictionary={blameDictionary}
      helpButton={helpButton}
      featuresViewerButton={featuresViewerButton}
    />
  );
}

export default React.memo<TwilioRoomPageProps>(TwilioRoomPage);
