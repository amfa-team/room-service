import type { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";
import type { RoomStatusEvent } from "../../twilio/webhook";

interface IRoomStatusDocument extends Document {
  id: string;
  event: RoomStatusEvent | Record<string, string>;
  success: boolean;
}

const RoomStatusSchema: Schema = new Schema(
  {
    event: {
      type: Schema.Types.Mixed,
      required: true,
    },
    success: {
      type: Boolean,
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

const RoomStatusModel = mongoose.model<IRoomStatusDocument>(
  "RoomStatus",
  RoomStatusSchema,
);

export type { IRoomStatusDocument };
export { RoomStatusModel };
