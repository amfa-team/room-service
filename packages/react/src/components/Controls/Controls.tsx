import classnames from "classnames";
import React, { useCallback } from "react";
import type { ILocalParticipant } from "../../entities/Participant";
import useIsTrackEnabled from "../../hooks/useIsTrackEnabled";
import {
  useParticipantAudioTrack,
  useParticipantVideoTrack,
} from "../../hooks/useParticipantTracks";
import { CamIcon } from "../ParticipantInfo/Controls/Icons/CamIcon";
import { MicIcon } from "../ParticipantInfo/Controls/Icons/MicIcon";
import classes from "./controls.module.css";

interface ControlsProps {
  localParticipant: ILocalParticipant | null;
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
    <div className={classes.container}>
      <div
        className={classnames(classes.btn, classes.mic, {
          [classes.disabled]: !hasAudioTrack,
        })}
      >
        <MicIcon toggle={onToggleAudio} enabled={isAudioEnabled} />
      </div>
      <div
        className={classnames(classes.btn, classes.cam, {
          [classes.disabled]: !hasVideoTrack,
        })}
      >
        <CamIcon toggle={onToggleVideo} enabled={isVideoEnabled} />
      </div>
    </div>
  );
}
