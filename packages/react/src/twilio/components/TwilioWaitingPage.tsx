import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useJoin } from "../../api/useApi";
import WaitingPage from "../../components/WaitingPage/WaitingPage";
import type { IUser } from "../../entities/User";
import useTwilioLocalTracks from "../hooks/useTwilioLocalTracks";

interface TwilioWaitingPageProps {
  user: IUser;
  spaceId: string;
  roomName: string | null;
}

export default function TwilioWaitingPage(props: TwilioWaitingPageProps) {
  const { spaceId, user, roomName } = props;
  const { isAcquiringLocalTracks, videoTrack } = useTwilioLocalTracks();
  const history = useHistory();
  const [roomFull, setRoomFull] = useState(false);

  const { join, isJoining } = useJoin(
    user.id,
    spaceId,
    roomFull,
    props.roomName,
  );
  const onJoinClicked = useCallback(async () => {
    const r = await join();
    if (r === null) {
      setRoomFull(true);
    } else if (roomName === null) {
      history.push(`./${r}`);
    } else if (roomName !== r) {
      history.push(`../${r}`);
    }
  }, [join, history, roomName]);

  useEffect(() => {
    setRoomFull(false);
  }, [props.roomName]);

  return (
    <WaitingPage
      identity={user.username}
      videoTrack={videoTrack}
      join={onJoinClicked}
      disabled={isAcquiringLocalTracks || isJoining}
      roomFull={roomFull}
    />
  );
}

TwilioWaitingPage.defaultProps = {
  roomName: null,
};
