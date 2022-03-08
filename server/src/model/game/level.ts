import mongoose from "mongoose";
import { ICategory } from "./category";

export interface ILevel extends mongoose.Document {
  name: string;
  layer: number;
  categories: mongoose.PopulatedDoc<ICategory>[];
}

export const LevelSchema = new mongoose.Schema<ILevel>({
  name: { type: String, required: true, minlength: 2 },
  layer: { type: Number, required: true, index: true, unique: true },
  categories: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  ],
});

export const Level = mongoose.model<ILevel>("Level", LevelSchema);
