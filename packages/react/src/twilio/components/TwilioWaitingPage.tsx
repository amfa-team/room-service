import React, { useCallback, useEffect, useState } from "react";
import { useJoin } from "../../api/useApi";
import WaitingPage from "../../components/WaitingPage/WaitingPage";
import useTwilioLocalTracks from "../hooks/useTwilioLocalTracks";

interface TwilioWaitingPageProps {
  userJwtToken: string;
  spaceId: string;
  roomName: string | null;
  onRoomChanged: (roomName: string) => void;
}

export default function TwilioWaitingPage(props: TwilioWaitingPageProps) {
  const { spaceId, userJwtToken, roomName, onRoomChanged } = props;
  const {
    isAcquiringLocalTracks,
    videoTrack,
    videoError,
    audioTrack,
    audioError,
  } = useTwilioLocalTracks();
  const [roomFull, setRoomFull] = useState(false);

  const { join, isJoining } = useJoin(
    userJwtToken,
    spaceId,
    roomFull,
    props.roomName,
  );
  const onJoinClicked = useCallback(async () => {
    const r = await join();
    if (r === null) {
      setRoomFull(true);
    } else if (roomName !== r) {
      onRoomChanged(r);
    }
  }, [join, roomName, onRoomChanged]);

  useEffect(() => {
    setRoomFull(false);
  }, [props.roomName]);

  return (
    <WaitingPage
      audioTrack={audioTrack}
      videoTrack={videoTrack}
      join={onJoinClicked}
      disabled={isAcquiringLocalTracks || isJoining}
      roomFull={roomFull}
      audioError={audioError}
      videoError={videoError}
    />
  );
}

TwilioWaitingPage.defaultProps = {
  roomName: null,
};
