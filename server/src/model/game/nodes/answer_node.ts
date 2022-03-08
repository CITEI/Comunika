import mongoose from "mongoose";
import { INode, NodeSchemaInit } from "../node";
import { NodesField } from "../task";

export interface IAnswerNode extends INode {
  question: string;
}

export const AnswerNodeSchema = new mongoose.Schema<IAnswerNode>({
  ...NodeSchemaInit,
  question: { type: String, required: true },
});

export const AnswerNodeName = "AnswerNode";
NodesField.discriminator(AnswerNodeName, AnswerNodeSchema);
