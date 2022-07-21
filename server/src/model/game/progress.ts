import mongoose from "mongoose";
import { BoxDocument, BoxSchema } from "./box";
import { CategoryDocument } from "./category";
import { LevelDocument } from "./level";

export interface ProgressInput {
  level: mongoose.PopulatedDoc<LevelDocument>;
  category: mongoose.PopulatedDoc<CategoryDocument>;
  box: BoxDocument;
  history: BoxDocument[];
}

export const ProgressSchema = new mongoose.Schema(
  {
    level: {
      type: mongoose.Types.ObjectId,
      ref: "Level",
      required: true,
      default: null,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
      default: null,
    },
    box: {
      type: BoxSchema,
      required: true,
      default: null,
    },
    history: [
      {
        type: BoxSchema,
        required: true,
        default: [],
      },
    ],
  },
  { _id: false }
);

export interface ProgressDocument extends ProgressInput {}
