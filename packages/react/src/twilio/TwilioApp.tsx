import {
  useToken as useJwtToken,
  useSetApiSettings as useSetUserApiSettings,
} from "@amfa-team/user-service";
import type { ApiSettings as UserApiSettings } from "@amfa-team/user-service";
import React from "react";
import type { ApiSettings } from "../api/api";
import { useSetApiSettings, useToken } from "../api/useApi";
import type { ISpace } from "../entities/Space";
import type { Dictionary } from "../i18n/dictionary";
import { useSetDictionary } from "../i18n/dictionary";
import TwilioRoomPage from "./components/TwilioRoomPage";
import TwilioWaitingPage from "./components/TwilioWaitingPage";

export interface TwilioAppProps {
  space: ISpace;
  settings: ApiSettings;
  userSettings: UserApiSettings;
  roomName: string | null;
  onRoomChanged: (roomName: string) => void;
  dictionary: Dictionary;
}

function TwilioApp(props: TwilioAppProps) {
  const token = useToken();
  const jwtToken = useJwtToken();

  if (!token || props.roomName === null || jwtToken === null) {
    return (
      <TwilioWaitingPage
        spaceId={props.space.id}
        roomName={props.roomName}
        onRoomChanged={props.onRoomChanged}
      />
    );
  }

  return (
    <TwilioRoomPage
      token={token}
      userJwtToken={jwtToken}
      spaceId={props.space.id}
      roomName={props.roomName}
      onRoomChanged={props.onRoomChanged}
    />
  );
}

export default function TwilioAppContainer(props: TwilioAppProps) {
  const userSettingsSet = useSetUserApiSettings(props.userSettings);
  const apiSettings = useSetApiSettings(props.settings);
  useSetDictionary(props.dictionary);

  if (!apiSettings || !userSettingsSet) {
    return null;
  }

  return <TwilioApp {...props} />;
}
