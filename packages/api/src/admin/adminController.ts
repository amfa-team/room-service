import type {
  AdminParticipantData,
  AdminRoomData,
  IParticipant,
  IRoom,
  PaginationPayload,
} from "@amfa-team/room-service-types";
import { JsonDecoder } from "ts.data.json";
import type { HandlerResult } from "../services/io/types";
import { getModels } from "../services/mongo/client";

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
): Promise<HandlerResult<PaginationPayload<IRoom>>> {
  const { pageSize, pageIndex } = data.pagination;
  const { RoomModel } = await getModels();
  const [roomCount, rooms] = await Promise.all([
    RoomModel.countDocuments({}),
    RoomModel.find({}, null, {
      sort: { _id: 1 },
      limit: pageSize,
      skip: pageIndex * pageSize,
    }),
  ]);

  return {
    payload: {
      pagination: {
        pageSize,
        pageIndex,
        pageCount: Math.ceil(roomCount / pageSize),
        count: roomCount,
      },
      page: rooms.map((room) => room.toJSON()),
    },
  };
}

export async function handleAdminParticipants(
  data: AdminParticipantData,
): Promise<HandlerResult<PaginationPayload<IParticipant>>> {
  const { pageSize, pageIndex } = data.pagination;
  const { ParticipantModel } = await getModels();
  const [participantCount, participants] = await Promise.all([
    ParticipantModel.countDocuments({}),
    ParticipantModel.find({}, null, {
      sort: { _id: 1 },
      limit: pageSize,
      skip: pageIndex * pageSize,
    }),
  ]);

  return {
    payload: {
      pagination: {
        pageSize,
        pageIndex,
        pageCount: Math.ceil(participantCount / pageSize),
        count: participantCount,
      },
      page: participants.map((participant) => participant.toJSON()),
    },
  };
}
