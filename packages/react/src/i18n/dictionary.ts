import { useEffect } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

export interface ControlsDictionary {
  noAudioTrack: string;
  mute: string;
  unmute: string;
  noVideoTrack: string;
  stopVideo: string;
  startVideo: string;
}

export interface LoadingDictionary {
  loading: string;
  error: string;
  retry: string;
}

export interface ParticipantInfoDictionary {
  youSuffix: string;
  reconnecting: string;
}

export interface ParticipantListDictionary {
  shuffle: string;
  availableSeat: string;
}

export interface WaitingPageDictionary {
  join: string;
  roomFull: string;
}

export interface Dictionary {
  waitingPage: WaitingPageDictionary;
  controls: ControlsDictionary;
  loading: LoadingDictionary;
  participantInfo: ParticipantInfoDictionary;
  participantList: ParticipantListDictionary;
}

const defaultDictionary: Dictionary = {
  waitingPage: {
    roomFull: "Room is full, click on Join to go in another room",
    join: "Join",
  },
  controls: {
    noAudioTrack: "No Audio",
    mute: "Mute",
    unmute: "Unmute",
    noVideoTrack: "No Video",
    stopVideo: "Stop Video",
    startVideo: "Start Video",
  },
  loading: {
    loading: "Loading...",
    error: "Oops: an error occurred",
    retry: "Retry",
  },
  participantInfo: {
    youSuffix: " (You)",
    reconnecting: "Reconnecting...",
  },
  participantList: {
    shuffle: "Shuffle",
    availableSeat: "Available seat",
  },
};

const dictionaryAtom = atom<Dictionary>({
  key: "room-service/dictionary",
  default: defaultDictionary,
});

export function useSetDictionary(dictionary: Dictionary) {
  const setDictionary = useSetRecoilState(dictionaryAtom);

  useEffect(() => {
    setDictionary((d) => ({
      ...d,
      ...dictionary,
    }));
  }, [setDictionary, dictionary]);
}

export function useDictionary<K extends keyof Dictionary>(
  key: K,
): Dictionary[K] {
  return useRecoilValue(dictionaryAtom)[key];
}
