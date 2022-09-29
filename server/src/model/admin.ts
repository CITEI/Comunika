import mongoose from "mongoose";
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH, MIN_STRING_LENGTH } from "../pre-start/constants";
import isEmail from "validator/lib/isEmail";
import { passwordsMatch, hashPassword } from "./utils";

/** Interface for creating a new admin */
export interface AdminInput {
  email: string;
  password: string;
  name: string;
  invitedBy: string | null;
}

export const AdminSchema = new mongoose.Schema({
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
    minlength: MIN_PASSWORD_LENGTH,
    maxlength: MAX_PASSWORD_LENGTH,
  },
  name: { type: String, required: true, minlength: MIN_STRING_LENGTH },
  invitedBy: {
    type: mongoose.Types.ObjectId,
    ref: "Admin",
    required: false,
  },
});

/**
 * Hashes password before saving to db
 */
AdminSchema.pre("save", async function (next) {
  if (this.password.length <= MAX_PASSWORD_LENGTH) // not encrypted
    this.password = await hashPassword(this.password);
  next();
});

/**
 * Checks if a string matches the user password
 */
AdminSchema.methods.passwordMatches = async function (
  pass: string
): Promise<boolean> {
  return passwordsMatch(pass, this.password);
};

export interface AdminDocument extends mongoose.Document, AdminInput {
  passwordMatches(pass: string): Promise<boolean>;
}

export const Admin = mongoose.model<AdminDocument>("Admin", AdminSchema);
