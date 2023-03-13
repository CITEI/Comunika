import mongoose from "mongoose";
import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_STRING_LENGTH,
} from "../pre-start/constants";
import isEmail from "validator/lib/isEmail";
import { passwordsMatch, hashPassword } from "./utils";
import { ProgressInput, ProgressSchema } from "./progress";

/** Interface for creating a new user */
export interface UserInput {
  email: string;
  password: string;
  guardian: string;
  relationship: string;
  createdAt: Date;
  birth: Date;
  region: string;
  disabilities: string;
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
  createdAt: {
    type: Date,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: MIN_PASSWORD_LENGTH,
    maxlength: MAX_PASSWORD_LENGTH,
  },
  guardian: { type: String, required: true, minlength: MIN_STRING_LENGTH },
  relationship: { type: String, required: true, minlength: MIN_STRING_LENGTH },
  birth: { type: Date, required: true },
  region: { type: String, required: true, minlength: MIN_STRING_LENGTH },
  disabilities: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Disability",
      required: true,
      min: 1,
    },
  ],
  progress: { type: ProgressSchema, required: true, default: () => ({}) },
});

// Hashes password before saving to db
UserSchema.pre("save", async function (next) {
  this.password = await hashPassword(this.password as string);
  next();
});

/**
 * Checks if a string matches the user password
 */
UserSchema.methods.passwordMatches = async function (
  pass: string
): Promise<boolean> {
  return passwordsMatch(pass, this.password as string);
};

/** Interface for retrieving user registers */
export interface UserDocument extends mongoose.Document, UserInput {
  progress: ProgressInput;
  passwordMatches(pass: string): Promise<boolean>;
}

export const User = mongoose.model<UserDocument>("User", UserSchema);
