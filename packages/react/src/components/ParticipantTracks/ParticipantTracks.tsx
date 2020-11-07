import React from "react";
import type { IParticipant } from "../../entities/Participant";
import { useParticipantVideoTrack } from "../../hooks/useParticipantTracks";
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

  return video ? (
    <VideoTrack track={video} isLocal={isLocalParticipant} />
  ) : null;
}

ParticipantTracks.defaultProps = {
  isLocalParticipant: false,
};
