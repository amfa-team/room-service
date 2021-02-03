import { ParticipantStatus } from "@amfa-team/room-service-types";
import { logger } from "../services/io/logger";
import { disconnectParticipant } from "../services/lifecycleService";
import { getModels } from "../services/mongo/client";
import type { IRoomDocument } from "../services/mongo/model/room";
import { getTwilioRoomState } from "../twilio/client";

async function validateRoom(room: IRoomDocument) {
  try {
    const { RoomModel, ParticipantModel } = await getModels();
    const [twilioState, participants] = await Promise.all([
      room.live
        ? getTwilioRoomState(room.id)
        : { live: false, participants: [] },
      ParticipantModel.find({ _id: { $in: room.participants } }),
    ]);

    const tasks: Promise<unknown>[] = [];

    if (twilioState) {
      if (room.live && !twilioState.live) {
        tasks.push(
          RoomModel.findOneAndUpdate(
            { _id: room.id },
            { $set: { live: false, participants: [] } },
          ).catch((e: Error) =>
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
                  await disconnectParticipant(p);
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
          if (participants[i].status !== ParticipantStatus.pending) {
            logger.error(
              new Error(
                "cron.validateRoom: participant disconnected without error",
              ),
            );

            tasks.push(
              // do not use disconnect here, in case participant.room !== room.id
              Promise.all([
                RoomModel.findOneAndUpdate(
                  {
                    _id: room.id,
                    participants: { $in: [participants[i].id] },
                  },
                  {
                    $inc: { size: -1 },
                    $pull: { participants: participants[i].id },
                  },
                  { new: true },
                ),
                ParticipantModel.findOneAndUpdate(
                  // we need to use room filter to prevent race condition when shuffle is used
                  // i.e. it's already connected to another room
                  { _id: participants[i].id, room: room.id },
                  {
                    $set: {
                      status: ParticipantStatus.disconnected,
                      statusValidUntil: null,
                      room: null,
                    },
                  },
                ),
              ]).catch((e) =>
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
    const { ParticipantModel } = await getModels();
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
  const { RoomModel } = await getModels();
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
