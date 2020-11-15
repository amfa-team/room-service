import classnames from "classnames";
import React, { useState } from "react";
import type { IAudioTrack, IVideoTrack } from "../../entities/Track";
import { useMediaErrorMessage } from "../../hooks/useMediaErrorMessage";
import { useDictionary } from "../../i18n/dictionary";
import SettingsIcon from "../../icons/SettingsIcon";
import LocalVideoPreview from "../LocalVideoPreview/LocalVideoPreview";
import styles from "./waitingPage.module.css";

interface WaitingPageProps {
  identity: string;
  videoTrack: IVideoTrack | null;
  audioTrack: IAudioTrack | null;
  join: () => void;
  disabled: boolean;
  roomFull: boolean;
  videoError: Error | null;
  audioError: Error | null;
}

export default function WaitingPage(props: WaitingPageProps) {
  const dictionary = useDictionary("waitingPage");
  const videoErrorMessage = useMediaErrorMessage(props.videoError, "video");
  const audioErrorMessage = useMediaErrorMessage(props.audioError, "audio");
  const [driversSetting, setDriversSetting] = useState(false);

  const toggleDriversSetting = () => setDriversSetting(!driversSetting);
  return (
    <div className={styles.container}>
      <div className={styles.settingContainer}>
        <div className={styles.settingBubble}>
          <span
            className={`${styles.closeIcon}`}
            style={{ marginRight: "12px" }}
            onClick={() => toggleDriversSetting()}
          >
            <SettingsIcon />
          </span>

          {driversSetting && (
            <div className={styles.settingDriversBubble}>
              Setting drivers here
            </div>
          )}
          {!driversSetting && (
            <div className={styles.settingVideoBubble}>
              <LocalVideoPreview
                videoTrack={props.videoTrack}
                identity={props.identity}
              />
            </div>
          )}
          <span
            className={`icon close-icon ${styles.closeIcon}`}
            style={{ marginLeft: "12px" }}
          >
            &nbsp;
          </span>
        </div>
        <span
          className={`icon close-icon ${styles.closeIcon} ${styles.camIcon}`}
        >
          &nbsp;
        </span>
      </div>
      <div className={styles.joinContainer}>
        <button
          className={classnames(styles.join, {
            [styles.disabled]: props.disabled || props.audioTrack === null,
          })}
          type="button"
          onClick={props.join}
          disabled={props.disabled || props.audioTrack === null}
        >
          {dictionary.join}
        </button>
        {props.roomFull && <p>{dictionary.roomFull}</p>}
        {videoErrorMessage && <p>{videoErrorMessage}</p>}
        {audioErrorMessage && <p>{audioErrorMessage}</p>}
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
