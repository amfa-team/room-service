import React, { useEffect, useRef } from "react";
import type { IAudioTrack } from "../../entities/Track";

export interface AudioTrackProps {
  track: IAudioTrack;
}

function AudioTrack({ track }: AudioTrackProps) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      track.attach(el);
    }
    return () => {
      if (el) {
        track.detach(el);
      }
    };
  }, [track]);

  // eslint-disable-next-line jsx-a11y/media-has-caption
  return <audio ref={ref} autoPlay />;
}

export default React.memo<AudioTrackProps>(AudioTrack);
