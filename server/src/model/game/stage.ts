import mongoose from "mongoose";
import { MIN_STRING_LENGTH } from "../../pre-start/constants";
import { ModuleDocument } from "./module";
import { ActivityDocument } from "./activity";

export interface StageInput {
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  module: mongoose.PopulatedDoc<ModuleDocument>;
}

export const StageSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: MIN_STRING_LENGTH },
  description: { type: String, required: false, minlength: MIN_STRING_LENGTH },
  activities: [{ type: mongoose.Types.ObjectId, ref: "Activity", required: true }],
  module: {
    type: mongoose.Types.ObjectId,
    ref: "Module",
    required: true,
    index: true,
  },
  next: {
    type: mongoose.Types.ObjectId,
    ref: "Stage",
    index: true,
    required: false,
    default: null,
  },
});

export interface StageDocument extends mongoose.Document, StageInput {
  activities: mongoose.PopulatedDoc<ActivityDocument>[];
  next: mongoose.PopulatedDoc<StageDocument> | null;
}

export const Stage = mongoose.model<StageDocument>(
  "Stage",
  StageSchema
);
