import {Joi} from "celebrate"

export const CustomJoi = {
  ObjectId: () => Joi.string().length(24),
  RequiredString: () => Joi.string().min(3).required(),
}
