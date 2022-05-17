import mongoose from "mongoose";
import { CategoryDocument } from "./category";
import { TaskDocument } from "./task";

interface BoxTaskInput {
  hits: number;
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
        hits: { type: Number, required: true, default: 0 },
        task: { type: mongoose.Types.ObjectId, required: true },
      },
    ],
  },
  { _id: false }
);

export interface BoxDocument extends BoxInput {}
