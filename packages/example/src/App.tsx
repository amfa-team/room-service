import { useSetApiSettings } from "@amfa-team/user-service";
import type { ReactElement } from "react";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Admin from "./Admin";
import LangSwitch from "./LangSwitch";
import Room from "./Room";

const endpoint = process.env.API_ENDPOINT ?? "";
const userApiEndpoint = process.env.USER_API_ENDPOINT ?? "";
const userSettings = { endpoint: userApiEndpoint };

function App(): ReactElement | null {
  const isSet = useSetApiSettings(userSettings);

  if (!isSet) {
    return null;
  }

  return (
    <Switch>
      <Route path="/admin/:page?">
        <Admin endpoint={endpoint} />
      </Route>
      <Route path={`/:lang(en|fr)/:roomName?`}>
        <LangSwitch />
        <Room space={{ id: "my-space" }} endpoint={endpoint} />
      </Route>
      <Redirect to="/en" />
    </Switch>
  );
}

export default App;
