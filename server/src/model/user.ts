import mongoose from "mongoose";
import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_STRING_LENGTH,
} from "../pre-start/constants";
import { passwordsMatch, hashPassword } from "./utils";
import { ProgressInput, ProgressSchema } from "./progress";

/** Interface for creating a new user */
export interface UserInput {
  name: string;
  email: string;
  password: string;
  disabilities: string;
}

export const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: MIN_STRING_LENGTH,
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: MIN_PASSWORD_LENGTH,
    maxlength: MAX_PASSWORD_LENGTH,
  },
  disabilities: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Disability",
      required: false,
      min: 1,
    },
  ],
  progress: { type: ProgressSchema, required: true, default: () => ({}) },
}, {
  timestamps: true,
  discriminatorKey: 'user',
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
  return passwordsMatch(pass, this.password as string);
};

/** Interface for retrieving user registers */
export interface UserDocument extends mongoose.Document, UserInput {
  progress: ProgressInput;
  passwordMatches(pass: string): Promise<boolean>;
}

export const User = mongoose.model<UserDocument>("User", UserSchema);
