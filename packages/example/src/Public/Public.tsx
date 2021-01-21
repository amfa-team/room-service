import { SpaceServiceSettings } from "@amfa-team/space-service";
import type { ReactElement } from "react";
import React from "react";
import { Route, Switch } from "react-router-dom";
import HomeFeature from "./HomeFeature/HomeFeature";
import Menu from "./Menu/Menu";
import RoomFeature from "./RoomFeature/RoomFeature";

const endpoint = process.env.SPACE_API_ENDPOINT ?? "";
const settings = { endpoint };

function Public(): ReactElement | null {
  return (
    <SpaceServiceSettings settings={settings}>
      <Menu />
      <Switch>
        <Route path="/" exact>
          <HomeFeature />
        </Route>
        <Route path="/space/:spaceName/room/:roomName?">
          <RoomFeature />
        </Route>
      </Switch>
    </SpaceServiceSettings>
  );
}

export default Public;
