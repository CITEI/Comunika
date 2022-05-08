import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail";
import { passwordsMatch, hashPassword } from "../utils";
import { ProgressDocument, ProgressSchema } from "./progress";

/** Interface for creating a new user */
export interface UserInput {
  email: string;
  password: string;
  name: string;
}

export const UserSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  name: { type: String, required: true, minlength: 2 },
  progress: { type: ProgressSchema, required: true, default: () => ({}) },
});

// Hashes password before saving to db
UserSchema.pre("save", async function (next) {
  this.password = await hashPassword(this.password);
  next();
});

/**
 * Checks if a string matches the user password
 */
UserSchema.methods.passwordMatches = async function (
  pass: string
): Promise<boolean> {
  return passwordsMatch(pass, this.password);
};

/**
 * Calculates the percentage of correctly answered box questions
 */
UserSchema.methods.calculateScore = function (): number {
  // trues / total
  const box = (this as UserDocument).progress.box;
  return (
    box.tasks.reduce((sum: number, el) => sum + Number(el.answer), 0) /
    box.tasks.length
  );
};

/**
 * Checks if a user achieved the minimum requirements to advance
 */
UserSchema.methods.isApproved = function (): boolean {
  return this.calculateScore() > 0.7;
};

/** Interface for retrieving user registers */
export interface UserDocument extends mongoose.Document, UserInput {
  progress: ProgressDocument;
  passwordMatches(pass: string): Promise<boolean>;
  calculateScore(): number;
  isApproved(): boolean;
}

export const User = mongoose.model<UserDocument>("User", UserSchema);
