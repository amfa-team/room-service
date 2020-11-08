import type {
  AdminParticipantData,
  AdminRoomData,
  IParticipant,
  IRoom,
  PaginationPayload,
} from "@amfa-team/types";
import { JsonDecoder } from "ts.data.json";
import { ParticipantModel } from "../mongo/model/participant";
import { RoomModel } from "../mongo/model/room";

export const paginationDecoder = JsonDecoder.object(
  {
    pageSize: JsonDecoder.number,
    pageIndex: JsonDecoder.number,
  },
  "paginationDecoder",
);

export const adminDecoder = JsonDecoder.object(
  {
    pagination: paginationDecoder,
    secret: JsonDecoder.string,
  },
  "adminDecoder",
);

export async function handleAdminRooms(
  data: AdminRoomData,
): Promise<PaginationPayload<IRoom>> {
  const { pageSize, pageIndex } = data.pagination;
  const [roomCount, rooms] = await Promise.all([
    RoomModel.countDocuments({}),
    RoomModel.find({}, null, {
      sort: { _id: 1 },
      limit: pageSize,
      skip: pageIndex * pageSize,
    }),
  ]);

  return {
    pagination: {
      pageSize,
      pageIndex,
      pageCount: Math.ceil(roomCount / pageSize),
      count: roomCount,
    },
    page: rooms.map((room) => room.toJSON({ getters: true })),
  };
}

export async function handleAdminParticipants(
  data: AdminParticipantData,
): Promise<PaginationPayload<IParticipant>> {
  const { pageSize, pageIndex } = data.pagination;
  const [participantCount, participants] = await Promise.all([
    ParticipantModel.countDocuments({}),
    ParticipantModel.find({}, null, {
      sort: { _id: 1 },
      limit: pageSize,
      skip: pageIndex * pageSize,
    }),
  ]);

  return {
    pagination: {
      pageSize,
      pageIndex,
      pageCount: Math.ceil(participantCount / pageSize),
      count: participantCount,
    },
    page: participants.map((participant) =>
      participant.toJSON({ getters: true }),
    ),
  };
}
