import {
  RawLocalAudioTrack,
  RawLocalVideoTrack,
  RawRemoteAudioTrack,
  RawRemoteVideoTrack,
} from "../Track";
import video360p from "./assets/video.mp4";
import video720p from "./assets/video_1280x720.mp4";

export enum VideoSrc {
  "360p-video" = "360p-video",
  "720p-video" = "720p-video",
  "camera" = "camera",
}

export interface GenerateTrackOptions {
  name?: string;
  isSwitchedOff?: boolean;
  src?: VideoSrc;
}

async function getVideoMediaStream(src: VideoSrc): Promise<MediaStream> {
  const video = document.createElement("video");
  switch (src) {
    case VideoSrc["360p-video"]:
      video.src = video360p;
      break;
    case VideoSrc["720p-video"]:
      video.src = video720p;
      break;
    case VideoSrc.camera: {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });

      return stream;
    }
    default:
  }

  video.muted = true;
  video.loop = true;
  video.play();

  // @ts-ignore
  const stream = video.captureStream() as MediaStream;

  stream.getAudioTracks().forEach((t) => stream.removeTrack(t));
  return stream;
}

async function getAudioMediaStream(): Promise<MediaStream> {
  const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });

  return stream;
}

export async function generateLocalVideoTrack(
  options?: GenerateTrackOptions,
): Promise<RawLocalVideoTrack> {
  const src = options?.src ?? VideoSrc["360p-video"];
  const name = options?.name ?? src;

  const stream = await getVideoMediaStream(src);

  const track = new RawLocalVideoTrack(name, stream);

  return track;
}

export async function generateRemoteVideoTrack(
  options?: GenerateTrackOptions,
): Promise<RawRemoteVideoTrack> {
  const isSwitchedOff = options?.isSwitchedOff ?? false;
  const src = options?.src ?? VideoSrc["360p-video"];
  const name = options?.name ?? src;

  const stream = await getVideoMediaStream(src);

  const track = new RawRemoteVideoTrack(name, stream);
  if (isSwitchedOff) {
    track.switchOff();
  }

  return track;
}

export async function generateLocalAudioTrack(
  options?: GenerateTrackOptions,
): Promise<RawLocalAudioTrack> {
  const src = options?.src ?? VideoSrc["360p-video"];
  const name = options?.name ?? src;

  const stream = await getVideoMediaStream(src);

  const track = new RawLocalAudioTrack(name, stream);

  return track;
}

export async function generateRemoteAudioTrack(
  options?: GenerateTrackOptions,
): Promise<RawRemoteAudioTrack> {
  const isSwitchedOff = options?.isSwitchedOff ?? false;
  const name = options?.name ?? "mic";

  const stream = await getAudioMediaStream();

  const track = new RawRemoteAudioTrack(name, stream);
  if (isSwitchedOff) {
    track.switchOff();
  }

  return track;
}
