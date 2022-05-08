import {Joi} from "celebrate"

export const CustomJoi = {
  ObjectId: () => Joi.string().length(24)
}
