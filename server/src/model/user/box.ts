import mongoose from "mongoose";
import { CategoryDocument } from "../game/category";
import { TaskDocument } from "../game/task";

interface BoxTaskInput {
  answer: boolean;
  task: mongoose.PopulatedDoc<TaskDocument>;
}

export interface BoxInput {
  category: mongoose.PopulatedDoc<CategoryDocument>;
  tasks: BoxTaskInput[];
}

export const BoxSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tasks: [
      {
        answer: { type: Boolean, required: true, default: false },
        task: { type: mongoose.Types.ObjectId, required: true },
      },
    ],
  },
  { _id: false }
);

export interface BoxDocument extends BoxInput {}
