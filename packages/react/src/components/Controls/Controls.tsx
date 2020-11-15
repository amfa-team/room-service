import React, { useCallback } from "react";
import type { ILocalParticipant } from "../../entities/Participant";
import useIsTrackEnabled from "../../hooks/useIsTrackEnabled";
import {
  useParticipantAudioTrack,
  useParticipantVideoTrack,
} from "../../hooks/useParticipantTracks";
import type { ControlsDictionary } from "../../i18n/dictionary";
import { useDictionary } from "../../i18n/dictionary";
import classes from "./controls.module.css";

interface ControlsProps {
  localParticipant: ILocalParticipant | null;
}

function getAudioLabel(
  hasAudioTrack: boolean,
  isAudioEnabled: boolean,
  dictionary: ControlsDictionary,
) {
  if (!hasAudioTrack) {
    return dictionary.noAudioTrack;
  }

  return isAudioEnabled ? dictionary.mute : dictionary.unmute;
}

function getVideoLabel(
  hasVideoTrack: boolean,
  isVideoEnabled: boolean,
  dictionary: ControlsDictionary,
) {
  if (!hasVideoTrack) {
    return dictionary.noVideoTrack;
  }

  return isVideoEnabled ? dictionary.stopVideo : dictionary.startVideo;
}

export default function Controls(props: ControlsProps) {
  const dictionary = useDictionary("controls");
  const { localParticipant } = props;
  const videoTrack = useParticipantVideoTrack(localParticipant);
  const audioTrack = useParticipantAudioTrack(localParticipant);

  const isAudioEnabled = useIsTrackEnabled(audioTrack);
  const hasAudioTrack = audioTrack !== null;
  const onToggleAudio = useCallback(() => {
    audioTrack?.enable(!audioTrack.isEnabled);
  }, [audioTrack]);

  const isVideoEnabled = useIsTrackEnabled(videoTrack);
  const hasVideoTrack = videoTrack !== null;
  const onToggleVideo = useCallback(() => {
    videoTrack?.enable(!videoTrack.isEnabled);
  }, [videoTrack]);

  return (
    <footer className={classes.container}>
      <button type="button" disabled={!hasAudioTrack} onClick={onToggleAudio}>
        {getAudioLabel(hasAudioTrack, isAudioEnabled, dictionary)}
      </button>
      <button type="button" disabled={!hasVideoTrack} onClick={onToggleVideo}>
        {getVideoLabel(hasVideoTrack, isVideoEnabled, dictionary)}
      </button>
    </footer>
  );
}
