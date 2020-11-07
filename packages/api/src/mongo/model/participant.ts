import type { IParticipant } from "@amfa-team/types";
import { ParticipantStatus } from "@amfa-team/types";
import type { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";

interface IParticipantDocument extends IParticipant, Document {
  _id: string;
  id: string;
}

const ParticipantSchema: Schema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: [
        ParticipantStatus.connected,
        ParticipantStatus.disconnected,
        ParticipantStatus.pending,
      ],
      required: true,
    },
    statusValidUntil: {
      type: Date,
      required: false,
      default: null,
    },
    room: {
      type: String,
      ref: "Room",
      required: false,
      default: null,
    },
  },
  {
    minimize: false,
    timestamps: true,
  },
);

const ParticipantModel = mongoose.model<IParticipantDocument>(
  "Participant",
  ParticipantSchema,
);

export type { IParticipantDocument };
export { ParticipantModel };
