import mongoose from "mongoose";
import { MIN_STRING_LENGTH } from "src/pre-start/constants";
import { LevelDocument } from "./level";
import { TaskDocument } from "./task";

export interface CategoryInput {
  name: string;
  description: string;
  iconUrl: string;
  level: mongoose.PopulatedDoc<LevelDocument>;
}

export const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: MIN_STRING_LENGTH },
  description: { type: String, required: false },
  iconUrl: { type: String, required: true },
  tasks: [{ type: mongoose.Types.ObjectId, ref: "Task", required: true }],
  level: {
    type: mongoose.Types.ObjectId,
    ref: "Level",
    required: true,
    index: true,
  },
  next: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
    index: true,
    required: false,
    default: null,
  },
});

export interface CategoryDocument extends mongoose.Document, CategoryInput {
  tasks: mongoose.PopulatedDoc<TaskDocument>[];
  next: mongoose.PopulatedDoc<CategoryDocument> | null;
}

export const Category = mongoose.model<CategoryDocument>(
  "Category",
  CategorySchema
);
