import mongoose from 'mongoose';
import { User, UserInput } from './user';
import { MIN_STRING_LENGTH } from '../pre-start/constants';

export interface ParentInput extends UserInput {
  relationship: string,
  birth: Date,
  region: string,
}

const Parent = User.discriminator('Parent', new mongoose.Schema({
  relationship: {
    type: String,
    required: false,
    minlength: MIN_STRING_LENGTH,
  },
  birth: {
    type: Date,
    required: false
  },
  region: {
    type: String,
    required: false,
    minlength: MIN_STRING_LENGTH
  },
}));

export default Parent;