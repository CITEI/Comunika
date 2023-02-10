import mongoose from "mongoose";
import { ModuleDocument } from "./module";
import { ActivityDocument } from "./activity";

interface BoxActivityInput {
  answers: boolean[];
  activity: mongoose.PopulatedDoc<ActivityDocument>;
}

export interface BoxInput {
  module: mongoose.PopulatedDoc<ModuleDocument>;
  activities: BoxActivityInput[];
  attempt: number;
}

export const BoxSchema = new mongoose.Schema(
  {
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
        answers: [{ type: Boolean, required: true }],
      },
    ],
  },
  { _id: false }
);

export interface BoxDocument extends BoxInput {}
