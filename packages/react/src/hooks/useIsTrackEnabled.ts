import { useEffect, useState } from "react";
import type { ITrack } from "../entities/Track";

function isTrackSwitchedOff(track: ITrack | null | undefined): boolean {
  if (!track) {
    return true;
  }

  return "isSwitchedOff" in track ? track.isSwitchedOff : false;
}

function useIsTrackSwitchedOff(track: ITrack | null | undefined) {
  const [isSwitchedOff, setIsSwitchedOff] = useState(isTrackSwitchedOff(track));

  useEffect(() => {
    // Reset the value if the 'track' variable changes
    setIsSwitchedOff(isTrackSwitchedOff(track));

    if (track && "isSwitchedOff" in track) {
      const handleSwitchedOff = () => setIsSwitchedOff(true);
      const handleSwitchedOn = () => setIsSwitchedOff(false);
      track.on("switchedOff", handleSwitchedOff);
      track.on("switchedOn", handleSwitchedOn);
      return () => {
        track.removeListener("switchedOff", handleSwitchedOff);
        track.removeListener("switchedOn", handleSwitchedOn);
      };
    }

    return () => {
      // no-op
    };
  }, [track]);

  return !!isSwitchedOff;
}

export default function useIsTrackEnabled(track: ITrack | null) {
  const isSwitchedOff = useIsTrackSwitchedOff(track);
  const [isEnabled, setIsEnabled] = useState<boolean>(
    track ? track.isEnabled : false,
  );

  useEffect(() => {
    setIsEnabled(track ? track.isEnabled : false);

    if (track) {
      const setEnabled = () => setIsEnabled(true);
      const setDisabled = () => setIsEnabled(false);
      track.on("enabled", setEnabled);
      track.on("disabled", setDisabled);
      return () => {
        track.removeListener("enabled", setEnabled);
        track.removeListener("disabled", setDisabled);
      };
    }

    return () => {
      // no-op
    };
  }, [track]);

  return isEnabled && !isSwitchedOff;
}
