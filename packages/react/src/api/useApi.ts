import type { IRoom } from "@amfa-team/types";
import { useEffect, useState } from "react";
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
  const [join, setJoin] = useState<
    (jwtToken: string) => Promise<string | null>
  >(async () => null);

  useEffect(() => {
    setIsJoining(false);
    const abortController = new AbortController();

    const j = async (jwtToken: string) => {
      setIsJoining(true);
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
          abortController.signal,
        );
        setRoom(data?.room ?? null);
        setToken(data?.token ?? null);
        setIsJoining(false);

        return data?.room.name ?? null;
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error("useApi/useJoin: fail", e);
          setIsJoining(false);
          throw e;
        }
        return null;
      }
    };

    setJoin(() => j);

    return () => {
      abortController.abort();
    };
  }, [settings, spaceId, setToken, setRoom, change, roomName]);

  return {
    join,
    isJoining,
  };
}

export function useToken() {
  return useRecoilValue(tokenAtom);
}