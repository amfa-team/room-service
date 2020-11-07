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

export type GetRoutes = {
  // empty
};

export type PostRoutes = {
  join: PostRoute<JoinData, JoinPayload>;
};
