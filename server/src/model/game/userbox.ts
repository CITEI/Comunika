import mongoose from "mongoose";
import { CategoryDocument } from "./category";
import { ActivityDocument } from "./activity";

interface UserBoxActivityInput {
  answers: boolean[];
  activity: mongoose.PopulatedDoc<ActivityDocument>;
}

export interface UserBoxInput {
  category: mongoose.PopulatedDoc<CategoryDocument>;
  activities: UserBoxActivityInput[];
}

export const UserBoxSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    activities: [
      {
        activity: { type: mongoose.Types.ObjectId, required: true },
        answers: [{ type: Boolean, required: true }],
      },
    ],
  },
  { _id: false }
);

export interface UserBoxDocument extends UserBoxInput {}
