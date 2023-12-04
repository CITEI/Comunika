import mongoose from 'mongoose';
import { User, UserInput } from './user';
import { MIN_STRING_LENGTH } from '../pre-start/constants';

export interface EducatorInput extends UserInput {
  school: string,
  numberOfDisabledStudents: number,
}

const Educator = User.discriminator('Educator', new mongoose.Schema({
  school: {
    type: String,
    required: true,
    minlength: MIN_STRING_LENGTH,
  }, 
  numberOfDisabledStudents: {
    type: Number,
    required: true,
  }
}));

export default Educator;