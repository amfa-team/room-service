import { useEffect, useState } from "react";
import type { ITrack } from "../entities/Track";

function isTrackSwitchedOff(track: ITrack | null | undefined): boolean {
  if (!track) {
    return true;
  }

  return "isSwitchedOff" in track ? track.isSwitchedOff : false;
}

export default function useIsTrackSwitchedOff(
  track: ITrack | null | undefined,
) {
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
        // TODO
        // track.off("switchedOff", handleSwitchedOff);
        // track.off("switchedOn", handleSwitchedOn);
      };
    }

    return () => {
      // no-op
    };
  }, [track]);

  return !!isSwitchedOff;
}
