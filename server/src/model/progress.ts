import mongoose from "mongoose";
import { BoxDocument, BoxSchema } from "./box";

export interface ProgressInput {
  available: Available[];
  box: BoxDocument[];
  history: BoxDocument[];
}

export interface Available {
  id: string,
  value: boolean
}

export const ProgressSchema = new mongoose.Schema(
  {
    available: [{
      id: {
        type: String, 
        required: true
      },
      value: {
        type: Boolean,
        required: true,
        default: null,
      }
    }],
    box: [
      {
        type: BoxSchema,
        required: true,
        default: []
      }
    ],
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