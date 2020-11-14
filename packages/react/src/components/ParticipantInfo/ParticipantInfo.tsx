import classnames from "classnames";
import { motion } from "framer-motion";
import React from "react";
// import AudioLevelIndicator from "../AudioLevelIndicator/AudioLevelIndicator";
import type { IParticipant } from "../../entities/Participant";
import useIsScreenShareTrack from "../../hooks/useIsScreenShareTrack";
import useIsTrackSwitchedOff from "../../hooks/useIsTrackSwitchedOff";
import useParticipantIsReconnecting from "../../hooks/useParticipantIsReconnecting";
import { useParticipantVideoTrack } from "../../hooks/useParticipantTracks";
import AvatarIcon from "../../icons/AvatarIcon";
import ScreenShareIcon from "../../icons/ScreenShareIcon";
import NetworkQualityLevel from "../NetworkQualityLevel/NetworkQualityLevel";
import styles from "./participantInfo.module.css";
import PinIcon from "./PinIcon/PinIcon";

interface ParticipantInfoProps {
  participant: IParticipant;
  children: React.ReactNode;
  onClick: () => void;
  isSelected: boolean;
  isLocalParticipant: boolean;
  hideParticipant: boolean;
}

export default function ParticipantInfo({
  participant,
  onClick,
  isSelected,
  children,
  isLocalParticipant,
  hideParticipant,
}: ParticipantInfoProps) {
  const videoTrack = useParticipantVideoTrack(participant);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(videoTrack);
  const isScreenShare = useIsScreenShareTrack(videoTrack);

  // const audioTrack = useTrack(audioPublication);
  const isParticipantReconnecting = useParticipantIsReconnecting(participant);

  return (
    <motion.div
      initial={{ scale: 1.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.3,
      }}
      className={classnames(styles.container, {
        [styles.hideParticipant]: hideParticipant,
        [styles.cursorPointer]: Boolean(onClick),
      })}
      onClick={onClick}
    >
      <div className={styles.infoContainer}>
        <NetworkQualityLevel participant={participant} />
        <div className={styles.infoRowBottom}>
          {isScreenShare && (
            <span className={styles.screenShareIconContainer}>
              <ScreenShareIcon />
            </span>
          )}
          <span className={styles.identity}>
            {/* <AudioLevelIndicator audioTrack={audioTrack} /> */}
            <span className={styles.typography}>
              {participant.identity}
              {isLocalParticipant && " (You)"}
            </span>
          </span>
        </div>
        <div>{isSelected && <PinIcon />}</div>
      </div>
      <div className={styles.innerContainer}>
        {isVideoSwitchedOff && (
          <div className={styles.avatarContainer}>
            <AvatarIcon />
          </div>
        )}
        {isParticipantReconnecting && (
          <div className={styles.reconnectingContainer}>
            <p className={styles.typography}>Reconnecting...</p>
          </div>
        )}
        {children}
      </div>
    </motion.div>
  );
}

ParticipantInfo.defaultProps = {
  isSelected: false,
  isLocalParticipant: false,
  hideParticipant: false,
};
