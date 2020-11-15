import classnames from "classnames";
import React, { useState } from "react";
import type { IVideoTrack } from "../../entities/Track";
import { useDictionary } from "../../i18n/dictionary";
import SettingsIcon from "../../icons/SettingsIcon";
import LocalVideoPreview from "../LocalVideoPreview/LocalVideoPreview";
import styles from "./waitingPage.module.css";

interface WaitingPageProps {
  identity: string;
  videoTrack: IVideoTrack | null;
  join: () => void;
  disabled?: boolean;
  roomFull?: boolean;
}

export default function WaitingPage(props: WaitingPageProps) {
  const dictionary = useDictionary("waitingPage");
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
            [styles.disabled]: props.disabled,
          })}
          type="button"
          onClick={props.join}
          disabled={props.disabled}
        >
          {dictionary.join}
        </button>
        {props.roomFull && <span>{dictionary.roomFull}</span>}
      </div>
    </div>
  );
}

WaitingPage.defaultProps = {
  disabled: false,
  roomFull: false,
};
