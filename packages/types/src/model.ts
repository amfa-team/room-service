export enum ParticipantStatus {
  "connected" = "connected",
  "disconnected" = "disconnected",
  "pending" = "pending",
}

type RoomVisit = {
  id: string;
  duration: number;
  timestamp: Date;
};

export interface IParticipant {
  _id: string;
  id: string;
  status: ParticipantStatus;
  // This is required when setting a status to pending before the participant is actually connected
  // pending has a validity, see it as a reservation for a fix duration only
  statusValidUntil: Date | null;
  room: string | null;
  roomVisits: RoomVisit[];
}

export interface IRoom {
  _id: string;
  id: string;
  name: string;
  spaceId: string;
  participants: string[];
}
