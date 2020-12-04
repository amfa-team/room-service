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
  availableSeat: string;
}

export interface ParticipantListDictionary {
  shuffle: string;
}

export interface WaitingPageDictionary {
  join: string;
  roomFull: string;
}

export interface MediaErrorDictionary {
  systemPermissionDenied: string;
  userPermissionDenied: string;
  notFound: string;
  unknown: string;
}

export interface Dictionary {
  waitingPage: WaitingPageDictionary;
  loading: LoadingDictionary;
  participantInfo: ParticipantInfoDictionary;
  participantList: ParticipantListDictionary;
  audioError: MediaErrorDictionary;
  videoError: MediaErrorDictionary;
}

const defaultDictionary: Dictionary = {
  waitingPage: {
    roomFull: "Room is full, click on Join to go in another room",
    join: "Join",
  },
  loading: {
    loading: "Loading...",
    error: "Oops: an error occurred",
    retry: "Retry",
  },
  participantInfo: {
    youSuffix: " (You)",
    availableSeat: "Available seat",
    reconnecting: "Reconnecting...",
  },
  participantList: {
    shuffle: "Shuffle",
  },
  audioError: {
    systemPermissionDenied:
      "Unable to Access Microphone: The operating system has blocked the browser from accessing the microphone. Please check your operating system settings.",
    userPermissionDenied:
      "Unable to Access Microphone: Please grant permission to the browser to access the microphone.",
    notFound:
      "Cannot Find Microphone: The browser cannot access the microphone. Please make sure all input devices are connected and enabled.",
    unknown: "Error Acquiring Microphone: An unknown error occurred",
  },
  videoError: {
    systemPermissionDenied:
      "Unable to Access Camera: The operating system has blocked the browser from accessing the camera. Please check your operating system settings.",
    userPermissionDenied:
      "Unable to Access Camera: Please grant permission to the browser to access the camera.",
    notFound:
      "Cannot Find Camera: The browser cannot access the camera. Please make sure all input devices are connected and enabled.",
    unknown: "Error Acquiring Camera: An unknown error occurred",
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
