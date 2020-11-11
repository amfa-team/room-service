import { ParticipantStatus } from "@amfa-team/types";
import { logger } from "../io/logger";
import { ParticipantModel } from "../mongo/model/participant";
import { disconnectParticipant } from "../service/lifecycleService";

export async function cronController() {
  try {
    const participants = await ParticipantModel.find({
      status: ParticipantStatus.pending,
      statusValidUntil: { $lt: new Date() },
    });

    await Promise.all([
      participants.map(async (p) => disconnectParticipant(p, true)),
    ]);
  } catch (e) {
    logger.error(e, "cronController: fail");
  }
}
