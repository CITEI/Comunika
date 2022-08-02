import mongoose from "mongoose";
import { MIN_STRING_LENGTH } from "../../pre-start/constants";
import { StageDocument } from "./stage";
import { TaskDocument } from "./task";

export interface CategoryInput {
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  stage: mongoose.PopulatedDoc<StageDocument>;
}

export const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: MIN_STRING_LENGTH },
  description: { type: String, required: false, minlength: MIN_STRING_LENGTH },
  image: { type: String, required: false, minlength: MIN_STRING_LENGTH },
  imageAlt: { type: String, required: true, minlength: MIN_STRING_LENGTH },
  tasks: [{ type: mongoose.Types.ObjectId, ref: "Task", required: true }],
  stage: {
    type: mongoose.Types.ObjectId,
    ref: "Stage",
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
