import type { BlameDictionary } from "@amfa-team/user-service";
import { useToken as useJwtToken } from "@amfa-team/user-service";
import React from "react";
import Video from "twilio-video";
import type { ApiSettings } from "../api/api";
import { useSetApiSettings, useToken } from "../api/useApi";
import { DictionaryProvider } from "../components/DictionaryProvider/DictionaryProvider";
import type { ISpace } from "../entities/Space";
import type { RoomDictionary } from "../i18n/dictionary";
import TwilioRoomPage from "./components/TwilioRoomPage";
import TwilioWaitingPage from "./components/TwilioWaitingPage";

export interface TwilioAppProps {
  space: ISpace;
  settings: ApiSettings;
  roomName: string | null;
  onRoomChanged: (roomName: string) => void;
  dictionary: RoomDictionary;
  blameDictionary: BlameDictionary;
}

function TwilioAppRaw(props: TwilioAppProps) {
  const token = useToken();
  const jwtToken = useJwtToken();

  if (!token || props.roomName === null || jwtToken === null) {
    return (
      <TwilioWaitingPage
        blameDictionary={props.blameDictionary}
        spaceId={props.space._id}
        roomName={props.roomName}
        onRoomChanged={props.onRoomChanged}
      />
    );
  }

  return (
    <TwilioRoomPage
      blameDictionary={props.blameDictionary}
      token={token}
      userJwtToken={jwtToken}
      spaceId={props.space._id}
      roomName={props.roomName}
      onRoomChanged={props.onRoomChanged}
    />
  );
}

const TwilioApp = React.memo(TwilioAppRaw);

export default function TwilioAppContainer(props: TwilioAppProps) {
  const ready = useSetApiSettings(props.settings);

  if (!ready) {
    return null;
  }

  if (!Video.isSupported) {
    return <div>Not supported</div>;
  }

  return (
    <DictionaryProvider dictionary={props.dictionary}>
      <TwilioApp {...props} />
    </DictionaryProvider>
  );
}
