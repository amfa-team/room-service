import type { IRoom } from "@amfa-team/room-service-types";
import type { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";

interface IRoomDocument extends IRoom, Document {
  _id: string;
  id: string;
}

const RoomSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      required: true,
      description: "room unique id, it's same as twilio SID",
    },
    name: {
      type: String,
      required: true,
      index: true,
      description: "room unique name",
    },
    spaceId: {
      type: String,
      required: true,
      description: "Space id",
    },
    participants: {
      type: [Schema.Types.ObjectId],
      ref: "Participant",
      default: [],
    },
    size: {
      type: Number,
      required: true,
      default: 0,
    },
    live: {
      type: Boolean,
      required: true,
      default: true,
    },
    webhookUrl: {
      type: String,
      required: true,
    },
  },
  {
    minimize: false,
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  },
);
RoomSchema.index(
  {
    spaceId: 1,
    webhookUrl: 1,
    live: 1,
    size: -1,
  },
  { name: "room-webhookUrl-space-size" }, // for joinRandomRoom
);
RoomSchema.index(
  {
    _id: 1,
    webhookUrl: 1,
  },
  { name: "room-webhook" }, // for onParticipantDisconnected
);

const RoomModel = mongoose.model<IRoomDocument>("Room", RoomSchema);

export type { IRoomDocument };
export { RoomModel };
