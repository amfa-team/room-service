import type { IRoom } from "@amfa-team/types";
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
      unique: true,
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
    _id: 1,
    spaceId: 1,
    size: -1,
  },
  { name: "room-space-size" }, // for joinRandomRoom
);

const RoomModel = mongoose.model<IRoomDocument>("Room", RoomSchema);

export type { IRoomDocument };
export { RoomModel };
