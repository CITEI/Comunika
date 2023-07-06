import {Joi} from "celebrate"
import { MIN_STRING_LENGTH } from "../../pre-start/constants"
import { UploadFlags } from "../admin/utils/functions"

export const CustomJoi = {
  ObjectId: () => Joi.string().length(24),
  String: () => Joi.string().min(MIN_STRING_LENGTH),
  RequiredString: () => Joi.string().min(MIN_STRING_LENGTH).required(),
  UploadStatus: () => Joi.string().invalid(UploadFlags.invalid),
}
