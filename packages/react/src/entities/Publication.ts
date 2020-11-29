/* eslint-disable max-classes-per-file */

import type {
  IAudioTrack,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
  ITrack,
  IVideoTrack,
} from "./Track";

export type SubscribedListener<T extends ITrack> = (track: T) => void;

export interface IBaseVideoTrackPublication<T extends IVideoTrack> {
  readonly kind: "video";

  readonly trackName: string;

  readonly track: T;

  on(
    event: "subscribed" | "unsubscribed",
    listener: SubscribedListener<T>,
  ): void;

  off(
    event: "subscribed" | "unsubscribed",
    listener: SubscribedListener<T>,
  ): void;
}

export interface IBaseAudioTrackPublication<T extends IAudioTrack> {
  readonly kind: "audio";

  readonly trackName: string;

  readonly track: T;

  on(
    event: "subscribed" | "unsubscribed",
    listener: SubscribedListener<T>,
  ): void;

  off(
    event: "subscribed" | "unsubscribed",
    listener: SubscribedListener<T>,
  ): void;
}

export type IRemoteAudioTrackPublication = IBaseAudioTrackPublication<IRemoteAudioTrack>;
export type ILocalAudioTrackPublication = IBaseAudioTrackPublication<ILocalAudioTrack>;

export type IRemoteVideoTrackPublication = IBaseVideoTrackPublication<IRemoteVideoTrack>;
export type ILocalVideoTrackPublication = IBaseVideoTrackPublication<ILocalVideoTrack>;

export type IAudioTrackPublication =
  | IRemoteAudioTrackPublication
  | ILocalAudioTrackPublication;
export type IVideoTrackPublication =
  | IRemoteVideoTrackPublication
  | ILocalVideoTrackPublication;

export type IRemoteTrackPublication =
  | IRemoteAudioTrackPublication
  | IRemoteVideoTrackPublication;
export type ILocalTrackPublication =
  | ILocalAudioTrackPublication
  | ILocalVideoTrackPublication;
export type ITrackPublication =
  | IRemoteTrackPublication
  | ILocalTrackPublication;

export class RawVideoTrackPublication<T extends IVideoTrack>
  implements IBaseVideoTrackPublication<T> {
  readonly kind: "video" = "video";

  readonly trackName: string;

  readonly track: T;

  #subscribedListeners: Set<SubscribedListener<T>> = new Set();

  #unsubscribedListeners: Set<SubscribedListener<T>> = new Set();

  constructor(trackName: string, track: T) {
    this.trackName = trackName;
    this.track = track;
  }

  on(event: "subscribed" | "unsubscribed", listener: SubscribedListener<T>) {
    if (event === "subscribed") {
      this.#subscribedListeners.add(listener);
    }
    if (event === "unsubscribed") {
      this.#unsubscribedListeners.add(listener);
    }
  }

  off(event: "subscribed" | "unsubscribed", listener: SubscribedListener<T>) {
    if (event === "subscribed") {
      this.#subscribedListeners.delete(listener);
    }
    if (event === "unsubscribed") {
      this.#unsubscribedListeners.delete(listener);
    }
  }
}

export class RawVAudioTrackPublication<T extends IAudioTrack>
  implements IBaseAudioTrackPublication<T> {
  readonly kind: "audio" = "audio";

  readonly trackName: string;

  readonly track: T;

  #subscribedListeners: Set<SubscribedListener<T>> = new Set();

  #unsubscribedListeners: Set<SubscribedListener<T>> = new Set();

  constructor(trackName: string, track: T) {
    this.trackName = trackName;
    this.track = track;
  }

  on(event: "subscribed" | "unsubscribed", listener: SubscribedListener<T>) {
    if (event === "subscribed") {
      this.#subscribedListeners.add(listener);
    }
    if (event === "unsubscribed") {
      this.#unsubscribedListeners.add(listener);
    }
  }

  off(event: "subscribed" | "unsubscribed", listener: SubscribedListener<T>) {
    if (event === "subscribed") {
      this.#subscribedListeners.delete(listener);
    }
    if (event === "unsubscribed") {
      this.#unsubscribedListeners.delete(listener);
    }
  }
}
