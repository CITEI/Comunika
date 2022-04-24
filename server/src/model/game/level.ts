import mongoose from "mongoose";
import { ICategoryDocument } from "./category";

export interface ILevel {
  name: string;
  next?: mongoose.PopulatedDoc<ILevelDocument>;
}

export const LevelSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2 },
  next: {
    type: mongoose.Types.ObjectId,
    default: null,
    index: true, // required to avoid doubly linked list
    ref: "Level",
  },
  categories: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
      default: [],
    },
  ],
});

export interface ILevelDocument extends mongoose.Document, ILevel {
  categories: mongoose.PopulatedDoc<ICategoryDocument>[];
}

export const Level = mongoose.model<ILevelDocument>("Level", LevelSchema);
