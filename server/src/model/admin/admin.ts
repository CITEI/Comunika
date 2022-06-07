import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail";
import { passwordsMatch, hashPassword } from "../utils";

/** Interface for creating a new admin */
export interface AdminInput {
  email: string;
  password: string;
  name: string;
  invitedBy: string;
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
    minlength: 8,
  },
  name: { type: String, required: true, minlength: 2 },
  invitedBy: { type: mongoose.Types.ObjectId, ref: "Admin", required: false },
});

/**
 * Hashes password before saving to db
 */
AdminSchema.pre("save", async function (next) {
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
