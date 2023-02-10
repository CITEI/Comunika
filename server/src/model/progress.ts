import mongoose from "mongoose";
import { BoxDocument, BoxSchema } from "./box";

export interface ProgressInput {
  availableModules: Array<string>;
  box: Map<string, BoxDocument>;
  history: BoxDocument[];
}

export const ProgressSchema = new mongoose.Schema(
  {
    availableModules: {
      type: Array<string>,
      require: true,
      default: [],
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