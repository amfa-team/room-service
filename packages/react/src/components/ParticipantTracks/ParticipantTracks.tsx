import React from "react";
import type { IParticipant } from "../../entities/Participant";
import { useParticipantVideoTrack } from "../../hooks/useParticipantTracks";
import VideoTrack from "../VideoTrack/VideoTrack";

interface ParticipantTracksProps {
  participant: IParticipant;
}

export default function ParticipantTracks({
  participant,
}: ParticipantTracksProps) {
  const video = useParticipantVideoTrack(participant);

  return video ? <VideoTrack track={video} /> : null;
}
