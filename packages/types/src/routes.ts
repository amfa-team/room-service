import type { IParticipant, IRoom } from "./model";

export interface SuccessResponse<T> {
  success: true;
  payload: T;
}

export interface ErrorResponse {
  success: false;
  error: string;
}

export type Response<T> = SuccessResponse<T> | ErrorResponse;

export enum METHODS {
  post = "POST",
  get = "GET",
}

export type GetRoute<O> = {
  out: O;
};

export type PostRoute<I, O> = {
  in: I;
  out: O;
};

export interface JoinData {
  spaceId: string;
  participantId: string;
}

export interface JoinPayload {
  room: IRoom;
  token: string;
}

export interface AdminData {
  secret: string;
}

export interface PaginationData {
  pageIndex: number;
  pageSize: number;
}

export interface AdminRoomData extends AdminData {
  pagination: PaginationData;
}

export interface AdminParticipantData extends AdminData {
  pagination: PaginationData;
}

export interface PaginationContext extends PaginationData {
  pageCount: number;
  count: number;
}

export interface PaginationPayload<T> {
  pagination: PaginationContext;
  page: T[];
}

export type GetRoutes = {
  "webhook/twilio/status": GetRoute<boolean>;
};

export type PublicPostRoutes = {
  join: PostRoute<JoinData, JoinPayload>;
};

export type AdminPostRoutes = {
  "admin/room": PostRoute<AdminRoomData, PaginationPayload<IRoom>>;
  "admin/participant": PostRoute<
    AdminParticipantData,
    PaginationPayload<IParticipant>
  >;
};

export type PostRoutes = PublicPostRoutes & AdminPostRoutes;
