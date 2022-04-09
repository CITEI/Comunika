import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail";
import { passwordsMatch, hashPassword } from "../utils";


/** Interface for creating a new user */
export interface IUser {
  email: string;
  password: string;
  name: string;
}

export const userSchema = new mongoose.Schema({
  email: {
    type: "string",
    required: true,
    index: true,
    unique: true,
    validate: {
      validator: isEmail,
      message: "Please enter a valid email address",
    },
  },
  password: {
    type: "string",
    required: true,
    minlength: 8,
  },
  name: { type: "string", required: true, minlength: 2 },
});

// Hashes password before saving to db
userSchema.pre("save", async function (next) {
  this.password = await hashPassword(this.password);
  next();
});

// Hashes password and compares with the saved hash
userSchema.methods.passwordMatches =
async function (pass: string): Promise<boolean> {
  return passwordsMatch(pass, this.password);
};

/** Interface for retrieving user registers */
export interface IUserDocument extends mongoose.Document, IUser {
  passwordMatches(pass: string): Promise<boolean>;
}

export const User = mongoose.model<IUserDocument>("User", userSchema);
