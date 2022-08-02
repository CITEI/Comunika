import mongoose from "mongoose";
import { BoxDocument } from "./box";
import { ActivityDocument } from "./activity";

interface UserBoxActivityInput {
  answers: boolean[];
  activity: mongoose.PopulatedDoc<ActivityDocument>;
}

export interface UserBoxInput {
  box: mongoose.PopulatedDoc<BoxDocument>;
  activities: UserBoxActivityInput[];
}

export const UserBoxSchema = new mongoose.Schema(
  {
    box: {
      type: mongoose.Types.ObjectId,
      ref: "Box",
      required: false,
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

export interface UserBoxDocument extends UserBoxInput {}
