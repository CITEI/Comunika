import mongoose from "mongoose";
import { ILevel } from "./level";
import { ITask } from "./task";

export interface ICategory extends mongoose.Document {
  name: string;
  description: string;
  iconUrl: string;
  layer: number;
  tasks: mongoose.PopulatedDoc<ITask>[];
  level: mongoose.PopulatedDoc<ILevel>;
}

export const CategorySchema = new mongoose.Schema<ICategory>({
  name: { type: String, required: true, minlength: 2 },
  description: { type: String, required: false },
  iconUrl: { type: String, required: true },
  layer: { type: Number, required: true, index: true, unique: true },
  tasks: [{ type: mongoose.Types.ObjectId, ref: "Task", required: true }],
  level: { type: mongoose.Types.ObjectId, ref: "Level", required: true },
});

export const Category = mongoose.model("Category", CategorySchema);
