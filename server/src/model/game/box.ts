import mongoose from "mongoose";
import { CategoryDocument } from "./category";
import { TaskDocument } from "./task";

interface BoxTaskInput {
  answers: boolean[];
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
      required: false,
    },
    tasks: [
      {
        task: { type: mongoose.Types.ObjectId, required: true },
        answers: [{ type: Boolean, required: true }],
      },
    ],
  },
  { _id: false }
);

export interface BoxDocument extends BoxInput {}
