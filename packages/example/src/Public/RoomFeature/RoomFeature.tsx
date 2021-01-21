import { TwilioApp, defaultRoomDictionary } from "@amfa-team/room-service";
import { SpacePage } from "@amfa-team/space-service";
import { DotLoader } from "@amfa-team/theme-service";
import {
  defaultLoginDictionary,
  defaultLogoutDictionary,
  defaultRegisterDictionary,
  defaultRestrictedPageDictionary,
} from "@amfa-team/user-service";
import type { ReactElement } from "react";
import React, { useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { SpaceForm } from "./SpaceForm";

const endpoint = process.env.API_ENDPOINT ?? "";
const settings = { endpoint };

function RoomFeature(): ReactElement {
  const { spaceName, roomName } = useParams<{
    spaceName: string;
    roomName: string | undefined;
  }>();
  const history = useHistory();
  const onRoomChanged = useCallback(
    (name: string) => {
      history.push(`/space/${spaceName}/room/${name}`);
    },
    [history, spaceName],
  );

  return (
    <div style={{ height: "calc(100% - 250px)" }}>
      <h3>Room Feature</h3>
      <SpaceForm />
      <SpacePage
        slug={spaceName}
        loginDictionary={defaultLoginDictionary.fr}
        logoutDictionary={defaultLogoutDictionary.fr}
        registerDictionary={defaultRegisterDictionary.fr}
        dictionary={defaultRestrictedPageDictionary.fr}
        LoadingComponent={DotLoader}
      >
        {(space) => {
          if (space === null) {
            return <p>Not found</p>;
          }

          return (
            <TwilioApp
              space={space}
              settings={settings}
              onRoomChanged={onRoomChanged}
              roomName={roomName ?? null}
              dictionary={defaultRoomDictionary.fr}
            />
          );
        }}
      </SpacePage>
    </div>
  );
}

export default RoomFeature;
