import { UserServiceSettings } from "@amfa-team/user-service";
import type { ReactElement } from "react";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
// import Admin from "./Admin";
import Nav from "./Nav/Nav";
import Public from "./Public/Public";
import User from "./User";

// const endpoint = process.env.API_ENDPOINT ?? "";

const userEndpoint = process.env.USER_API_ENDPOINT ?? "";

const userSettings = {
  endpoint: userEndpoint,
  secure: process.env.NODE_ENV === "production",
  resetPath: "/",
  invitePath: "/invite",
  getSpacePath: (spaceSlug: string) => `/${spaceSlug}`,
};

function App(): ReactElement | null {
  return (
    <UserServiceSettings settings={userSettings}>
      <User />
      <Nav />
      <Switch>
        {/* <Route path="/admin/:pageName">
          <Admin endpoint={endpoint} />
        </Route> */}
        <Route path="/admin">
          <Redirect to="/admin/room" />
        </Route>
        <Route path="/">
          <Public />
        </Route>
      </Switch>
    </UserServiceSettings>
  );
}

export default App;
