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
  },
);

const RoomModel = mongoose.model<IRoomDocument>("Room", RoomSchema);

export type { IRoomDocument };
export { RoomModel };
