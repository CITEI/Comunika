import mongoose from "mongoose";
import { MIN_STRING_LENGTH } from "../../pre-start/constants";
import { CategoryDocument } from "./category";

export interface StageInput {
  name: string;
  description: string;
  image: string;
  imageAlt: string;
}

export const StageSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: MIN_STRING_LENGTH },
  description: { type: String, required: true, minlength: MIN_STRING_LENGTH },
  image: { type: String, required: false, minlength: MIN_STRING_LENGTH },
  imageAlt: { type: String, required: true, minlength: MIN_STRING_LENGTH },
  next: {
    type: mongoose.Types.ObjectId,
    default: null,
    index: true, // required to avoid doubly linked list
    ref: "Stage",
  },
  childrenHead: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
    required: false,
    default: null,
  },
  childrenTail: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
    required: false,
    default: null,
  },
});

export interface StageDocument extends mongoose.Document, StageInput {
  childrenHead: mongoose.PopulatedDoc<CategoryDocument> | null;
  childrenTail: mongoose.PopulatedDoc<CategoryDocument> | null;
  next: mongoose.PopulatedDoc<StageDocument> | null;
}

export const Stage = mongoose.model<StageDocument>("Stage", StageSchema);
