import { AvailableSeat } from "@amfa-team/theme-service";
import type { BlameDictionary } from "@amfa-team/user-service";
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
import DotLoader from "../DotLoader/DotLoader";
import NetworkQualityLevel from "../NetworkQualityLevel/NetworkQualityLevel";
import { ParticipantControls } from "./Controls/ParticipantControls";
import styles from "./participantInfo.module.css";
import { SquareDiv } from "./SquareDiv/SquareDiv";

interface ParticipantInfoInnerProps {
  participant: IParticipant | null;
  children: React.ReactNode;
  loading: boolean;
}
function ParticipantInfoInner({
  participant,
  children,
  loading,
}: ParticipantInfoInnerProps) {
  const dictionary = useDictionary("participantInfo");
  const videoTrack = useParticipantVideoTrack(participant);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(videoTrack);
  const isVideoEnabled = useIsTrackEnabled(videoTrack);

  if (loading) {
    return (
      <div className={styles.contentWrapper}>
        <DotLoader />
      </div>
    );
  }

  if (participant === null) {
    return (
      <AvailableSeat
        label={dictionary.availableSeat}
        onClick={() => {
          alert("todo");
        }}
      />
    );
  }

  if (isVideoSwitchedOff || !isVideoEnabled) {
    return (
      <div className={styles.contentWrapper}>
        <div className={styles.avatar}>
          <AvatarIcon />
          {children}
        </div>
      </div>
    );
  }

  return <div className={styles.contentWrapper}>{children}</div>;
}

interface ParticipantInfoProps extends ParticipantInfoInnerProps {
  hideParticipant: boolean;
  participants: IParticipant[];
  isLocalParticipant: boolean;
  blameDictionary: BlameDictionary;
}

export default function ParticipantInfo({
  participant,
  participants,
  children,
  hideParticipant,
  isLocalParticipant,
  loading,
  blameDictionary,
}: ParticipantInfoProps) {
  const dictionary = useDictionary("participantInfo");
  const audioTrack = useParticipantAudioTrack(participant);
  const isParticipantReconnecting = useParticipantIsReconnecting(participant);

  return (
    <SquareDiv hidden={hideParticipant}>
      {!loading && participant && (
        <div className={styles.overlayContainer}>
          <ParticipantControls
            isLocalParticipant={isLocalParticipant}
            participant={participant}
            participants={participants}
            blameDictionary={blameDictionary}
          />
          <NetworkQualityLevel participant={participant} />
          <div className={styles.infoRowBottom}>
            <span className={styles.identity}>
              <AudioLevelIndicator audioTrack={audioTrack} />
            </span>
          </div>
        </div>
      )}
      <div className={styles.circleContainer}>
        {isParticipantReconnecting && (
          <div className={styles.contentOverlay}>
            <DotLoader />
            <div className={styles.typo}>{dictionary.reconnecting}</div>
          </div>
        )}
        <ParticipantInfoInner participant={participant} loading={loading}>
          {children}
        </ParticipantInfoInner>
      </div>
    </SquareDiv>
  );
}

ParticipantInfo.defaultProps = {
  hideParticipant: false,
  loading: false,
  isLocalParticipant: false,
};
