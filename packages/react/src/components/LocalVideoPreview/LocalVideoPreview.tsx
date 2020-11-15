import React from "react";
import type { IAudioTrack, IVideoTrack } from "../../entities/Track";
import AvatarIcon from "../../icons/AvatarIcon";
import { AudioLevelIndicator } from "../AudioLevelIndicator/AudioLevelIndicator";
import VideoTrack from "../VideoTrack/VideoTrack";
import classes from "./localVideoPreview.module.css";

interface LocalVideoPreviewProps {
  videoTrack: IVideoTrack | null;
  audioTrack: IAudioTrack | null;
}

export default function LocalVideoPreview({
  videoTrack,
  audioTrack,
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

      <div className={classes.infoContainer}>
        <div className={classes.infoRowBottom}>
          <span className={classes.identity}>
            <AudioLevelIndicator audioTrack={audioTrack} />
          </span>
        </div>
      </div>
    </div>
  );
}
