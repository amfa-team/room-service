import { captureException } from "@sentry/react";
import { useDictionary } from "../i18n/dictionary";
import { useHasAudioInputDevices, useHasVideoInputDevices } from "./useDevices";

export function useMediaErrorMessage(
  error: null | Error,
  type: "video" | "audio",
): null | string {
  const hasAudio = useHasAudioInputDevices();
  const hasVideo = useHasVideoInputDevices();
  const dictionary = useDictionary(
    type === "video" ? "videoError" : "audioError",
  );

  switch (true) {
    // This error is emitted when the user or the user's system has denied permission to use the media devices
    case error?.name === "NotAllowedError":
      if (error!.message === "Permission denied by system") {
        // Chrome only
        return dictionary.systemPermissionDenied;
      }

      return dictionary.userPermissionDenied;

    // This error is emitted when input devices are not connected or disabled in the OS settings
    case error?.name === "NotFoundError":
      return dictionary.notFound;

    case error !== null:
      captureException(error);
      return dictionary.unknown;

    case type === "audio" && !hasAudio:
      return dictionary.notFound;

    case type === "video" && !hasVideo:
      return dictionary.notFound;

    default:
      return null;
  }
}