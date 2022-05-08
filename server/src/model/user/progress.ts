import mongoose from "mongoose";
import { BoxDocument, BoxSchema } from "./box";
import { CategoryDocument } from "../game/category";
import { LevelDocument } from "../game/level";

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
      ref: "Box",
      required: true,
      default: null,
    },
    history: [
      {
        type: BoxSchema,
        ref: "Box",
        required: true,
        default: [],
      },
    ],
  },
  { _id: false }
);

export interface ProgressDocument extends ProgressInput {}
