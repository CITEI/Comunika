import mongoose from 'mongoose';
import { PASS_RESET_EXPIRATION } from '../pre-start/constants';

export interface AccountTokenInput {
  email: string;
  token: string;
}

const AccountTokenSchema = new mongoose.Schema({
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

AccountTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: PASS_RESET_EXPIRATION });

export interface AccountTokenDocument extends mongoose.Document, AccountTokenInput { };

export const AccountToken = mongoose.model<AccountTokenDocument>('AccountToken', AccountTokenSchema);