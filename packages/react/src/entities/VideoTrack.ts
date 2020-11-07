import { v4 as uuid } from "uuid";

interface IBaseTrack {
  readonly id: string;

  readonly name: string;

  readonly mediaStreamTrack: MediaStreamTrack | null;

  readonly isSwitchedOff?: boolean | undefined;

  on(event: "switchedOff" | "switchedOn", listener: () => void): void;

  off(event: "switchedOff" | "switchedOn", listener: () => void): void;
}

export interface IAudioTrack extends IBaseTrack {
  readonly kind: "audio";

  attach(element: HTMLMediaElement): HTMLMediaElement;
  detach(element: HTMLMediaElement): HTMLMediaElement[];
}

export interface IVideoTrack extends IBaseTrack {
  readonly kind: "video";

  attach(element: HTMLMediaElement): HTMLMediaElement;
  detach(element: HTMLMediaElement): HTMLMediaElement[];
}

export type ITrack = IAudioTrack | IVideoTrack;

export class RawVideoTrack implements IVideoTrack {
  readonly kind = "video";

  #attachments: Set<HTMLVideoElement> = new Set();

  #stream: MediaStream;

  #switchOffEvents: Set<() => void> = new Set();

  #switchOnEvents: Set<() => void> = new Set();

  #isSwitchedOff = false;

  readonly name: string;

  readonly id: string = uuid();

  constructor(name: string, stream: MediaStream) {
    this.name = name;
    this.#stream = stream;
  }

  get isSwitchedOff() {
    return this.#isSwitchedOff;
  }

  switchOff() {
    this.#isSwitchedOff = true;

    this.#switchOffEvents.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error("VideoTracks.switchOffEvents: fail", e);
      }
    });
  }

  switchOn() {
    this.#isSwitchedOff = false;

    this.#switchOnEvents.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error("VideoTracks.switchOnEvents: fail", e);
      }
    });
  }

  attach(element: HTMLVideoElement): HTMLVideoElement {
    this.#attachments.add(element);

    // eslint-disable-next-line no-param-reassign
    element.srcObject = this.#stream;

    return element;
  }

  detach(element: HTMLVideoElement): HTMLVideoElement[] {
    this.#attachments.delete(element);

    return Array.from(this.#attachments.values());
  }

  get mediaStreamTrack(): MediaStreamTrack | null {
    return this.#stream.getVideoTracks()[0];
  }

  on(event: "switchedOff" | "switchedOn", listener: () => void) {
    if (event === "switchedOn") {
      this.#switchOnEvents.add(listener);
    }
    if (event === "switchedOff") {
      this.#switchOffEvents.add(listener);
    }
  }

  off(event: "switchedOff" | "switchedOn", listener: () => void) {
    if (event === "switchedOn") {
      this.#switchOnEvents.delete(listener);
    }
    if (event === "switchedOff") {
      this.#switchOffEvents.delete(listener);
    }
  }
}
