import { useEffect, useState } from "react";
import type { ITrack } from "../entities/VideoTrack";

export default function useIsTrackEnabled(track: ITrack | null) {
  const [isEnabled, setIsEnabled] = useState(track ? track.isEnabled : false);

  useEffect(() => {
    setIsEnabled(track ? track.isEnabled : false);

    if (track) {
      const setEnabled = () => setIsEnabled(true);
      const setDisabled = () => setIsEnabled(false);
      track.on("enabled", setEnabled);
      track.on("disabled", setDisabled);
      return () => {
        track.off("enabled", setEnabled);
        track.off("disabled", setDisabled);
      };
    }

    return () => {
      // no-op
    };
  }, [track]);

  return isEnabled;
}
