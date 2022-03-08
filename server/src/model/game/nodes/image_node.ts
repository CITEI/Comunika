import mongoose from "mongoose";
import { INode, NodeSchemaInit } from "../node";
import { NodesField } from "../task";

export interface IImageNode extends INode {
  text?: string;
  imgUrl: string;
}

export const ImageNodeSchema = new mongoose.Schema<IImageNode>({
  ...NodeSchemaInit,
  text: { type: String, required: false },
  imgUrl: { type: String, required: true },
});

export const ImageNodeName = "ImageNode";
NodesField.discriminator(ImageNodeName, ImageNodeSchema);
