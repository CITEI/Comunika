import mongoose from "mongoose";
import { MIN_STRING_LENGTH } from "../pre-start/constants";
import { ActivityDocument } from "./activity";

export interface ModuleInput {
  name: string;
  image: string;
  imageAlt: string;
}

export const ModuleSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: MIN_STRING_LENGTH },
  image: { type: String, required: false, minlength: MIN_STRING_LENGTH },
  imageAlt: { type: String, required: true, minlength: MIN_STRING_LENGTH },
  activities: [{ type: mongoose.Types.ObjectId, ref: "Activity", required: true }],
  alternativeActivities: [{ type: mongoose.Types.ObjectId, ref: "Activity", required: true }],
  previous: {
    type: mongoose.Types.ObjectId,
    default: null,
    index: true, // required to avoid doubly linked list
    ref: "Module",
  },
});

export interface ModuleDocument extends mongoose.Document, ModuleInput {
  activities: mongoose.PopulatedDoc<ActivityDocument>[];
  alternativeActivities: mongoose.PopulatedDoc<ActivityDocument>[];
  previous: mongoose.PopulatedDoc<ModuleDocument> | null;
}

export const Module = mongoose.model<ModuleDocument>("Module", ModuleSchema);
