import {Joi} from "celebrate"
import { MIN_STRING_LENGTH } from "src/pre-start/constants"

export const CustomJoi = {
  ObjectId: () => Joi.string().length(24),
  RequiredString: () => Joi.string().min(MIN_STRING_LENGTH).required(),
}
