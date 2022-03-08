import mongoose from "mongoose";

export interface INode {
  title: string;
}

export const NodeSchemaInit = {
  title: { type: String, required: true, minlength: 2 },
};

export const NodeSchema = new mongoose.Schema<INode>(NodeSchemaInit);
