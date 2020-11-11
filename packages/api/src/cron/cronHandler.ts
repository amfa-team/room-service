import { ParticipantStatus } from "@amfa-team/types";
import { logger } from "../io/logger";
import { ParticipantModel } from "../mongo/model/participant";
import { disconnectParticipant } from "../service/lifecycleService";

export async function cronController() {
  logger.info("cronController: start");
  const participants = await ParticipantModel.find({
    status: ParticipantStatus.pending,
    statusValidUntil: { $lt: new Date() },
  });

  logger.info("cronController: will update", { participants });

  await Promise.all([
    participants.map(async (p) => disconnectParticipant(p, true)),
  ]);

  logger.info("cronController: will did", { participants });
}
