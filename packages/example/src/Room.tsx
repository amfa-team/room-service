import type { ISpace, IUser } from "@amfa-team/room-service";
import { TwilioApp } from "@amfa-team/room-service";
import React, { useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";

interface RoomProps {
  user: IUser;
  space: ISpace;
  endpoint: string;
}

const enDictionary = {
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

const frDictionary = {
  waitingPage: {
    roomFull: "Le salon est plein, cliquer sur rejoindre pour changer de salon",
    join: "Rejoindre",
  },
  controls: {
    noAudioTrack: "Pas d'audio",
    mute: "Couper le son",
    unmute: "Activer le son",
    noVideoTrack: "Pas de video",
    stopVideo: "Couper la video",
    startVideo: "Activer la video",
  },
  loading: {
    loading: "Chargement...",
    error: "Oups: une erreur est survenue",
    retry: "Réessayer",
  },
  participantInfo: {
    youSuffix: " (Vous)",
    reconnecting: "Reconnection...",
  },
  participantList: {
    shuffle: "Changer",
    availableSeat: "Siège disponible",
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
};

export default function Room(props: RoomProps) {
  const { lang, roomName } = useParams<{
    roomName?: string;
    lang: "en" | "fr";
  }>();
  const history = useHistory();
  const onRoomChanged = useCallback(
    (name: string) => {
      history.push(`/${lang}/${name}`);
    },
    [history, lang],
  );

  return (
    <TwilioApp
      user={props.user}
      space={props.space}
      settings={{ endpoint: props.endpoint }}
      onRoomChanged={onRoomChanged}
      roomName={roomName ?? null}
      dictionary={lang === "fr" ? frDictionary : enDictionary}
    />
  );
}
