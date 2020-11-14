import React, { useCallback } from "react";
import type { ILocalParticipant } from "../../entities/Participant";
import useIsTrackEnabled from "../../hooks/useIsTrackEnabled";
import {
  useParticipantAudioTrack,
  useParticipantVideoTrack,
} from "../../hooks/useParticipantTracks";
import classes from "./controls.module.css";

interface ControlsProps {
  localParticipant: ILocalParticipant | null;
}

function getAudioLabel(hasAudioTrack: boolean, isAudioEnabled: boolean) {
  if (!hasAudioTrack) {
    return "No Audio";
  }

  return isAudioEnabled ? "Mute" : "Unmute";
}

function getVideoLabel(hasVideoTrack: boolean, isVideoEnabled: boolean) {
  if (!hasVideoTrack) {
    return "No Video";
  }

  return isVideoEnabled ? "Stop Video" : "Start Video";
}

export default function Controls(props: ControlsProps) {
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
        {getAudioLabel(hasAudioTrack, isAudioEnabled)}
      </button>
      <button type="button" disabled={!hasVideoTrack} onClick={onToggleVideo}>
        {getVideoLabel(hasVideoTrack, isVideoEnabled)}
      </button>
    </footer>
  );
}
