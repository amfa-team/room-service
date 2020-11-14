import type { ILocalParticipant } from "../Participant";
import { RawRoom, RoomState } from "../Room";
import { generateRawLocalParticipant } from "./participants.fixture";

interface GenerateRawParticipantOptions {
  name?: string;
  localParticipant?: ILocalParticipant;
  state?: RoomState;
}

export function generateRawRoom(
  options?: GenerateRawParticipantOptions,
): RawRoom {
  const name = options?.name ?? "saloon";
  const localParticipant =
    options?.localParticipant ??
    generateRawLocalParticipant({ identity: "moroine" });
  const state = options?.state ?? RoomState.connected;
  const room = new RawRoom(name, localParticipant, state);

  return room;
}
