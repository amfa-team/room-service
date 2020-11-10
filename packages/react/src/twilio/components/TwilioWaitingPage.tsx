import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useJoin } from "../../api/useApi";
import WaitingPage from "../../components/WaitingPage/WaitingPage";
import type { IUser } from "../../entities/User";
import useTwilioLocalTracks from "../hooks/useTwilioLocalTracks";

interface TwilioWaitingPageProps {
  user: IUser;
  spaceId: string;
}

export default function TwilioWaitingPage(props: TwilioWaitingPageProps) {
  const { spaceId, user } = props;
  const { isAcquiringLocalTracks, videoTrack } = useTwilioLocalTracks();
  const history = useHistory();

  const { join, isJoining } = useJoin(user.id, spaceId, false);
  const onJoinClicked = useCallback(async () => {
    const roomName = await join();
    history.push(`./${roomName}`);
  }, [join, history]);

  return (
    <WaitingPage
      identity={user.username}
      videoTrack={videoTrack}
      join={onJoinClicked}
      disabled={isAcquiringLocalTracks || isJoining}
    />
  );
}
