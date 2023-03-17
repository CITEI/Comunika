import mongoose from 'mongoose';
import { PASS_RESET_EXPIRATION } from '../pre-start/constants';

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
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

TokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: PASS_RESET_EXPIRATION });

export interface TokenDocument extends mongoose.Document, TokenInput { }

export const Token = mongoose.model<TokenDocument>('Token', TokenSchema);