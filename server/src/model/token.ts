import mongoose from 'mongoose';
import { PASS_RESET_EXPIRATION } from '../pre-start/constants';
import { hashPassword, passwordsMatch } from './utils';

export interface TokenInput {
  email: string;
  token: string;
}

const TokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    default: new Date().getTime() + PASS_RESET_EXPIRATION * 1000,
    expires: PASS_RESET_EXPIRATION
  }
});

TokenSchema.pre('save', async function (next) {
  this.token = await hashPassword(this.token as string);
  next();
});

TokenSchema.methods.tokenMatches = async function (token: string): Promise<boolean> {
  return passwordsMatch(token, this.token);
}

export interface TokenDocument extends mongoose.Document, TokenInput { }

export const Token = mongoose.model<TokenDocument>('Token', TokenSchema);