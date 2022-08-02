import mongoose from "mongoose";
import { BoxDocument, BoxSchema } from "./box";
import { CategoryDocument } from "./category";
import { StageDocument } from "./stage";

export interface ProgressInput {
  stage: mongoose.PopulatedDoc<StageDocument>;
  category: mongoose.PopulatedDoc<CategoryDocument>;
  box: BoxDocument;
  history: BoxDocument[];
}

export const ProgressSchema = new mongoose.Schema(
  {
    stage: {
      type: mongoose.Types.ObjectId,
      ref: "Stage",
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
