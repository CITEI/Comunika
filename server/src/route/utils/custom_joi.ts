import { Joi } from "celebrate";
import { MIN_STRING_LENGTH } from "../../pre-start/constants";

export const CustomJoi = {
  ObjectId: () => Joi.string().length(24),
  String: () => Joi.string().min(MIN_STRING_LENGTH),
  RequiredString: () => Joi.string().min(MIN_STRING_LENGTH).required(),
};
