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
  cgu: string;
}

export interface MediaErrorDictionary {
  systemPermissionDenied: string;
  userPermissionDenied: string;
  notFound: string;
  unknown: string;
}

export interface NotSupportedPageDictionary {
  title: string;
  desc: string;
  force: string;
}

export interface RoomDictionary {
  notSupported: NotSupportedPageDictionary;
  waitingPage: WaitingPageDictionary;
  loading: LoadingDictionary;
  participantInfo: ParticipantInfoDictionary;
  participantList: ParticipantListDictionary;
  audioError: MediaErrorDictionary;
  videoError: MediaErrorDictionary;
}

export const defaultRoomDictionary: Record<"en" | "fr", RoomDictionary> = {
  en: {
    notSupported: {
      title: "Browser not supported",
      desc:
        "We support recent versions of Chrome, Firefox, Edge or Safari. Please open this application in one of the supported browser",
      force: "Let me try",
    },
    waitingPage: {
      roomFull: "Room is full, click on Join to go in another room",
      join: "Join",
      cgu: "By clicking on join, I accept the CGUs",
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
  },
  fr: {
    notSupported: {
      title: "Votre navigateur n'est pas compatible",
      desc:
        "Nous supportons les versions récentes de Chrome, Firefox, Edge et Safari. Pour une expérience optimale, veuillez utiliser une version supportée.",
      force: "Essayer quand même",
    },
    waitingPage: {
      roomFull:
        "Le salon est plein, cliquer sur rejoindre pour changer de salon",
      join: "Rejoindre",
      cgu: "En cliquant sur rejoindre j'accepte les cgu",
    },
    loading: {
      loading: "Chargement...",
      error: "Oups: une erreur est survenue",
      retry: "Réessayer",
    },
    participantInfo: {
      youSuffix: " (Vous)",
      reconnecting: "Reconnection...",
      availableSeat: "Siège disponible",
    },
    participantList: {
      shuffle: "Changer",
    },
    audioError: {
      systemPermissionDenied:
        "Impossible d'accéder au microphone: le système d'exploitation a bloqué l'accès du navigateur au microphone. Veuillez vérifier les paramètres de votre système d'exploitation",
      userPermissionDenied:
        "Impossible d'accéder au microphone: veuillez autoriser le navigateur à accéder au microphone.",
      notFound:
        "Impossible de trouver le microphone: le navigateur ne peut pas accéder au microphone. Veuillez vous assurer que tous les périphériques d'entrée sont connectés et activés.",
      unknown:
        "Erreur lors de l'acquisition du microphone: une erreur inconnue s'est produite",
    },
    videoError: {
      systemPermissionDenied:
        "Impossible d'accéder à la caméra: le système d'exploitation a bloqué l'accès du navigateur à la caméra. Veuillez vérifier les paramètres de votre système d'exploitation.",
      userPermissionDenied:
        "Impossible d'accéder à la caméra: veuillez autoriser le navigateur à accéder à la caméra.",
      notFound:
        "Cannot Find Camera: The browser cannot access the camera. Please make sure all input devices are connected and enabled.",
      unknown:
        "Erreur lors de l'acquisition de la caméra: une erreur inconnue s'est produite",
    },
  },
};

const dictionaryAtom = atom<RoomDictionary>({
  key: "room-service/dictionary",
  default: defaultRoomDictionary.en,
});

export function useSetDictionary(dictionary: RoomDictionary) {
  const setDictionary = useSetRecoilState(dictionaryAtom);

  useEffect(() => {
    setDictionary((d) => ({
      ...d,
      ...dictionary,
    }));
  }, [setDictionary, dictionary]);
}

export function useDictionary<K extends keyof RoomDictionary>(
  key: K,
): RoomDictionary[K] {
  return useRecoilValue(dictionaryAtom)[key];
}
