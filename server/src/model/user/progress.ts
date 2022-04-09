import mongoose from "mongoose";
import { IBox } from "../game/box";
import { ICategory } from "../game/category";
import { ILevel } from "../game/level";

export interface IProgress {
  level: mongoose.PopulatedDoc<ILevel>;
  category: mongoose.PopulatedDoc<ICategory>;
  box: mongoose.PopulatedDoc<IBox>;
  history: mongoose.PopulatedDoc<IBox>[];
}

export const ProgressSchema = new mongoose.Schema<IProgress>({
  level: {
    type: mongoose.Types.ObjectId,
    ref: "Level",
    required: true,
    default: null,
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
    required: true,
    default: null,
  },
  box: {
    type: mongoose.Types.ObjectId,
    ref: "Box",
    required: true,
    default: null,
  },
  history: [{ type: mongoose.Types.ObjectId, ref: "Box", required: true }],
});
