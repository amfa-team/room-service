import classnames from "classnames";
import { motion } from "framer-motion";
import React from "react";
import type { IParticipant } from "../../entities/Participant";
import useIsTrackEnabled from "../../hooks/useIsTrackEnabled";
import useIsTrackSwitchedOff from "../../hooks/useIsTrackSwitchedOff";
import useParticipantIsReconnecting from "../../hooks/useParticipantIsReconnecting";
import {
  useParticipantAudioTrack,
  useParticipantVideoTrack,
} from "../../hooks/useParticipantTracks";
import { useDictionary } from "../../i18n/dictionary";
import AvatarIcon from "../../icons/AvatarIcon";
import { AudioLevelIndicator } from "../AudioLevelIndicator/AudioLevelIndicator";
import NetworkQualityLevel from "../NetworkQualityLevel/NetworkQualityLevel";
import styles from "./participantInfo.module.css";

interface ParticipantInfoProps {
  participant: IParticipant;
  children: React.ReactNode;
  hideParticipant: boolean;
}

export default function ParticipantInfo({
  participant,
  children,
  hideParticipant,
}: ParticipantInfoProps) {
  const dictionary = useDictionary("participantInfo");
  const videoTrack = useParticipantVideoTrack(participant);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(videoTrack);
  const isVideoEnabled = useIsTrackEnabled(videoTrack);

  const audioTrack = useParticipantAudioTrack(participant);
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
      })}
    >
      <div className={styles.infoContainer}>
        <NetworkQualityLevel participant={participant} />
        <div className={styles.infoRowBottom}>
          <span className={styles.identity}>
            <AudioLevelIndicator audioTrack={audioTrack} />
          </span>
        </div>
      </div>
      <div className={styles.innerContainer}>
        {(isVideoSwitchedOff || !isVideoEnabled) && (
          <div className={styles.avatarContainer}>
            <AvatarIcon />
          </div>
        )}
        {isParticipantReconnecting && (
          <div className={styles.reconnectingContainer}>
            <p className={styles.typography}>{dictionary.reconnecting}</p>
          </div>
        )}
        {children}
      </div>
    </motion.div>
  );
}

ParticipantInfo.defaultProps = {
  hideParticipant: false,
};
