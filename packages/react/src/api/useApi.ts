import type { IRoom, JoinPayload } from "@amfa-team/room-service-types";
import { useCallback, useEffect, useState } from "react";
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import type { ApiSettings } from "./api";
import { apiPost } from "./api";

const tokenAtom = atom<null | string>({
  key: "room-service/useApi/token",
  default: null,
});

const roomAtom = atom<IRoom | null>({
  key: "room-service/useApi/room",
  default: null,
});

const apiSettingsAtom = atom<ApiSettings | null>({
  key: "room-service/useApi/apiSettings",
  default: null,
});

export function useSetApiSettings(settings: ApiSettings) {
  const [s, setSettings] = useRecoilState(apiSettingsAtom);
  useEffect(() => {
    setSettings(settings);
  }, [setSettings, settings]);

  return s !== null;
}

export function useApiSettings(): ApiSettings {
  const settings = useRecoilValue(apiSettingsAtom);
  if (!settings) {
    throw new Error("useApiSettings: Settings are not set");
  }
  return settings;
}

export function useJoin(
  spaceId: string,
  change: boolean,
  roomName: string | null,
) {
  const settings = useApiSettings();
  const setRoom = useSetRecoilState(roomAtom);
  const setToken = useSetRecoilState(tokenAtom);
  const [isJoining, setIsJoining] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const join = useCallback(
    async (jwtToken: string, signal: AbortSignal): Promise<JoinPayload> => {
      setIsJoining(true);
      setIsFull(false);
      setNotFound(false);

      try {
        const data = await apiPost(
          settings,
          "join",
          {
            participantToken: jwtToken,
            spaceId,
            change,
            roomName,
          },
          signal,
        );

        if (data.success) {
          setRoom(data.room);
          setToken(data.token);
        } else {
          setIsFull(data.full ?? false);
          setNotFound(data.notFound ?? false);
        }

        setIsJoining(false);

        return data;
      } catch (e) {
        if (!signal.aborted) {
          console.error("useApi/useJoin: fail", e);
          setIsJoining(false);
          throw e;
        }

        return {
          success: false,
        };
      }
    },
    [settings, setRoom, setToken, spaceId, change, roomName],
  );

  return {
    join,
    isJoining,
    notFound,
    isFull,
  };
}

export function useToken() {
  return useRecoilValue(tokenAtom);
}
