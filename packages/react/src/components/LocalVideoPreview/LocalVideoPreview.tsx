import React from "react";
import type { IVideoTrack } from "../../entities/VideoTrack";
import AvatarIcon from "../../icons/AvatarIcon";
// import LocalAudioLevelIndicator from "../../../LocalAudioLevelIndicator/LocalAudioLevelIndicator";
import VideoTrack from "../VideoTrack/VideoTrack";
import classes from "./localVideoPreview.module.css";

interface LocalVideoPreviewProps {
  videoTrack: IVideoTrack | null;
  identity: string;
}

export default function LocalVideoPreview({
  identity,
  videoTrack,
}: LocalVideoPreviewProps) {
  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        {videoTrack ? (
          <VideoTrack track={videoTrack} isLocal />
        ) : (
          <div className={classes.avatarContainer}>
            <AvatarIcon />
          </div>
        )}
      </div>

      <div className={classes.identityContainer}>
        <span className={classes.identity}>
          {/* <LocalAudioLevelIndicator /> */}
          <span>{identity}</span>
        </span>
      </div>
    </div>
  );
}
