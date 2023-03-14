import mongoose, { SchemaTypes } from "mongoose";
import { ModuleDocument } from "./module";
import { ActivityDocument } from "./activity";

interface BoxActivityInput {
  answers: (string | boolean)[];
  activity: mongoose.PopulatedDoc<ActivityDocument>;
}

export interface BoxInput {
  module: mongoose.PopulatedDoc<ModuleDocument>;
  activities: BoxActivityInput[];
  attempt: number;
  createdAt: Date;
  completedAt?: Date;
}

export const BoxSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      required: true
    },
    completedAt: {
      type: Date,
      required: false
    },
    module: {
      type: mongoose.Types.ObjectId,
      ref: "Module",
      required: false,
    },
    attempt: {
      type: Number,
      required: false,
      default: 0,
    },
    activities: [
      {
        activity: {
          type: mongoose.Types.ObjectId,
          ref: "Activity",
          required: true,
        },
        answers: [{ type: SchemaTypes.Mixed, required: true }],
      },
    ],
  },
  { _id: false }
);

export interface BoxDocument extends BoxInput {}
