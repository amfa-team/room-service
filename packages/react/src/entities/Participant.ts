import type { ITrackPublication, IVideoTrackPublication } from "./Publication";

export type NetworkQualityLevelChangedListener = (level: number | null) => void;

export type TrackPublishedListener = (publication: ITrackPublication) => void;

export interface IParticipant {
  readonly networkQualityLevel: number | null;

  readonly identity: string;

  readonly tracks: Map<string, ITrackPublication>;

  readonly videoTracks: Map<string, IVideoTrackPublication>;

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

export class RawParticipant implements IParticipant {
  #networkQualityLevel: number | null = null;

  readonly identity: string;

  readonly tracks: Map<string, ITrackPublication> = new Map();

  readonly videoTracks: Map<string, IVideoTrackPublication> = new Map();

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

  addVideoTrack(trackPublication: IVideoTrackPublication): void {
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

  removeVideoTrack(trackPublication: IVideoTrackPublication): void {
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
