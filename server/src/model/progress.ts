import mongoose from "mongoose";
import { BoxDocument, BoxSchema } from "./box";

export interface ProgressInput {
  box: Map<string, BoxType>;
  history: BoxDocument[];
}

export interface BoxType {
  done: boolean;
  data: BoxDocument;
}

export const ProgressSchema = new mongoose.Schema(
  {
    box: {
      type: Map,
      default: new Map(),
      of: {
        _id: false,
        done: {
          type: Boolean,
          required: true
        },
        data: {
          type: BoxSchema,
          required: false
        },
      },
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