import React from "react";
import type { IParticipant } from "../../entities/Participant";
import {
  useParticipantAudioTrack,
  useParticipantVideoTrack,
} from "../../hooks/useParticipantTracks";
import AudioTrack from "../AudioTrack/AudioTrack";
import VideoTrack from "../VideoTrack/VideoTrack";

interface ParticipantTracksProps {
  participant: IParticipant;
  isLocalParticipant: boolean;
}

export default function ParticipantTracks({
  participant,
  isLocalParticipant,
}: ParticipantTracksProps) {
  const video = useParticipantVideoTrack(participant);
  const audio = useParticipantAudioTrack(participant);

  return (
    <>
      {video ? <VideoTrack track={video} isLocal={isLocalParticipant} /> : null}
      {audio ? <AudioTrack track={audio} /> : null}
    </>
  );
}

ParticipantTracks.defaultProps = {
  isLocalParticipant: false,
};
