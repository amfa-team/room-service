import { TwilioApp } from "@amfa-team/room-service";
import md5 from "crypto-js/md5";
import type { ReactElement } from "react";
import React from "react";
import { animals, uniqueNamesGenerator } from "unique-names-generator";

const username = uniqueNamesGenerator({
  dictionaries: [animals],
});

const userId = md5(username).toString().substr(0, 24);

function App(): ReactElement | null {
  return (
    <TwilioApp
      user={{ username, id: userId }}
      space={{ id: "my-space" }}
      settings={{
        endpoint: "http://localhost:4000/dev/",
      }}
    />
  );
}

export default App;
