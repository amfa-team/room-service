import { TwilioApp } from "@amfa-team/room-service";
import type { ReactElement } from "react";
import React from "react";

function App(): ReactElement | null {
  return (
    <TwilioApp
      user={{ username: "Moroine", id: "5f8e8b4bd50d540008530efc" }}
      space={{ id: "yop" }}
      settings={{
        endpoint: "http://localhost:4000/dev/",
      }}
    />
  );
}

export default App;
