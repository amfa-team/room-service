import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { RecoilRoot } from "recoil";
import type { ApiSettings } from "../api/api";
import { useSetApiSettings } from "../api/useApi";
import type { ISpace } from "../entities/Space";
import type { IUser } from "../entities/User";
import TwilioRoomPage from "./components/TwilioRoomPage";
import TwilioWaitingPage from "./components/TwilioWaitingPage";

export interface TwilioAppProps {
  user: IUser;
  space: ISpace;
  settings: ApiSettings;
}

function TwilioApp(props: TwilioAppProps) {
  const { path } = useRouteMatch();
  const isSet = useSetApiSettings(props.settings);

  if (!isSet) {
    return null;
  }

  return (
    <Switch>
      <Route path={`${path}:roomName`}>
        <TwilioRoomPage user={props.user} spaceId={props.space.id} />
      </Route>
      <Route exact path={path}>
        <TwilioWaitingPage user={props.user} spaceId={props.space.id} />
      </Route>
    </Switch>
  );
}

export default function TwilioAppContainer(props: TwilioAppProps) {
  return (
    <RecoilRoot>
      <TwilioApp {...props} />
    </RecoilRoot>
  );
}
