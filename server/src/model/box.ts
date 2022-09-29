import mongoose from "mongoose";
import { StageDocument } from "./stage";
import { ActivityDocument } from "./activity";

interface BoxActivityInput {
  answers: boolean[];
  activity: mongoose.PopulatedDoc<ActivityDocument>;
}

export interface BoxInput {
  stage: mongoose.PopulatedDoc<StageDocument>;
  activities: BoxActivityInput[];
  attempt: number;
}

export const BoxSchema = new mongoose.Schema(
  {
    stage: {
      type: mongoose.Types.ObjectId,
      ref: "Stage",
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
