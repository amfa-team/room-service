import { RawVideoTrack } from "../VideoTrack";
import video360p from "./assets/video.mp4";
import video720p from "./assets/video_1280x720.mp4";

export enum VideoSrc {
  "360p-video" = "360p-video",
  "720p-video" = "720p-video",
  "camera" = "camera",
}

export interface GenerateVideoTrackOptions {
  name?: string;
  isSwitchedOff?: boolean;
  src?: VideoSrc;
}

async function getMediaStream(src: VideoSrc): Promise<MediaStream> {
  const video = document.createElement("video");
  switch (src) {
    case VideoSrc["360p-video"]:
      video.src = video360p;
      break;
    case VideoSrc["720p-video"]:
      video.src = video720p;
      break;
    case VideoSrc.camera: {
      // eslint-disable-next-line compat/compat
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });

      return stream;
    }
    default:
  }

  video.src = video360p;
  video.muted = true;
  video.loop = true;
  video.play();

  // @ts-ignore
  const stream = video.captureStream() as MediaStream;

  stream.getAudioTracks().forEach((t) => stream.removeTrack(t));
  return stream;
}

export async function generateVideoTrack(
  options?: GenerateVideoTrackOptions,
): Promise<RawVideoTrack> {
  const isSwitchedOff = options?.isSwitchedOff ?? false;
  const src = options?.src ?? VideoSrc["360p-video"];
  const name = options?.name ?? src;

  const stream = await getMediaStream(src);

  const track = new RawVideoTrack(name, stream);
  if (isSwitchedOff) {
    track.switchOff();
  }

  return track;
}
