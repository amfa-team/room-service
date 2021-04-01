import { RoomControls } from "@amfa-team/theme-service";
import debounce from "lodash.debounce";
import React, { useMemo } from "react";
import type { ReactElement } from "react";
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
  helpButton?: ReactElement;
}

export default function Controls(props: ControlsProps) {
  const { localParticipant, onShuffle, onHangUp } = props;
  const dictionary = useDictionary("participantList");
  const videoTrack = useParticipantVideoTrack(localParticipant);
  const audioTrack = useParticipantAudioTrack(localParticipant);

  const isAudioEnabled = useIsTrackEnabled(audioTrack);
  const hasAudioDevice = audioTrack !== null;
  const onToggleAudio = useMemo(
    () =>
      debounce(() => {
        audioTrack?.enable(!audioTrack.isEnabled);
      }, 300),
    [audioTrack],
  );

  const isVideoEnabled = useIsTrackEnabled(videoTrack);
  const hasVideoDevice = videoTrack !== null;
  const onToggleVideo = useMemo(
    () =>
      debounce(() => {
        videoTrack?.enable(!videoTrack.isEnabled);
      }, 300),
    [videoTrack],
  );

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
      helpButton={props.helpButton}
    />
  );
}

Controls.defaultProps = {
  helpButton: null,
};
