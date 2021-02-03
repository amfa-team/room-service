import type { Document } from "mongoose";
import { Schema } from "mongoose";
import type { RoomStatusEvent } from "../../../twilio/webhook";

interface IRoomStatusDocument extends Document {
  id: string;
  event: RoomStatusEvent | null;
  rawEvent: string;
  success: boolean;
}

const RoomStatusSchema: Schema = new Schema(
  {
    event: {
      type: Schema.Types.Mixed,
      required: false,
      default: null,
    },
    rawEvent: {
      type: Schema.Types.String,
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

export type { IRoomStatusDocument };
export { RoomStatusSchema };
