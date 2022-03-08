import mongoose from "mongoose";
import { ICategory } from "./category";
import { ITask } from "./task";

// task with answer sub-document
export interface IBoxTask extends mongoose.Document {
  task: mongoose.PopulatedDoc<ITask>;
  answer: boolean;
}

export const BoxTaskSchema = new mongoose.Schema<IBoxTask>({
  task: { type: mongoose.Types.ObjectId, ref: "Task", required: true },
  answer: { type: Boolean, required: true, default: false },
});

// box
export interface IBox extends mongoose.Document {
  category: mongoose.PopulatedDoc<ICategory>;
  tasks: IBoxTask[];
}

export const BoxSchema = new mongoose.Schema<IBox>({
  category: { type: mongoose.Types.ObjectId, ref: "Category", required: true },
  tasks: [{ type: BoxTaskSchema, required: true, minlength: 1 }],
});

// methods
BoxSchema.methods.calculateScore = function (): number {
  // trues / total
  return (
    (this.tasks as IBoxTask[]).filter((el) => el.answer).length /
    (this.tasks as IBoxTask[]).length
  );
};

export const Box = mongoose.model("Box", BoxSchema);
