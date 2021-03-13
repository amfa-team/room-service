import { RoomControls } from "@amfa-team/theme-service";
import React, { useCallback } from "react";
import type { ILocalParticipant } from "../../entities/Participant";
import useIsTrackEnabled from "../../hooks/useIsTrackEnabled";
import {
  useParticipantAudioTrack,
  useParticipantVideoTrack,
} from "../../hooks/useParticipantTracks";
import { useDictionary } from "../../i18n/dictionary";

interface ControlsProps {
  localParticipant: ILocalParticipant | null;
  onShuffle: () => void;
  onHangUp: () => void;
}

export default function Controls(props: ControlsProps) {
  const { localParticipant, onShuffle, onHangUp } = props;
  const dictionary = useDictionary("participantList");
  const videoTrack = useParticipantVideoTrack(localParticipant);
  const audioTrack = useParticipantAudioTrack(localParticipant);

  const isAudioEnabled = useIsTrackEnabled(audioTrack);
  const hasAudioDevice = audioTrack !== null;
  const onToggleAudio = useCallback(() => {
    audioTrack?.enable(!audioTrack.isEnabled);
  }, [audioTrack]);

  const isVideoEnabled = useIsTrackEnabled(videoTrack);
  const hasVideoDevice = videoTrack !== null;
  const onToggleVideo = useCallback(() => {
    videoTrack?.enable(!videoTrack.isEnabled);
  }, [videoTrack]);

  return (
    <RoomControls
      shuffleLabel={dictionary.shuffle}
      hasVideoDevice={hasVideoDevice}
      isVideoEnabled={isVideoEnabled}
      hasAudioDevice={hasAudioDevice}
      isAudioEnabled={isAudioEnabled}
      onShuffle={onShuffle}
      onHangUp={onHangUp}
      onToggleAudio={onToggleAudio}
      onToggleVideo={onToggleVideo}
    />
  );
}
