import mongoose from "mongoose";
import { BoxDocument, BoxSchema } from "./box";
import { ModuleDocument } from "./module";

export interface ProgressInput {
  module: mongoose.PopulatedDoc<ModuleDocument>;
  box: Map<string, BoxDocument>;
  history: BoxDocument[];
}

export const ProgressSchema = new mongoose.Schema(
  {
    module: {
      type: mongoose.Types.ObjectId,
      ref: "Module",
      required: true,
      default: null,
    },
    box: {
      type: Map,
      of: BoxSchema,
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
