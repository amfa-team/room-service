import { useEffect, useState } from "react";
import type { ITrack } from "../entities/Track";

export default function useIsTrackEnabled(track: ITrack | null) {
  const [isEnabled, setIsEnabled] = useState<boolean>(
    track ? track.isEnabled : false,
  );

  useEffect(() => {
    setIsEnabled(track ? track.isEnabled : false);

    if (track) {
      const setEnabled = () => setIsEnabled(true);
      const setDisabled = () => setIsEnabled(false);
      console.log(track.on("enabled", setEnabled));
      track.on("disabled", setDisabled);
      return () => {
        // TODO
        // console.log(track);
        // track.off("enabled", setEnabled);
        // track.off("disabled", setDisabled);
      };
    }

    return () => {
      // no-op
    };
  }, [track]);

  return isEnabled;
}
