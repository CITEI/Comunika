import mongoose from "mongoose";
import { MIN_STRING_LENGTH } from "src/pre-start/constants";

/*
Creating regular nodes
Regular nodes are a specific type of node used for displaying
data to the user
 */
export interface NodeInput {
  type: string;
  title: string;
}

export const NodeSchemaInit = {
  title: { type: String, required: true, minlength: MIN_STRING_LENGTH },
};

const NO_ID = { _id: false };

export const NodeSchema = new mongoose.Schema(NodeSchemaInit, {
  discriminatorKey: "type",
  ...NO_ID,
});

/*
Creating regular node children
The nodes declared below are similar to concrete classes of Node
*/
const TextNodeSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
  },
  NO_ID
);
const ImageNodeSchema = new mongoose.Schema(
  {
    imageAlt: { type: String, required: false },
    imageUrl: { type: String, required: true },
  },
  NO_ID
);
export const NodeDiscriminators = {
  text: TextNodeSchema,
  image: ImageNodeSchema,
};

/*
 * Question nodes definition
 */
export interface QuestionNodeInput extends NodeInput {
  question: string;
}

export const QuestionNodeSchemaInit = {
  ...NodeSchemaInit,
  question: { type: String, required: true, minlength: MIN_STRING_LENGTH },
};

export const QuestionNodeSchema = new mongoose.Schema(
  QuestionNodeSchemaInit,
  NO_ID
);
