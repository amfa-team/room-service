import type { ISpace, IUser } from "@amfa-team/room-service";
import { TwilioApp } from "@amfa-team/room-service";
import React, { useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";

interface RoomProps {
  user: IUser;
  space: ISpace;
  endpoint: string;
}

export default function Room(props: RoomProps) {
  const params = useParams<{ roomName?: string }>();
  const history = useHistory();
  const onRoomChanged = useCallback(
    (name: string) => {
      history.push(`/${name}`);
    },
    [history],
  );

  return (
    <TwilioApp
      user={props.user}
      space={props.space}
      settings={{ endpoint: props.endpoint }}
      onRoomChanged={onRoomChanged}
      roomName={params.roomName ?? null}
    />
  );
}
