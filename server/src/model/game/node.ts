import mongoose from "mongoose";

/*
Creating regular nodes
Regular nodes are a specific type of node used for displaying
data to the user
 */
export interface NodeInput {
  title: string;
}

export const NodeSchemaInit = {
  title: { type: String, required: true, minlength: 2 },
};

const NO_ID = {_id: false}

export const NodeSchema = new mongoose.Schema(NodeSchemaInit, {
  discriminatorKey: "type",
  ...NO_ID
});

/*
Creating regular node children
The nodes declared below are similar to concrete classes of Node
*/
const TextNodeSchema = new mongoose.Schema({
  text: { type: String, required: true },
}, NO_ID);
const ImageNodeSchema = new mongoose.Schema({
  imageAlt: { type: String, required: false },
  imageUrl: { type: String, required: true },
}, NO_ID);
export const NodeDiscriminators = {
  Text: TextNodeSchema,
  Image: ImageNodeSchema
}

/*
Creating question nodes
Question nodes, similarly to nodes, are a kind of node that not only focuses
on displaying data, but also on the answer evaluation
*/
export interface QuestionNodeInput extends NodeInput {
  question: string;
}

export const QuestionNodeSchemaInit = {
  ...NodeSchemaInit,
  question: { type: String, required: true, minlength: 3 },
};

export const QuestionNodeSchema = new mongoose.Schema(QuestionNodeSchemaInit, {
  discriminatorKey: "type",
  ...NO_ID
});

/*
Creating question node children
The nodes declared below are similar to concrete classes of QuestionNode
*/
const YesNoQuestionNodeSchema = new mongoose.Schema({}, NO_ID);
export const QuestionNodeDiscriminators = {
  YesNo: YesNoQuestionNodeSchema,
}
