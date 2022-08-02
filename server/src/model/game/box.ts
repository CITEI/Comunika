import mongoose from "mongoose";
import { MIN_STRING_LENGTH } from "../../pre-start/constants";
import { StageDocument } from "./stage";
import { ActivityDocument } from "./activity";

export interface BoxInput {
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  stage: mongoose.PopulatedDoc<StageDocument>;
}

export const BoxSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: MIN_STRING_LENGTH },
  description: { type: String, required: false, minlength: MIN_STRING_LENGTH },
  activities: [{ type: mongoose.Types.ObjectId, ref: "Activity", required: true }],
  stage: {
    type: mongoose.Types.ObjectId,
    ref: "Stage",
    required: true,
    index: true,
  },
  next: {
    type: mongoose.Types.ObjectId,
    ref: "Box",
    index: true,
    required: false,
    default: null,
  },
});

export interface BoxDocument extends mongoose.Document, BoxInput {
  activities: mongoose.PopulatedDoc<ActivityDocument>[];
  next: mongoose.PopulatedDoc<BoxDocument> | null;
}

export const Box = mongoose.model<BoxDocument>(
  "Box",
  BoxSchema
);
