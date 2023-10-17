import mongoose from "mongoose";
import { MIN_STRING_LENGTH } from "../pre-start/constants";

/*
Creating regular nodes
Regular nodes are a specific type of node used for displaying
data to the user
 */
export interface NodeInput {
  type: string;
}

export const NodeSchemaInit = {};

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
    image: { type: String, required: true },
    imageAlt: { type: String, required: true },
    audio: { type: String, required: false },
    position: { type: String, required: false }
  },
  NO_ID
);

/**
 * This node stores a list of images and its descriptions
 */
const CarrouselNodeSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    images: {
      type: [
        {
          image: { type: String, required: false },
          imageAlt: { type: String, required: false },
          audio: { type: String, required: false },
          uniqueText: { type: String, required: false }
        },
      ],
      required: true,
      minlength: 1,
    },
    preview: { type: Boolean, required: true, default: false }
  },
  NO_ID
);

/**
 * An object containing all types of nodes
 */
export const NodeDiscriminators = {
  text: TextNodeSchema,
  carrousel: CarrouselNodeSchema,
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
  notes: { type: String, required: false },
};

export const QuestionNodeSchema = new mongoose.Schema(
  QuestionNodeSchemaInit,
  NO_ID
);
