import classnames from "classnames";
import React, { useEffect, useState } from "react";
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
import styles from "./waitingPage.module.css";

interface WaitingPageProps {
  videoTrack: ILocalVideoTrack | null;
  audioTrack: ILocalAudioTrack | null;
  join: () => void;
  disabled: boolean;
  roomFull: boolean;
  videoError: Error | null;
  audioError: Error | null;
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
  } = props;
  const dictionary = useDictionary("waitingPage");
  const videoErrorMessage = useMediaErrorMessage(videoError, "video");
  const audioErrorMessage = useMediaErrorMessage(audioError, "audio");

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

  return (
    <div className={styles.container}>
      <div className={styles.video}>
        <Participant
          participant={localParticipant}
          participants={[]}
          isLocalParticipant
          loading={localParticipant === null}
        />
      </div>
      {roomFull && <p>{dictionary.roomFull}</p>}
      {videoErrorMessage && <p>{videoErrorMessage}</p>}
      {audioErrorMessage && <p>{audioErrorMessage}</p>}
      <Controls localParticipant={localParticipant} />
      <div className={styles.joinContainer}>
        <button
          className={classnames(styles.join, {
            [styles.disabled]: disabled || audioTrack === null,
          })}
          type="button"
          onClick={join}
          disabled={disabled || audioTrack === null}
        >
          {dictionary.join}
        </button>
      </div>
    </div>
  );
}

WaitingPage.defaultProps = {
  disabled: false,
  roomFull: false,
  videoError: null,
  audioError: null,
};
