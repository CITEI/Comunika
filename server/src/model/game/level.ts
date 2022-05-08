import mongoose from "mongoose";
import { CategoryDocument } from "./category";

export interface LevelInput {
  name: string;
}

export const LevelSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2 },
  next: {
    type: mongoose.Types.ObjectId,
    default: null,
    index: true, // required to avoid doubly linked list
    ref: "Level",
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

export interface LevelDocument extends mongoose.Document, LevelInput {
  childrenHead: mongoose.PopulatedDoc<CategoryDocument> | null;
  childrenTail: mongoose.PopulatedDoc<CategoryDocument> | null;
  next: mongoose.PopulatedDoc<LevelDocument> | null;
}

export const Level = mongoose.model<LevelDocument>("Level", LevelSchema);
