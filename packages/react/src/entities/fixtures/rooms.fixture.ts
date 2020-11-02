import type { RawParticipant } from "../Participant";
import { RawRoom, RoomState } from "../Room";
import { generateRawParticipant } from "./participants.fixture";

interface GenerateRawParticipantOptions {
  name?: string;
  localParticipant?: RawParticipant;
  state?: RoomState;
}

export function generateRawRoom(
  options?: GenerateRawParticipantOptions,
): RawRoom {
  const name = options?.name ?? "saloon";
  const localParticipant =
    options?.localParticipant ??
    generateRawParticipant({ identity: "moroine" });
  const state = options?.state ?? RoomState.connected;
  const room = new RawRoom(name, localParticipant, state);

  return room;
}
