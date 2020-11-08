import { AdminApp, TwilioApp } from "@amfa-team/room-service";
import md5 from "crypto-js/md5";
import type { ReactElement } from "react";
import React from "react";
import { Route, Switch } from "react-router-dom";
import useLocalStorage from "react-use-localstorage";
import { animals, uniqueNamesGenerator } from "unique-names-generator";

const username = uniqueNamesGenerator({
  dictionaries: [animals],
});

const userId = md5(username).toString().substr(0, 24);

const endpoint = process.env.API_ENDPOINT ?? "";

function App(): ReactElement | null {
  const [secret, setSecret] = useLocalStorage("API_SECRET", "super-SECRET");

  return (
    <Switch>
      <Route path="/admin">
        <form noValidate autoComplete="off">
          <label htmlFor="secret">API Secret</label>
          <input
            id="secret"
            value={secret}
            onChange={(e) => {
              setSecret(e.target.value);
            }}
          />
        </form>
        <AdminApp settings={{ endpoint, secret }} />
      </Route>
      <Route path="/">
        <TwilioApp
          user={{ username, id: userId }}
          space={{ id: "my-space" }}
          settings={{ endpoint }}
        />
      </Route>
    </Switch>
  );
}

export default App;
