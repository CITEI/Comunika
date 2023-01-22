import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail";

export interface CodeInput {
  email: string;
  code: string;
}

export const CodeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      validate: {
        validator: isEmail,
        message: "Please enter a valid email address",
      },
    },
    code: { type: String, required: true },
    expiresAt: {
      type: Date,
      default: new Date().getTime() + 10 * 60 * 1000,
      expires: 10 * 60 * 1000,
    },
  },
  { timestamps: true }
);

export interface CodeDocument extends mongoose.Document, CodeInput {}

export const Code = mongoose.model<CodeDocument>("Code", CodeSchema);
