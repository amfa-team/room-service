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
    roomVisits: {
      type: [
        new Schema({
          id: {
            type: String,
            required: true,
          },
          duration: {
            type: Number,
            required: true,
          },
          timestamp: {
            type: Date,
            required: true,
          },
        }),
      ],
      required: false,
      default: [],
    },
  },
  {
    minimize: false,
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  },
);
ParticipantSchema.index(
  {
    status: 1,
    statusValidUntil: 1,
  },
  {
    name: "status_status-valid-until", // cronController
  },
);

const ParticipantModel = mongoose.model<IParticipantDocument>(
  "Participant",
  ParticipantSchema,
);

export type { IParticipantDocument };
export { ParticipantModel };
