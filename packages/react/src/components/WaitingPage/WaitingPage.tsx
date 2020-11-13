import classnames from "classnames";
import React from "react";
import type { IVideoTrack } from "../../entities/VideoTrack";
import LocalVideoPreview from "../LocalVideoPreview/LocalVideoPreview";
import classes from "./waitingPage.module.css";

interface WaitingPageProps {
  identity: string;
  videoTrack: IVideoTrack | null;
  join: () => void;
  disabled?: boolean;
  roomFull?: boolean;
}

export default function WaitingPage(props: WaitingPageProps) {
  return (
    <div className={classes.root}>
      <div className={classes.localPreviewContainer}>
        <LocalVideoPreview
          videoTrack={props.videoTrack}
          identity={props.identity}
        />
      </div>
      {props.roomFull && <div>room is full</div>}
      <div className={classes.joinContainer}>
        <button
          className={classnames(classes.join, {
            [classes.disabled]: props.disabled,
          })}
          type="button"
          onClick={props.join}
          disabled={props.disabled}
        >
          Join
        </button>
      </div>
    </div>
  );
}

WaitingPage.defaultProps = {
  disabled: false,
  roomFull: false,
};
