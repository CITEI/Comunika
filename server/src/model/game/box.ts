import mongoose from "mongoose";
import { CategoryDocument } from "./category";
import { ActivityDocument } from "./activity";

interface BoxActivityInput {
  answers: boolean[];
  activity: mongoose.PopulatedDoc<ActivityDocument>;
}

export interface BoxInput {
  category: mongoose.PopulatedDoc<CategoryDocument>;
  activitys: BoxActivityInput[];
}

export const BoxSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    activitys: [
      {
        activity: { type: mongoose.Types.ObjectId, required: true },
        answers: [{ type: Boolean, required: true }],
      },
    ],
  },
  { _id: false }
);

export interface BoxDocument extends BoxInput {}
