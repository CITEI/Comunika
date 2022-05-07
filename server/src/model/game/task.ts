import {
  NodeSchema,
  NodeInput,
  QuestionNodeInput,
  QuestionNodeSchema,
  NodeDiscriminators,
  QuestionNodeDiscriminators,
} from "./node";
import mongoose from "mongoose";

export interface TaskInput {
  name: string;
  description: string;
  nodes: Array<{ type: string } & NodeInput & { [key: string]: any }>;
  answer_nodes: Array<
    { type: string } & QuestionNodeInput & { [key: string]: any }
  >;
}

export const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2 },
  description: { type: String, required: true },
  nodes: [{ type: NodeSchema, required: true, minlength: 1 }],
  question_nodes: [{ type: QuestionNodeSchema, required: true, minlength: 1 }],
});

/*
Registering discriminators
The section below allow us to simulate node inheritance into the db
 */
const Nodes = TaskSchema.path<mongoose.Schema.Types.Subdocument>("nodes");
for (const [name, schema] of Object.entries(NodeDiscriminators))
  Nodes.discriminator(name, schema);

const QuestionNodes =
  TaskSchema.path<mongoose.Schema.Types.Subdocument>("question_nodes");
for (const [name, schema] of Object.entries(QuestionNodeDiscriminators))
  QuestionNodes.discriminator(name, schema);

export interface TaskDocument extends mongoose.Document, TaskInput {}

export const Task = mongoose.model<TaskDocument>("Task", TaskSchema);
