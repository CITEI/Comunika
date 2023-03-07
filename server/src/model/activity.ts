import {
  NodeSchema,
  NodeInput,
  QuestionNodeInput,
  QuestionNodeSchema,
  NodeDiscriminators,
} from "./node";
import mongoose from "mongoose";
import {
  MIN_NODES,
  MIN_QUESTION_NODES,
  MIN_STRING_LENGTH,
} from "../pre-start/constants";

export interface ActivityInput {
  name: string;
  nodes: Array<{ type: string } & NodeInput & { [key: string]: any }>;
  questionNodes: Array<
    { type: string } & QuestionNodeInput & { [key: string]: any }
  >;
}

export const ActivitySchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: MIN_STRING_LENGTH },
  nodes: [{ type: NodeSchema, required: true, minlength: MIN_NODES }],
  questionCount: { type: Number, default: 0 },
  questionNodes: [
    { type: QuestionNodeSchema, required: true, minlength: MIN_QUESTION_NODES },
  ],
});

ActivitySchema.pre("save", function (next) {
  this.questionCount = this.questionNodes.length;
  next();
});

/*
Registering discriminators
The section below allow us to simulate node inheritance into the db
 */
const Nodes = ActivitySchema.path<mongoose.Schema.Types.Subdocument>("nodes");
for (const [name, schema] of Object.entries(NodeDiscriminators))
  Nodes.discriminator(name, schema);

export interface ActivityDocument extends mongoose.Document, ActivityInput {
  questionCount: number;
}

export const Activity = mongoose.model<ActivityDocument>("Activity", ActivitySchema);
