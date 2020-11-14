/* eslint-disable max-classes-per-file */

import { v4 as uuid } from "uuid";
import type {
  IAudioTrackPublication,
  ILocalAudioTrackPublication,
  ILocalVideoTrackPublication,
  IRemoteAudioTrackPublication,
  IRemoteVideoTrackPublication,
  ITrackPublication,
  IVideoTrackPublication,
} from "./Publication";

export type NetworkQualityLevelChangedListener = (level: number | null) => void;

export type TrackPublishedListener = (publication: ITrackPublication) => void;

interface IBaseParticipant<
  V extends IVideoTrackPublication,
  A extends IAudioTrackPublication
> {
  readonly sid: string;

  readonly networkQualityLevel: number | null;

  readonly identity: string;

  readonly tracks: Map<string, V | A>;

  readonly videoTracks: Map<string, V>;

  readonly audioTracks: Map<string, A>;

  on(
    event: "networkQualityLevelChanged",
    listener: NetworkQualityLevelChangedListener,
  ): void;
  on(
    event: "trackPublished" | "trackUnpublished",
    listener: TrackPublishedListener,
  ): void;
  on(event: "reconnected" | "reconnecting", listener: () => void): void;

  off(
    event: "networkQualityLevelChanged",
    listener: NetworkQualityLevelChangedListener,
  ): void;
  off(
    event: "trackPublished" | "trackUnpublished",
    listener: TrackPublishedListener,
  ): void;
  off(event: "reconnected" | "reconnecting", listener: () => void): void;
}

export type IRemoteParticipant = IBaseParticipant<
  IRemoteVideoTrackPublication,
  IRemoteAudioTrackPublication
>;
export type ILocalParticipant = IBaseParticipant<
  ILocalVideoTrackPublication,
  ILocalAudioTrackPublication
>;
export type IParticipant = IRemoteParticipant | ILocalParticipant;

export class RawBaseParticipant<
  V extends IVideoTrackPublication = IVideoTrackPublication,
  A extends IAudioTrackPublication = IAudioTrackPublication
> implements IBaseParticipant<V, A> {
  #networkQualityLevel: number | null = null;

  readonly sid: string = uuid();

  readonly identity: string;

  readonly tracks: Map<string, V | A> = new Map();

  readonly videoTracks: Map<string, V> = new Map();

  readonly audioTracks: Map<string, A> = new Map();

  constructor(identity: string) {
    this.identity = identity;
  }

  get networkQualityLevel() {
    return this.#networkQualityLevel;
  }

  setNetworkQualityLevel(level: number | null) {
    this.#networkQualityLevel = level;

    this.#networkQualityLevelChangedListeners.forEach((listener) => {
      try {
        listener(level);
      } catch (e) {
        console.error(
          "Participant.networkQualityLevelChangedListeners: listener failed",
          e,
        );
      }
    });
  }

  addVideoTrack(trackPublication: V): void {
    this.videoTracks.set(trackPublication.track.id, trackPublication);
    this.tracks.set(trackPublication.track.id, trackPublication);

    this.#trackPublishedListeners.forEach((listener) => {
      try {
        listener(trackPublication);
      } catch (e) {
        console.error("Participant.addVideoTrack: listener failed", e);
      }
    });
  }

  removeVideoTrack(trackPublication: V): void {
    this.videoTracks.delete(trackPublication.track.id);
    this.tracks.delete(trackPublication.track.id);

    this.#trackUnpublishedListeners.forEach((listener) => {
      try {
        listener(trackPublication);
      } catch (e) {
        console.error("Participant.addVideoTrack: listener failed", e);
      }
    });
  }

  addAudioTrack(trackPublication: A): void {
    this.audioTracks.set(trackPublication.track.id, trackPublication);
    this.tracks.set(trackPublication.track.id, trackPublication);

    this.#trackPublishedListeners.forEach((listener) => {
      try {
        listener(trackPublication);
      } catch (e) {
        console.error("Participant.addAudioTrack: listener failed", e);
      }
    });
  }

  removeAudioTrack(trackPublication: A): void {
    this.audioTracks.delete(trackPublication.track.id);
    this.tracks.delete(trackPublication.track.id);

    this.#trackPublishedListeners.forEach((listener) => {
      try {
        listener(trackPublication);
      } catch (e) {
        console.error("Participant.removeAudioTrack: listener failed", e);
      }
    });
  }

  #trackPublishedListeners: Set<TrackPublishedListener> = new Set();

  #trackUnpublishedListeners: Set<TrackPublishedListener> = new Set();

  #reconnectedListeners: Set<() => void> = new Set();

  #reconnectingListeners: Set<() => void> = new Set();

  #networkQualityLevelChangedListeners: Set<
    NetworkQualityLevelChangedListener
  > = new Set();

  on(
    event:
      | "networkQualityLevelChanged"
      | "trackPublished"
      | "trackUnpublished"
      | "reconnected"
      | "reconnecting",
    listener:
      | NetworkQualityLevelChangedListener
      | TrackPublishedListener
      | (() => void),
  ) {
    if (event === "networkQualityLevelChanged") {
      this.#networkQualityLevelChangedListeners.add(
        listener as NetworkQualityLevelChangedListener,
      );
    }
    if (event === "trackPublished") {
      this.#trackPublishedListeners.add(listener as TrackPublishedListener);
    }
    if (event === "trackUnpublished") {
      this.#trackUnpublishedListeners.add(listener as TrackPublishedListener);
    }
    if (event === "reconnected") {
      this.#reconnectedListeners.add(listener as () => void);
    }
    if (event === "reconnecting") {
      this.#reconnectingListeners.add(listener as () => void);
    }
  }

  off(
    event:
      | "networkQualityLevelChanged"
      | "trackPublished"
      | "trackUnpublished"
      | "reconnected"
      | "reconnecting",
    listener:
      | NetworkQualityLevelChangedListener
      | TrackPublishedListener
      | (() => void),
  ) {
    if (event === "networkQualityLevelChanged") {
      this.#networkQualityLevelChangedListeners.delete(
        listener as NetworkQualityLevelChangedListener,
      );
    }
    if (event === "trackPublished") {
      this.#trackPublishedListeners.delete(listener as TrackPublishedListener);
    }
    if (event === "trackUnpublished") {
      this.#trackUnpublishedListeners.delete(
        listener as TrackPublishedListener,
      );
    }
    if (event === "reconnected") {
      this.#reconnectedListeners.delete(listener as () => void);
    }
    if (event === "reconnecting") {
      this.#reconnectingListeners.delete(listener as () => void);
    }
  }
}

export class RawLocalParticipant
  extends RawBaseParticipant<
    ILocalVideoTrackPublication,
    ILocalAudioTrackPublication
  >
  implements ILocalParticipant {}

export class RawRemoteParticipant
  extends RawBaseParticipant<
    IRemoteVideoTrackPublication,
    IRemoteAudioTrackPublication
  >
  implements IRemoteParticipant {}
