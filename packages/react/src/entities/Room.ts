import { v4 as uuid } from "uuid";
import type {
  ILocalParticipant,
  IRemoteParticipant,
  TrackPublishedListener,
} from "./Participant";

export enum RoomState {
  "connected" = "connected",
  "reconnecting" = "reconnecting",
  "disconnected" = "disconnected",
}

export type ParticipantConnectedListener = (
  participant: IRemoteParticipant,
) => void;

export interface IRoom {
  readonly localParticipant: ILocalParticipant;

  readonly name: string;

  readonly participants: Map<string, IRemoteParticipant>;

  readonly sid: string;

  readonly state: RoomState;

  on(
    event: "participantConnected" | "participantDisconnected",
    listener: ParticipantConnectedListener,
  ): void;
  on(event: "disconnected", listener: () => void): void;
  on(
    event: "trackPublished" | "trackUnpublished",
    listener: TrackPublishedListener,
  ): void;

  removeListener(
    event: "participantConnected" | "participantDisconnected",
    listener: ParticipantConnectedListener,
  ): void;
  removeListener(event: "disconnected", listener: () => void): void;
  removeListener(
    event: "trackPublished" | "trackUnpublished",
    listener: TrackPublishedListener,
  ): void;
}

export class RawRoom implements IRoom {
  readonly localParticipant: ILocalParticipant;

  readonly name: string;

  #participants: Map<string, IRemoteParticipant> = new Map();

  readonly sid: string = uuid();

  readonly state: RoomState;

  #trackPublishedListeners: Set<TrackPublishedListener> = new Set();

  #trackUnpublishedListeners: Set<TrackPublishedListener> = new Set();

  #disconnectedListeners: Set<() => void> = new Set();

  #participantConnectedListeners: Set<ParticipantConnectedListener> = new Set();

  #participantDisconnectedListeners: Set<ParticipantConnectedListener> = new Set();

  constructor(
    name: string,
    localParticipant: ILocalParticipant,
    state: RoomState = RoomState.disconnected,
  ) {
    this.localParticipant = localParticipant;
    this.name = name;
    this.state = state;
  }

  get participants() {
    return this.#participants;
  }

  addParticipant(participant: IRemoteParticipant) {
    this.#participants.set(participant.sid, participant);

    this.#participantConnectedListeners.forEach((listener) => {
      try {
        listener(participant);
      } catch (e) {
        console.error("Room.participantConnectedListeners: listener failed", e);
      }
    });
  }

  on(
    event:
      | "trackPublished"
      | "trackUnpublished"
      | "disconnected"
      | "participantConnected"
      | "participantDisconnected",
    listener:
      | TrackPublishedListener
      | ParticipantConnectedListener
      | (() => void),
  ) {
    if (event === "trackPublished") {
      this.#trackPublishedListeners.add(listener as TrackPublishedListener);
    }
    if (event === "trackUnpublished") {
      this.#trackUnpublishedListeners.add(listener as TrackPublishedListener);
    }
    if (event === "participantConnected") {
      this.#participantConnectedListeners.add(
        listener as ParticipantConnectedListener,
      );
    }
    if (event === "participantDisconnected") {
      this.#participantDisconnectedListeners.add(
        listener as ParticipantConnectedListener,
      );
    }
    if (event === "disconnected") {
      this.#disconnectedListeners.add(listener as () => void);
    }
  }

  removeListener(
    event:
      | "trackPublished"
      | "trackUnpublished"
      | "disconnected"
      | "participantConnected"
      | "participantDisconnected",
    listener:
      | TrackPublishedListener
      | ParticipantConnectedListener
      | (() => void),
  ) {
    if (event === "trackPublished") {
      this.#trackPublishedListeners.delete(listener as TrackPublishedListener);
    }
    if (event === "trackUnpublished") {
      this.#trackUnpublishedListeners.delete(
        listener as TrackPublishedListener,
      );
    }
    if (event === "participantConnected") {
      this.#participantConnectedListeners.delete(
        listener as ParticipantConnectedListener,
      );
    }
    if (event === "participantDisconnected") {
      this.#participantDisconnectedListeners.delete(
        listener as ParticipantConnectedListener,
      );
    }
    if (event === "disconnected") {
      this.#disconnectedListeners.delete(listener as () => void);
    }
  }
}
