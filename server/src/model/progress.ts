import mongoose from "mongoose";
import { BoxDocument, BoxSchema } from "./box";

export interface ProgressInput {
  available: Map<string, boolean>;
  box: Map<string, BoxDocument>;
  history: BoxDocument[];
}

export const ProgressSchema = new mongoose.Schema(
  {
    available: {
      type: Map,
      of: Boolean,
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