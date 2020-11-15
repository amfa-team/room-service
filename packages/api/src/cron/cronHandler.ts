import { ParticipantStatus } from "@amfa-team/types";
import { logger } from "../io/logger";
import { ParticipantModel } from "../mongo/model/participant";
import type { IRoomDocument } from "../mongo/model/room";
import { RoomModel } from "../mongo/model/room";
import { disconnectParticipant } from "../service/lifecycleService";
import { getTwilioRoomState } from "../twilio/client";

async function validateRoom(room: IRoomDocument) {
  try {
    const [twilioState, participants] = await Promise.all([
      room.live
        ? getTwilioRoomState(room.id)
        : { live: false, participants: [] },
      ParticipantModel.find({ _id: { $in: room.participants } }),
    ]);

    const tasks = [];

    if (twilioState) {
      if (room.live && !twilioState.live) {
        tasks.push(
          RoomModel.findOneAndUpdate(
            { _id: room.id },
            { $set: { live: false, participants: [] } },
          ).catch((e) =>
            logger.error(
              e,
              "cron.validateRoom: unable to update room live status",
            ),
          ),
        );
      }

      for (let i = 0; i < twilioState.participants.length; i += 1) {
        if (!room.participants.includes(twilioState.participants[i])) {
          // This should never happen
          logger.error(
            new Error(
              "cron.validateRoom: participant live but not in room instance",
            ),
          );
          tasks.push(
            ParticipantModel.findById(twilioState.participants[i])
              .then(async (p) => {
                if (p) {
                  await disconnectParticipant(p, true);
                }
              })
              .catch((e) =>
                logger.error(
                  e,
                  "cron.validateRoom: unable to disconnect participant",
                ),
              ),
          );
        }
      }

      for (let i = 0; i < participants.length; i += 1) {
        if (!twilioState.participants.includes(participants[i].id)) {
          // If participant is pending do nothing, as it might be a race condition
          if (participants[i].status === ParticipantStatus.connected) {
            logger.error(
              new Error(
                "cron.validateRoom: participant disconnected without error",
              ),
            );

            tasks.push(
              disconnectParticipant(participants[i], true).catch((e) =>
                logger.error(
                  e,
                  "cron.validateRoom: unable to disconnect participant",
                ),
              ),
            );
          }
        }
      }

      await Promise.all(tasks);
    }
  } catch (e) {
    logger.error(e, "cronHandler.validateRoom: fail");
  }
}

async function validateParticipants() {
  try {
    const [p1, p2] = await Promise.all([
      ParticipantModel.find({
        status: ParticipantStatus.pending,
        statusValidUntil: { $lt: new Date() },
      }),
      ParticipantModel.find({
        status: ParticipantStatus.disconnected,
        room: { $ne: null },
      }),
    ]);

    if (p1.length > 0) {
      logger.error(
        new Error("cron.validateParticipants: found pending participants"),
      );
    }
    if (p2.length > 0) {
      logger.error(
        new Error(
          "cron.validateParticipants: found disconnected participants without room",
        ),
      );
    }
    await Promise.all(
      [...p1, ...p2].map(async (p) => disconnectParticipant(p)),
    );
  } catch (e) {
    logger.error(e);
  }
}

async function validateRooms() {
  const { modifiedCount } = await RoomModel.collection.updateMany({}, [
    {
      $set: {
        size: { $size: "$participants" },
      },
    },
  ]);
  if (modifiedCount > 0) {
    logger.error(new Error("cronHandler.validateRooms: invalid data"), null, {
      modifiedCount,
    });
  }

  const now = Date.now();
  const rooms = await RoomModel.find({
    updatedAt: {
      $lt: new Date(now - 60_000),
    },
  });
  await Promise.all(rooms.map(validateRoom));
}

export async function cronController() {
  await validateParticipants();
  await validateRooms();
}
