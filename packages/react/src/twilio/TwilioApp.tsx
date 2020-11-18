import React from "react";
import { RecoilRoot } from "recoil";
import type { ApiSettings } from "../api/api";
import { useSetApiSettings, useToken } from "../api/useApi";
import type { ISpace } from "../entities/Space";
import type { Dictionary } from "../i18n/dictionary";
import { useSetDictionary } from "../i18n/dictionary";
import TwilioRoomPage from "./components/TwilioRoomPage";
import TwilioWaitingPage from "./components/TwilioWaitingPage";

export interface TwilioAppProps {
  userJwtToken: string;
  space: ISpace;
  settings: ApiSettings;
  roomName: string | null;
  onRoomChanged: (roomName: string) => void;
  dictionary: Dictionary;
}

function TwilioApp(props: TwilioAppProps) {
  const token = useToken();
  const isSet = useSetApiSettings(props.settings);
  useSetDictionary(props.dictionary);

  if (!isSet) {
    return null;
  }

  if (!token || props.roomName === null) {
    return (
      <TwilioWaitingPage
        userJwtToken={props.userJwtToken}
        spaceId={props.space.id}
        roomName={props.roomName}
        onRoomChanged={props.onRoomChanged}
      />
    );
  }

  return (
    <TwilioRoomPage
      token={token}
      userJwtToken={props.userJwtToken}
      spaceId={props.space.id}
      roomName={props.roomName}
      onRoomChanged={props.onRoomChanged}
    />
  );
}

export default function TwilioAppContainer(props: TwilioAppProps) {
  return (
    <RecoilRoot>
      <TwilioApp {...props} />
    </RecoilRoot>
  );
}
