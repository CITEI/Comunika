import mongoose from "mongoose";
import { MIN_STRING_LENGTH } from "../../pre-start/constants";
import { BoxDocument } from "./box";

export interface ModuleInput {
  name: string;
  description: string;
  image: string;
  imageAlt: string;
}

export const ModuleSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: MIN_STRING_LENGTH },
  description: { type: String, required: true, minlength: MIN_STRING_LENGTH },
  image: { type: String, required: false, minlength: MIN_STRING_LENGTH },
  imageAlt: { type: String, required: true, minlength: MIN_STRING_LENGTH },
  next: {
    type: mongoose.Types.ObjectId,
    default: null,
    index: true, // required to avoid doubly linked list
    ref: "Module",
  },
  childrenHead: {
    type: mongoose.Types.ObjectId,
    ref: "Box",
    required: false,
    default: null,
  },
  childrenTail: {
    type: mongoose.Types.ObjectId,
    ref: "Box",
    required: false,
    default: null,
  },
});

export interface ModuleDocument extends mongoose.Document, ModuleInput {
  childrenHead: mongoose.PopulatedDoc<BoxDocument> | null;
  childrenTail: mongoose.PopulatedDoc<BoxDocument> | null;
  next: mongoose.PopulatedDoc<ModuleDocument> | null;
}

export const Module = mongoose.model<ModuleDocument>("Module", ModuleSchema);
