import { ParticipantStatus } from "@amfa-team/types";
import { ParticipantModel } from "../mongo/model/participant";
import { disconnectParticipant } from "../service/lifecycleService";

export async function cronController() {
  const participants = await ParticipantModel.find({
    status: ParticipantStatus.pending,
    statusValidUntil: { $lt: new Date() },
  });

  await Promise.all([
    participants.map(async (p) => disconnectParticipant(p, true)),
  ]);
}
