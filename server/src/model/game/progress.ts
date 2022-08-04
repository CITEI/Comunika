import mongoose from "mongoose";
import { UserBoxDocument, UserBoxSchema } from "./userbox";
import { BoxDocument } from "./box";
import { ModuleDocument } from "./module";

export interface ProgressInput {
  module: mongoose.PopulatedDoc<ModuleDocument>;
  box: mongoose.PopulatedDoc<BoxDocument>;
  userbox: UserBoxDocument;
  history: UserBoxDocument[];
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
      type: mongoose.Types.ObjectId,
      ref: "Box",
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
