import mongoose from "mongoose";
import { INode, NodeSchemaInit } from "../node";
import { NodesField } from "../task";

export interface ITextNode extends INode {
  text: string;
}

export const TextNodeSchema = new mongoose.Schema<ITextNode>({
  ...NodeSchemaInit,
  text: { type: String, required: true },
});

export const TextNodeName = "TextNode";
NodesField.discriminator(TextNodeName, TextNodeSchema);
