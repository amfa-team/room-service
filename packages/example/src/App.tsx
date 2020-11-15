import md5 from "crypto-js/md5";
import type { ReactElement } from "react";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { animals, uniqueNamesGenerator } from "unique-names-generator";
import Admin from "./Admin";
import LangSwitch from "./LangSwitch";
import Room from "./Room";

const username = uniqueNamesGenerator({
  dictionaries: [animals],
});

const userId = md5(username).toString().substr(0, 24);

const endpoint = process.env.API_ENDPOINT ?? "";

function App(): ReactElement | null {
  return (
    <Switch>
      <Route path="/admin/:page?">
        <Admin endpoint={endpoint} />
      </Route>
      <Route path={`/:lang(en|fr)/:roomName?`}>
        <LangSwitch />
        <Room
          user={{ username, id: userId }}
          space={{ id: "my-space" }}
          endpoint={endpoint}
        />
      </Route>
      <Redirect to="/en" />
    </Switch>
  );
}

export default App;
