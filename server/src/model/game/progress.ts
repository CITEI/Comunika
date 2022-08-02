import mongoose from "mongoose";
import { UserBoxDocument, UserBoxSchema } from "./userbox";
import { CategoryDocument } from "./category";
import { StageDocument } from "./stage";

export interface ProgressInput {
  stage: mongoose.PopulatedDoc<StageDocument>;
  category: mongoose.PopulatedDoc<CategoryDocument>;
  userbox: UserBoxDocument;
  history: UserBoxDocument[];
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
    userbox: {
      type: UserBoxSchema,
      required: true,
      default: null,
    },
    history: [
      {
        type: UserBoxSchema,
        required: true,
        default: [],
      },
    ],
  },
  { _id: false }
);

export interface ProgressDocument extends ProgressInput {}
