import type { IAudioTrack, ITrack, IVideoTrack } from "./VideoTrack";

export type SubscribedListener<T extends ITrack> = (track: T) => void;

export interface IVideoTrackPublication {
  readonly kind: "video";

  readonly trackName: string;

  readonly track: IVideoTrack;

  on(
    event: "subscribed" | "unsubscribed",
    listener: SubscribedListener<IVideoTrack>,
  ): void;

  off(
    event: "subscribed" | "unsubscribed",
    listener: SubscribedListener<IVideoTrack>,
  ): void;
}

export interface IAudioTrackPublication {
  readonly kind: "audio";

  readonly trackName: string;

  readonly track: IAudioTrack;

  on(
    event: "subscribed" | "unsubscribed",
    listener: SubscribedListener<IAudioTrack>,
  ): void;

  off(
    event: "subscribed" | "unsubscribed",
    listener: SubscribedListener<IAudioTrack>,
  ): void;
}

export type ITrackPublication = IVideoTrackPublication | IAudioTrackPublication;

export class RawVideoTrackPublication implements IVideoTrackPublication {
  readonly kind: "video" = "video";

  readonly trackName: string;

  readonly track: IVideoTrack;

  #subscribedListeners: Set<SubscribedListener<IVideoTrack>> = new Set();

  #unsubscribedListeners: Set<SubscribedListener<IVideoTrack>> = new Set();

  constructor(trackName: string, track: IVideoTrack) {
    this.trackName = trackName;
    this.track = track;
  }

  on(
    event: "subscribed" | "unsubscribed",
    listener: SubscribedListener<IVideoTrack>,
  ) {
    if (event === "subscribed") {
      this.#subscribedListeners.add(listener);
    }
    if (event === "unsubscribed") {
      this.#unsubscribedListeners.add(listener);
    }
  }

  off(
    event: "subscribed" | "unsubscribed",
    listener: SubscribedListener<IVideoTrack>,
  ) {
    if (event === "subscribed") {
      this.#subscribedListeners.delete(listener);
    }
    if (event === "unsubscribed") {
      this.#unsubscribedListeners.delete(listener);
    }
  }
}
