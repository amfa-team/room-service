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
