import type { ISpace } from "@amfa-team/room-service";
import { TwilioApp } from "@amfa-team/room-service";
import React, { useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";

interface RoomProps {
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
  userDictionary: {
    blameAction: "Report",
    banDispute: {
      title: "You cannot access the platform",
      desc: "You have been ban after users reported abuse",
      mailto: "Dispute the ban",
      mail: {
        subject: "Dispute Ban",
        id: "Reference",
        body: "I want to contest this man, it is not fair",
      },
    },
    blame: {
      submit: "Report",
      cancel: "Cancel",
      notice: "Any invalid report might be terrible!",
      reasons: {
        negativeAttitude: {
          name: "Negative Attitude: Griefing/Giving Up ",
          desc:
            "This category is reserved for unhelpful or self-centered attitudes that go against the principles of a team-based game",
        },
        verbalAbuse: {
          name: "Verbal Abuse: Harassment, Offensive Language",
          desc:
            "This category aims at punishing language that is directly targeted at another player in order to hurt, insult, or intimidate them.",
        },
        afk: {
          name: "Leaving the Game/AFK",
          desc:
            "This category aims at punishing behavior that includes logging out before a match ends as well as standing idle for long periods of time and refusing to participate.",
        },
        cheating: {
          name: "Cheating: Unapproved Third Party Program",
          desc:
            "This category aims at punishing behavior that uses unapproved third party programs to gain a competitive advantage in the game.mv",
        },
      },
    },
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
  userDictionary: {
    blameAction: "Signaler",
    banDispute: {
      title: "Vous ne pouvez pas acceder",
      desc: "Un utilisateur vous a signalé",
      mailto: "Contestation",
      mail: {
        subject: "Contester",
        id: "Reference",
        body: "Je veux contester parce que c'est injust wesh!",
      },
    },
    blame: {
      submit: "Signaler",
      cancel: "Annuler",
      notice: "Tout signalement invalid sera terrible",
      reasons: {
        negativeAttitude: {
          name: "Attitue Negative",
          desc: "Bla bla bla",
        },
        verbalAbuse: {
          name: "Verbal Abuse: Harassment, Offensive Language",
          desc: "Bla bla bla",
        },
        afk: {
          name: "AFK",
          desc: "Bla bla bla",
        },
        cheating: {
          name: "Triche",
          desc: "Bla bla bla",
        },
      },
    },
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
      space={props.space}
      settings={{ endpoint: props.endpoint }}
      onRoomChanged={onRoomChanged}
      roomName={roomName ?? null}
      dictionary={lang === "fr" ? frDictionary : enDictionary}
    />
  );
}
