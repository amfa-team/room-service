import type { ISpace } from "@amfa-team/room-service";
import { TwilioApp } from "@amfa-team/room-service";
import { UserModalPage } from "@amfa-team/user-service";
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
  userDictionary: {
    blame: {
      title: "Report",
      desc:
        "You want to report an abusive behavior of this user ? Please describe why :",
      reasons: {
        verbalAbuse: "Insults",
        negativeAttitude: "Toxic behavior (troll, provocations, ...)",
        violent:
          "The user is threatening someone or promoting violence and/or terrorism.",
        hate:
          "Hate speech and discrimination (homophobia, racism, antisemitism, ...)",
        porn:
          "Innapropriate sexual or pornographic behavior (nudity, sharing porn content,...)",
      },
      notice:
        "By clicking, i acknowledge that this report can be used by Side By Side team to take potential actions (bans). We would like to remind you that diffamation is a an offense and abusive report can also be subject to sanctions.",
      submit: "Report",
    },
    ban: {
      title: "You’ve been reported too many times.",
      desc:
        "Your behavior caused too many reports from other users, which made you temporary banned from the service.\nTo know more or ask a deban, please contact us.",
      mailto: "Contact us",
      mail: {
        subject: "Contest ban",
        id: "Reference",
        body:
          "Hello,\nI contact you about the temporary ban on your platform...",
      },
    },
    register: {
      title: "Sign up",
      email: {
        label: "Email",
        error: "Error: This email is not valid",
      },
      dob: {
        label: "Birthdate",
        error: "Error: Birthdate is not valid",
      },
      commercial:
        "I agree to be contacted by email for special offers and advertising purposes.",
      submit: "Create account",
      notice: "By joining you accept the terms and policy of SideBySide.live",
      success: {
        title: "Thanks !",
        desc: "You’re now registered on Side By Side.",
      },
      error: {
        title: "Oops !",
        desc:
          "An unexpected error occured, please try again or contact support.",
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
  userDictionary: {
    blame: {
      title: "Signalement",
      desc:
        "Vous souhaitez signaler le comportement de cette personne ? Veuillez choisir une ou plusieurs des raisons suivantes:",
      reasons: {
        verbalAbuse: "La personne profère des insultes gratuites",
        negativeAttitude:
          "La personne a un comportement agaçant (troll, provocations, moqueries, ...)",
        violent:
          "La personne tient des propos violents ou faisant l'apologie de la violence et/ou du terrorisme",
        hate:
          "La personne tient des propos haineux ou discriminatoires (homophobie, racisme, antisémitisme, ...)",
        porn:
          "La personne a un comporement de nature sexuel ou pronographique (nudité, partage de contenu pornographique...)",
      },
      notice:
        "En cliquant, j'accepte que ce signalement soit utilisé par les équipes de Side By Side pour permettre d'éventuelles sanctions. Nous vous rappelons en revanche que la diffamation est un délit et que tout signalement abusif pourra faire également l'objet de sanctions.",
      submit: "Je signale",
    },
    ban: {
      title: "Vous avez été signalé à plusieurs reprises.",
      desc:
        "Votre comportement a fait l’objet de plusieurs signalements de la part d’autres utilisateurs, provoquant votre exclusion temporaire des services.\nPour en savoir plus, ou demander faire une réclamation  vous pouvez nous contacter.",
      mailto: "Contacter",
      mail: {
        subject: "Contestation exclusion",
        id: "Référence",
        body: "Bonjour,\nje vous contacte suite à mon exclusion du service...",
      },
    },
    register: {
      title: "Inscription",
      email: {
        label: "Adresse email",
        error: "Erreur: Adresse email invalide",
      },
      dob: {
        label: "Date de naissance",
        error: "Erreur: Date de naissance invalide",
      },
      commercial:
        "J'accepte d'être contacté par email, notamment pour la promotion personnalisée d'espaces sur le site",
      submit: "Je m'inscris",
      notice:
        "En confirmant, j'accepte les CGU, la politique de confidentialité et la Charte de Bonne Conduite",
      success: {
        title: "Merci !",
        desc: "Vous êtes maintenant inscrit sur Side By Side.",
      },
      error: {
        title: "Oups !",
        desc:
          "Une erreur est survenue, veuillez réessayer ou contacter le support.",
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
    <>
      <UserModalPage
        dictionary={
          lang === "fr"
            ? frDictionary.userDictionary
            : enDictionary.userDictionary
        }
      />
      <TwilioApp
        space={props.space}
        settings={{ endpoint: props.endpoint }}
        onRoomChanged={onRoomChanged}
        roomName={roomName ?? null}
        dictionary={lang === "fr" ? frDictionary : enDictionary}
      />
    </>
  );
}
