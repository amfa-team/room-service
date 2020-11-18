import { useConnect, useUser } from "@amfa-team/user-service";
import type { ReactElement } from "react";
import React from "react";

function Connect(): ReactElement {
  const user = useUser();
  const { connect, isConnecting } = useConnect();
  return (
    <div>
      <p>{user === null ? "Not connected" : `connected: ${user.id}`}</p>
      <button type="button" onClick={connect} disabled={isConnecting}>
        Connect
      </button>
    </div>
  );
}

export default Connect;
