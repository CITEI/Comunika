import {
  NodeSchema,
  NodeInput,
  QuestionNodeInput,
  QuestionNodeSchema,
  NodeDiscriminators,
} from "./node";
import mongoose from "mongoose";
import { MIN_STRING_LENGTH } from "src/pre-start/constants";

export interface TaskInput {
  name: string;
  description: string;
  nodes: Array<{ type: string } & NodeInput & { [key: string]: any }>;
  questionNodes: Array<
    { type: string } & QuestionNodeInput & { [key: string]: any }
  >;
}

export const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: MIN_STRING_LENGTH },
  description: { type: String, required: true },
  nodes: [{ type: NodeSchema, required: true, minlength: 1 }],
  questionCount: { type: Number, default: 0 },
  questionNodes: [{ type: QuestionNodeSchema, required: true, minlength: 1 }],
});

TaskSchema.pre("save", async function (next) {
  this.questionCount = this.questionNodes.length
  next();
});

/*
Registering discriminators
The section below allow us to simulate node inheritance into the db
 */
const Nodes = TaskSchema.path<mongoose.Schema.Types.Subdocument>("nodes");
for (const [name, schema] of Object.entries(NodeDiscriminators))
  Nodes.discriminator(name, schema);

export interface TaskDocument extends mongoose.Document, TaskInput {
  questionCount: number;
}

export const Task = mongoose.model<TaskDocument>("Task", TaskSchema);
