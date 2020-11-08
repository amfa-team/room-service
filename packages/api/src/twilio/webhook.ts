import { JsonDecoder } from "ts.data.json";
import type {
  RoomRoomStatus,
  RoomRoomType,
} from "twilio/lib/rest/video/v1/room";
import type { ParticipantStatus } from "twilio/lib/rest/video/v1/room/roomParticipant";
import type { PublishedTrackKind } from "twilio/lib/rest/video/v1/room/roomParticipant/roomParticipantPublishedTrack";

export interface CommonRoomStatusEvent {
  AccountSid: string;
  RoomName: string;
  RoomSid: string;
  RoomStatus: RoomRoomStatus;
  RoomType: RoomRoomType;
  Timestamp: string;
}

const commonDecoders = {
  AccountSid: JsonDecoder.string,
  RoomName: JsonDecoder.string,
  RoomSid: JsonDecoder.string,
  RoomStatus: JsonDecoder.oneOf<RoomRoomStatus>(
    [
      JsonDecoder.isExactly("in-progress"),
      JsonDecoder.isExactly("completed"),
      JsonDecoder.isExactly("failed"),
    ],
    "RoomStatus",
  ),
  RoomType: JsonDecoder.oneOf<RoomRoomType>(
    [
      JsonDecoder.isExactly("go"),
      JsonDecoder.isExactly("peer-to-peer"),
      JsonDecoder.isExactly("group"),
      JsonDecoder.isExactly("group-small"),
    ],
    "RoomType",
  ),
  Timestamp: JsonDecoder.string,
};

export interface RoomCreatedEvent extends CommonRoomStatusEvent {
  StatusCallbackEvent: "room-created";
}

export const roomCreatedDecoder = JsonDecoder.object<RoomCreatedEvent>(
  {
    StatusCallbackEvent: JsonDecoder.isExactly("room-created"),
    ...commonDecoders,
  },
  "RoomCreatedEvent",
);

export interface RoomEndedEvent extends CommonRoomStatusEvent {
  StatusCallbackEvent: "room-ended";
  RoomDuration: string;
}

export const roomEndedDecoder = JsonDecoder.object<RoomEndedEvent>(
  {
    StatusCallbackEvent: JsonDecoder.isExactly("room-ended"),
    RoomDuration: JsonDecoder.string,
    ...commonDecoders,
  },
  "RoomEndedEvent",
);

export interface ParticipantConnectedEvent extends CommonRoomStatusEvent {
  StatusCallbackEvent: "participant-connected";
  ParticipantSid: string;
  ParticipantStatus: ParticipantStatus;
  ParticipantIdentity: string;
}

export const participantConnectedDecoder = JsonDecoder.object<
  ParticipantConnectedEvent
>(
  {
    StatusCallbackEvent: JsonDecoder.isExactly("participant-connected"),
    ParticipantSid: JsonDecoder.string,
    ParticipantStatus: JsonDecoder.oneOf<ParticipantStatus>(
      [
        JsonDecoder.isExactly("connected"),
        JsonDecoder.isExactly("disconnected"),
      ],
      "ParticipantStatus",
    ),
    ParticipantIdentity: JsonDecoder.string,
    ...commonDecoders,
  },
  "ParticipantConnectedEvent",
);

export interface ParticipantDisconnectedEvent extends CommonRoomStatusEvent {
  StatusCallbackEvent: "participant-disconnected";
  ParticipantSid: string;
  ParticipantStatus: ParticipantStatus;
  ParticipantDuration: string;
  ParticipantIdentity: string;
}

export const participantDisconnectedDecoder = JsonDecoder.object<
  ParticipantDisconnectedEvent
>(
  {
    StatusCallbackEvent: JsonDecoder.isExactly("participant-disconnected"),
    ParticipantSid: JsonDecoder.string,
    ParticipantStatus: JsonDecoder.oneOf<ParticipantStatus>(
      [
        JsonDecoder.isExactly("connected"),
        JsonDecoder.isExactly("disconnected"),
      ],
      "ParticipantStatus",
    ),
    ParticipantIdentity: JsonDecoder.string,
    ParticipantDuration: JsonDecoder.string,
    ...commonDecoders,
  },
  "ParticipantDisconnectedEvent",
);

type TrackEventStatuses =
  | "track-added"
  | "track-removed"
  | "track-enabled"
  | "track-disabled";

export interface TrackEvent extends CommonRoomStatusEvent {
  StatusCallbackEvent: TrackEventStatuses;
  TrackSid: string;
  TrackKind: PublishedTrackKind;
}

export const trackEventDecoder = JsonDecoder.object<TrackEvent>(
  {
    StatusCallbackEvent: JsonDecoder.oneOf<TrackEventStatuses>(
      [
        JsonDecoder.isExactly("track-added"),
        JsonDecoder.isExactly("track-removed"),
        JsonDecoder.isExactly("track-enabled"),
        JsonDecoder.isExactly("track-disabled"),
      ],
      "StatusCallbackEvent",
    ),
    TrackSid: JsonDecoder.string,
    TrackKind: JsonDecoder.oneOf<PublishedTrackKind>(
      [
        JsonDecoder.isExactly("audio"),
        JsonDecoder.isExactly("video"),
        JsonDecoder.isExactly("data"),
      ],
      "TrackKind",
    ),
    ...commonDecoders,
  },
  "TrackEvent",
);

export type RoomStatusEvent =
  | RoomCreatedEvent
  | RoomEndedEvent
  | ParticipantConnectedEvent
  | ParticipantDisconnectedEvent
  | TrackEvent;

export const roomStatusEventDecoder = JsonDecoder.oneOf<RoomStatusEvent>(
  [
    roomCreatedDecoder,
    roomEndedDecoder,
    participantConnectedDecoder,
    participantDisconnectedDecoder,
    trackEventDecoder,
  ],
  "RoomStatusEvent",
);
