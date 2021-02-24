import { Button } from "@amfa-team/theme-service";
import type { BlameDictionary } from "@amfa-team/user-service";
import React, { useCallback, useEffect, useState } from "react";
import {
  RawLocalParticipant,
  RawVAudioTrackPublication,
  RawVideoTrackPublication,
} from "../../entities";
import type { ILocalAudioTrack, ILocalVideoTrack } from "../../entities/Track";
import { useMediaErrorMessage } from "../../hooks/useMediaErrorMessage";
import { useDictionary } from "../../i18n/dictionary";
import Controls from "../Controls/Controls";
import Participant from "../Participant/Participant";
import { SnackbarContainer } from "../Snackbar/ScnackbarContainer";
import { Snackbar } from "../Snackbar/Snackbar";
import styles from "./waitingPage.module.css";

export interface WaitingPageProps {
  videoTrack: ILocalVideoTrack | null;
  audioTrack: ILocalAudioTrack | null;
  join: (change: boolean) => void;
  disabled?: boolean;
  roomFull?: boolean;
  isJoining?: boolean;
  videoError?: Error | null;
  audioError?: Error | null;
  isAcquiringLocalTracks?: boolean;
  blameDictionary: BlameDictionary;
}

function WaitingPage(props: WaitingPageProps) {
  const {
    videoTrack,
    audioTrack,
    join,
    disabled = false,
    roomFull = false,
    isJoining = false,
    videoError = null,
    audioError = null,
    isAcquiringLocalTracks = false,
    blameDictionary,
  } = props;
  const dictionary = useDictionary("waitingPage");
  const videoErrorMessage = useMediaErrorMessage(
    videoError,
    "video",
    videoTrack,
  );
  const audioErrorMessage = useMediaErrorMessage(
    audioError,
    "audio",
    audioTrack,
  );

  const [
    localParticipant,
    setLocalParticipant,
  ] = useState<RawLocalParticipant | null>(null);

  useEffect(() => {
    setLocalParticipant(new RawLocalParticipant("fake"));
  }, []);

  useEffect(() => {
    if (videoTrack) {
      const publication = new RawVideoTrackPublication("camera", videoTrack);
      localParticipant?.addVideoTrack(publication);

      return () => {
        localParticipant?.removeVideoTrack(publication);
      };
    }

    return () => {
      // no-op
    };
  }, [localParticipant, videoTrack]);

  useEffect(() => {
    if (audioTrack) {
      const publication = new RawVAudioTrackPublication("mic", audioTrack);
      localParticipant?.addAudioTrack(publication);

      return () => {
        localParticipant?.removeAudioTrack(publication);
      };
    }

    return () => {
      // no-op
    };
  }, [localParticipant, audioTrack]);

  const onJoinClicked = useCallback(() => {
    join(roomFull);
  }, [join, roomFull]);

  return (
    <div className={styles.container}>
      <div className={styles.video}>
        <Participant
          participant={localParticipant}
          isLocalParticipant
          loading={localParticipant === null}
          blameDictionary={blameDictionary}
        />
      </div>
      <div className={styles.controls}>
        <Controls localParticipant={localParticipant} />
        <div className={styles.notice}>{dictionary.cgu}</div>
        <div className={styles.joinContainer}>
          <Button
            type="button"
            className={styles.join}
            onClick={onJoinClicked}
            disabled={disabled || audioTrack === null || isAcquiringLocalTracks}
            loading={isJoining}
          >
            {dictionary.join}
          </Button>
        </div>
      </div>
      <SnackbarContainer>
        {roomFull && (
          <Snackbar>
            <p>{dictionary.roomFull}</p>
          </Snackbar>
        )}
        {videoErrorMessage && !isAcquiringLocalTracks && (
          <Snackbar>
            <p>{videoErrorMessage}</p>
          </Snackbar>
        )}
        {audioErrorMessage && !isAcquiringLocalTracks && (
          <Snackbar>
            <p>{audioErrorMessage}</p>
          </Snackbar>
        )}
      </SnackbarContainer>
    </div>
  );
}

export default React.memo<WaitingPageProps>(WaitingPage);
