/* eslint-disable max-classes-per-file */

import { v4 as uuid } from "uuid";

interface IBaseTrack {
  readonly id: string;

  readonly name: string;

  readonly mediaStreamTrack: MediaStreamTrack | null;
  readonly isEnabled: boolean;

  on(event: "enabled" | "disabled" | "stopped", listener: () => void): void;

  removeListener(
    event: "enabled" | "disabled" | "stopped",
    listener: () => void,
  ): void;
}

export interface IBaseAudioTrack extends IBaseTrack {
  readonly kind: "audio";

  attach(element: HTMLMediaElement): HTMLMediaElement;
  detach(element: HTMLMediaElement): HTMLMediaElement[];
}

export interface ILocalAudioTrack extends IBaseAudioTrack {
  disable(): this;
  enable(enabled?: boolean): this;
  stop(): this;
}

export interface IRemoteAudioTrack extends IBaseAudioTrack {
  readonly isSwitchedOff: boolean;

  on(
    event: "enabled" | "disabled" | "switchedOff" | "switchedOn" | "stopped",
    listener: () => void,
  ): void;

  removeListener(
    event: "enabled" | "disabled" | "switchedOff" | "switchedOn" | "stopped",
    listener: () => void,
  ): void;
}

export interface IBaseVideoTrack extends IBaseTrack {
  readonly kind: "video";

  attach(element: HTMLMediaElement): HTMLMediaElement;
  detach(element: HTMLMediaElement): HTMLMediaElement[];
}

export interface ILocalVideoTrack extends IBaseVideoTrack {
  disable(): this;
  enable(enabled?: boolean): this;
}

export interface IRemoteVideoTrack extends IBaseVideoTrack {
  readonly isSwitchedOff: boolean;

  on(
    event: "enabled" | "disabled" | "switchedOff" | "switchedOn" | "stopped",
    listener: () => void,
  ): void;

  removeListener(
    event: "enabled" | "disabled" | "switchedOff" | "switchedOn" | "stopped",
    listener: () => void,
  ): void;
}

export type IRemoteTrack = IRemoteAudioTrack | IRemoteVideoTrack;
export type ILocalTrack = ILocalAudioTrack | ILocalVideoTrack;

export type IAudioTrack = ILocalAudioTrack | IRemoteAudioTrack;
export type IVideoTrack = ILocalVideoTrack | IRemoteVideoTrack;

export type ITrack = IRemoteTrack | ILocalTrack;

abstract class RawBaseVideoTrack implements IBaseVideoTrack {
  readonly kind = "video";

  #attachments: Set<HTMLVideoElement> = new Set();

  #stream: MediaStream;

  readonly name: string;

  readonly id: string = uuid();

  #enabledEvents: Set<() => void> = new Set();

  #disabledEvents: Set<() => void> = new Set();

  #isEnabled: boolean = true;

  constructor(name: string, stream: MediaStream) {
    this.name = name;
    this.#stream = stream;
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

  get isEnabled() {
    return this.#isEnabled;
  }

  rawDisable() {
    this.#isEnabled = false;

    this.#disabledEvents.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error("RawBaseVideoTrack.disabledEvents: fail", e);
      }
    });

    return this;
  }

  rawEnable(enabled = true) {
    if (!enabled) {
      return this.rawDisable();
    }

    this.#isEnabled = true;

    this.#enabledEvents.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error("RawBaseVideoTrack.enableEvents: fail", e);
      }
    });

    return this;
  }

  on(event: "enabled" | "disabled", listener: () => void) {
    if (event === "enabled") {
      this.#enabledEvents.add(listener);
    }
    if (event === "disabled") {
      this.#disabledEvents.add(listener);
    }
  }

  removeListener(event: "enabled" | "disabled", listener: () => void) {
    if (event === "enabled") {
      this.#enabledEvents.delete(listener);
    }
    if (event === "disabled") {
      this.#disabledEvents.delete(listener);
    }
  }
}

export class RawRemoteVideoTrack
  extends RawBaseVideoTrack
  implements IRemoteVideoTrack {
  #switchOffEvents: Set<() => void> = new Set();

  #switchOnEvents: Set<() => void> = new Set();

  #isSwitchedOff = false;

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

  on(
    event: "switchedOff" | "switchedOn" | "enabled" | "disabled",
    listener: () => void,
  ) {
    super.on(event as "enabled" | "disabled", listener);

    if (event === "switchedOn") {
      this.#switchOnEvents.add(listener);
    }
    if (event === "switchedOff") {
      this.#switchOffEvents.add(listener);
    }
  }

  removeListener(
    event: "switchedOff" | "switchedOn" | "enabled" | "disabled",
    listener: () => void,
  ) {
    super.removeListener(event as "enabled" | "disabled", listener);

    if (event === "switchedOn") {
      this.#switchOnEvents.delete(listener);
    }
    if (event === "switchedOff") {
      this.#switchOffEvents.delete(listener);
    }
  }
}

export class RawLocalVideoTrack
  extends RawBaseVideoTrack
  implements ILocalVideoTrack {
  disable() {
    return this.rawDisable();
  }

  enable(enabled = true) {
    return this.rawEnable(enabled);
  }
}

abstract class RawBaseAudioTrack implements IBaseAudioTrack {
  readonly kind = "audio";

  #attachments: Set<HTMLAudioElement> = new Set();

  #stream: MediaStream;

  readonly name: string;

  readonly id: string = uuid();

  #enabledEvents: Set<() => void> = new Set();

  #disabledEvents: Set<() => void> = new Set();

  #stoppedEvents: Set<() => void> = new Set();

  #isEnabled: boolean = true;

  constructor(name: string, stream: MediaStream) {
    this.name = name;
    this.#stream = stream;
  }

  attach(element: HTMLAudioElement): HTMLAudioElement {
    this.#attachments.add(element);

    // eslint-disable-next-line no-param-reassign
    element.srcObject = this.#stream;

    return element;
  }

  detach(element: HTMLAudioElement): HTMLAudioElement[] {
    this.#attachments.delete(element);

    return Array.from(this.#attachments.values());
  }

  get mediaStreamTrack(): MediaStreamTrack | null {
    return this.#stream.getAudioTracks()[0];
  }

  get isEnabled() {
    return this.#isEnabled;
  }

  rawDisable() {
    this.#isEnabled = false;

    this.#disabledEvents.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error("RawBaseAudioTrack.disabledEvents: fail", e);
      }
    });

    return this;
  }

  rawEnable(enabled = true) {
    if (!enabled) {
      return this.rawDisable();
    }

    this.#isEnabled = true;

    this.#enabledEvents.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error("RawBaseAudioTrack.enableEvents: fail", e);
      }
    });

    return this;
  }

  rawStop() {
    this.rawDisable();
    this.mediaStreamTrack?.stop();

    this.#stoppedEvents.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error("RawBaseAudioTrack.stoppedEvents: fail", e);
      }
    });

    return this;
  }

  on(event: "enabled" | "disabled" | "stopped", listener: () => void) {
    if (event === "enabled") {
      this.#enabledEvents.add(listener);
    }
    if (event === "disabled") {
      this.#disabledEvents.add(listener);
    }
    if (event === "stopped") {
      this.#stoppedEvents.add(listener);
    }
  }

  removeListener(
    event: "enabled" | "disabled" | "stopped",
    listener: () => void,
  ) {
    if (event === "enabled") {
      this.#enabledEvents.delete(listener);
    }
    if (event === "disabled") {
      this.#disabledEvents.delete(listener);
    }
    if (event === "stopped") {
      this.#stoppedEvents.delete(listener);
    }
  }
}

export class RawRemoteAudioTrack
  extends RawBaseAudioTrack
  implements IRemoteAudioTrack {
  #switchOffEvents: Set<() => void> = new Set();

  #switchOnEvents: Set<() => void> = new Set();

  #isSwitchedOff = false;

  get isSwitchedOff() {
    return this.#isSwitchedOff;
  }

  switchOff() {
    this.#isSwitchedOff = true;

    this.#switchOffEvents.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error("AudioTracks.switchOffEvents: fail", e);
      }
    });
  }

  switchOn() {
    this.#isSwitchedOff = false;

    this.#switchOnEvents.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error("AudioTracks.switchOnEvents: fail", e);
      }
    });
  }

  on(
    event: "switchedOff" | "switchedOn" | "enabled" | "disabled" | "stopped",
    listener: () => void,
  ) {
    super.on(event as "enabled" | "disabled" | "stopped", listener);

    if (event === "switchedOn") {
      this.#switchOnEvents.add(listener);
    }
    if (event === "switchedOff") {
      this.#switchOffEvents.add(listener);
    }
  }

  removeListener(
    event: "switchedOff" | "switchedOn" | "enabled" | "disabled" | "stopped",
    listener: () => void,
  ) {
    super.removeListener(event as "enabled" | "disabled" | "stopped", listener);

    if (event === "switchedOn") {
      this.#switchOnEvents.delete(listener);
    }
    if (event === "switchedOff") {
      this.#switchOffEvents.delete(listener);
    }
  }
}

export class RawLocalAudioTrack
  extends RawBaseAudioTrack
  implements ILocalAudioTrack {
  disable() {
    return this.rawDisable();
  }

  enable(enabled = true) {
    return this.rawEnable(enabled);
  }

  stop() {
    return this.rawStop();
  }
}
