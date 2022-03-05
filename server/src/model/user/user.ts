import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail";
import isAlphanumeric from "validator/lib/isAlphanumeric";
import bcrypt from "bcrypt";

// constants
const SALT_ROUNDS = 10;

// functions
function bcryptHash(pass: string): string {
  return bcrypt.hashSync(pass, SALT_ROUNDS);
}

// model
export interface IUser {
  email: string;
  password: string;
  name: string;
}

const schema = new mongoose.Schema<IUser>({
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

// middlewares
schema.pre("save", function (next) {
  this.password = bcryptHash(this.password);
  next();
});

// methods
schema.methods.comparePasswords = function (pass: string): boolean {
  return this.password == bcryptHash(pass);
};

export const User = mongoose.model<IUser>("User", schema);
