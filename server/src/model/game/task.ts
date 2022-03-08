import { NodeSchema, INode } from "./node";
import mongoose from "mongoose";

export interface ITask extends mongoose.Document {
  name: string;
  description: string;
  nodes: INode[];
}

export const TaskSchema = new mongoose.Schema<ITask>({
  name: { type: String, required: true, minlength: 2 },
  description: { type: String, required: false },
  nodes: [{ type: NodeSchema, required: true, minlength: 1 }],
});

export const NodesField =
  TaskSchema.path<mongoose.Schema.Types.Subdocument>("nodes");

export const Task = mongoose.model("Task", TaskSchema);
