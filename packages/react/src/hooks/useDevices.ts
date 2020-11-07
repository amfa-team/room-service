import { useEffect, useState } from "react";

export function useDevices() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const updateDevices = () => {
      navigator.mediaDevices.enumerateDevices().then((d) => setDevices(d));
    };
    navigator.mediaDevices.addEventListener("devicechange", updateDevices);
    updateDevices();

    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", updateDevices);
    };
  }, []);

  return devices;
}

export function useAudioInputDevices() {
  const devices = useDevices();
  return devices.filter((device) => device.kind === "audioinput");
}

export function useVideoInputDevices() {
  const devices = useDevices();
  return devices.filter((device) => device.kind === "videoinput");
}

export function useAudioOutputDevices() {
  const devices = useDevices();
  return devices.filter((device) => device.kind === "audiooutput");
}

export function useHasAudioInputDevices() {
  const audioDevices = useAudioInputDevices();
  return audioDevices.length > 0;
}

export function useHasVideoInputDevices() {
  const videoDevices = useVideoInputDevices();
  return videoDevices.length > 0;
}
