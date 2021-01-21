import type { BlameDictionary } from "@amfa-team/user-service";
import classnames from "classnames";
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

interface WaitingPageProps {
  videoTrack: ILocalVideoTrack | null;
  audioTrack: ILocalAudioTrack | null;
  join: (change: boolean) => void;
  disabled: boolean;
  roomFull: boolean;
  videoError: Error | null;
  audioError: Error | null;
  isAcquiringLocalTracks: boolean;
  blameDictionary: BlameDictionary;
}

export default function WaitingPage(props: WaitingPageProps) {
  const {
    videoTrack,
    audioTrack,
    join,
    disabled,
    roomFull,
    videoError,
    audioError,
    isAcquiringLocalTracks,
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
          participants={[]}
          isLocalParticipant
          loading={localParticipant === null}
          blameDictionary={blameDictionary}
        />
      </div>
      <Controls localParticipant={localParticipant} />
      <div className={styles.joinContainer}>
        <button
          className={classnames(styles.join, {
            [styles.disabled]:
              disabled || audioTrack === null || isAcquiringLocalTracks,
          })}
          type="button"
          onClick={onJoinClicked}
          disabled={disabled || audioTrack === null || isAcquiringLocalTracks}
        >
          {dictionary.join}
        </button>
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

WaitingPage.defaultProps = {
  disabled: false,
  roomFull: false,
  videoError: null,
  audioError: null,
  isAcquiringLocalTracks: false,
};
