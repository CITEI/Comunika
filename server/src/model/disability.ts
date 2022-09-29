import mongoose from "mongoose";

export interface DisabilityInput {
  name: string;
}

export const DisabilitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

export interface DisabilityDocument
  extends mongoose.Document,
    DisabilityInput {}

export const Disability = mongoose.model<DisabilityDocument>(
  "Disability",
  DisabilitySchema
);
